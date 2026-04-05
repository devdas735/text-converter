from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.conversion import Conversion, ConversionStatus
from app.models.user import User
from app.schemas.conversion import ConversionResponse
from app.tts.service import TTSRequest, TextToSpeechService
from app.utils.text_extraction import extract_text_from_file

ALLOWED_UPLOAD_EXTENSIONS = {'.txt', '.docx', '.pdf'}


class InvalidUploadFileError(ValueError):
    pass


class ConversionProcessingError(RuntimeError):
    pass


def _clean_text(text: str) -> str:
    return ' '.join(text.split()).strip()


def _to_response(conversion: Conversion) -> ConversionResponse:
    output_url = None
    if conversion.output_audio_filename:
        output_url = f'/api/v1/conversions/download/{conversion.output_audio_filename}'

    return ConversionResponse(
        conversion_id=conversion.id,
        extracted_text=conversion.extracted_text,
        output_audio_url=output_url,
        output_audio_filename=conversion.output_audio_filename,
        voice_name=conversion.voice_name,
        language_code=conversion.language_code,
        speed=conversion.speed,
        status=conversion.status,
    )


def save_upload_file(upload_file: UploadFile) -> Path:
    settings = get_settings()
    uploads_dir = Path(settings.uploads_dir)
    uploads_dir.mkdir(parents=True, exist_ok=True)

    filename = upload_file.filename or ''
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_UPLOAD_EXTENSIONS:
        raise InvalidUploadFileError('Unsupported file type. Allowed: .txt, .docx, .pdf')

    output_name = f'upload_{uuid4().hex}{extension}'
    output_path = uploads_dir / output_name

    with output_path.open('wb') as f:
        f.write(upload_file.file.read())

    return output_path


def create_conversion_record(
    db: Session,
    *,
    user: User,
    input_type: str,
    original_filename: str | None,
    extracted_text: str,
    voice_name: str,
    language_code: str,
    speed: float,
    status: ConversionStatus = ConversionStatus.pending,
) -> Conversion:
    conversion = Conversion(
        user_id=user.id,
        input_type=input_type,
        original_filename=original_filename,
        extracted_text=extracted_text,
        voice_name=voice_name,
        language_code=language_code,
        speed=speed,
        status=status,
    )
    db.add(conversion)
    db.commit()
    db.refresh(conversion)
    return conversion


def process_conversion_record(db: Session, conversion: Conversion) -> Conversion:
    conversion.status = ConversionStatus.processing
    conversion.error_message = None
    db.add(conversion)
    db.commit()
    db.refresh(conversion)

    try:
        tts_service = TextToSpeechService()
        tts_result = tts_service.synthesize(
            TTSRequest(
                text=conversion.extracted_text,
                voice_name=conversion.voice_name,
                language_code=conversion.language_code,
                speed=conversion.speed,
            )
        )
    except Exception as exc:  # status tracking for queue/background worker compatibility
        conversion.status = ConversionStatus.failed
        conversion.error_message = str(exc)
        db.add(conversion)
        db.commit()
        db.refresh(conversion)
        raise ConversionProcessingError(str(exc)) from exc

    conversion.output_audio_path = tts_result.output_file_path
    conversion.output_audio_filename = tts_result.output_filename
    conversion.status = ConversionStatus.completed
    conversion.error_message = None
    db.add(conversion)
    db.commit()
    db.refresh(conversion)

    return conversion


def create_and_optionally_process_conversion(
    db: Session,
    *,
    user: User,
    text: str,
    voice_name: str,
    language_code: str,
    speed: float,
    input_type: str,
    original_filename: str | None = None,
    process_synchronously: bool = True,
) -> ConversionResponse:
    cleaned_text = _clean_text(text)
    if not cleaned_text:
        raise ValueError('Extracted text is empty')

    conversion = create_conversion_record(
        db,
        user=user,
        input_type=input_type,
        original_filename=original_filename,
        extracted_text=cleaned_text,
        voice_name=voice_name,
        language_code=language_code,
        speed=speed,
        status=ConversionStatus.pending,
    )

    if process_synchronously:
        conversion = process_conversion_record(db, conversion)

    return _to_response(conversion)


def convert_text_and_store(
    db: Session,
    *,
    user: User,
    text: str,
    voice_name: str,
    language_code: str,
    speed: float,
    input_type: str,
    original_filename: str | None = None,
) -> ConversionResponse:
    return create_and_optionally_process_conversion(
        db,
        user=user,
        text=text,
        voice_name=voice_name,
        language_code=language_code,
        speed=speed,
        input_type=input_type,
        original_filename=original_filename,
        process_synchronously=True,
    )


def extract_text_from_upload(upload_path: Path) -> str:
    return extract_text_from_file(upload_path)
