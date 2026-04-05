from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.conversion import Conversion
from app.models.user import User
from app.schemas.history import ConversionHistoryItem
from app.services.conversion_service import create_and_optionally_process_conversion


def _to_history_item(conversion: Conversion) -> ConversionHistoryItem:
    output_audio_url = None
    if conversion.output_audio_filename:
        output_audio_url = f'/api/v1/conversions/download/{conversion.output_audio_filename}'

    return ConversionHistoryItem(
        id=conversion.id,
        input_type=conversion.input_type,
        original_filename=conversion.original_filename,
        extracted_text=conversion.extracted_text,
        voice_name=conversion.voice_name,
        language_code=conversion.language_code,
        speed=conversion.speed,
        output_audio_filename=conversion.output_audio_filename,
        output_audio_url=output_audio_url,
        status=conversion.status,
        created_at=conversion.created_at,
    )


def get_user_conversions(db: Session, user: User) -> list[ConversionHistoryItem]:
    statement = select(Conversion).where(Conversion.user_id == user.id).order_by(Conversion.created_at.desc())
    rows = db.scalars(statement).all()
    return [_to_history_item(row) for row in rows]


def get_user_conversion_or_404(db: Session, user: User, conversion_id: int) -> Conversion:
    statement = select(Conversion).where(
        Conversion.id == conversion_id,
        Conversion.user_id == user.id,
    )
    conversion = db.scalar(statement)
    if not conversion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Conversion not found')
    return conversion


def get_user_conversion_item_or_404(db: Session, user: User, conversion_id: int) -> ConversionHistoryItem:
    conversion = get_user_conversion_or_404(db, user, conversion_id)
    return _to_history_item(conversion)


def delete_user_conversion(db: Session, user: User, conversion_id: int) -> None:
    conversion = get_user_conversion_or_404(db, user, conversion_id)

    if conversion.output_audio_path:
        audio_path = Path(conversion.output_audio_path)
        if audio_path.exists() and audio_path.is_file():
            audio_path.unlink(missing_ok=True)

    db.execute(delete(Conversion).where(Conversion.id == conversion.id, Conversion.user_id == user.id))
    db.commit()


def regenerate_conversion(db: Session, user: User, conversion_id: int) -> ConversionHistoryItem:
    existing = get_user_conversion_or_404(db, user, conversion_id)

    regenerated = create_and_optionally_process_conversion(
        db,
        user=user,
        text=existing.extracted_text,
        voice_name=existing.voice_name,
        language_code=existing.language_code,
        speed=existing.speed,
        input_type=existing.input_type,
        original_filename=existing.original_filename,
        process_synchronously=True,
    )

    statement = select(Conversion).where(Conversion.id == regenerated.conversion_id)
    new_conversion = db.scalar(statement)
    if not new_conversion:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to regenerate conversion')

    return _to_history_item(new_conversion)
