from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from app.schemas.conversion import ConversionResponse, LanguageOption, TextConversionRequest, VoiceOption
from app.services.conversion_service import (
    ConversionProcessingError,
    InvalidUploadFileError,
    create_and_optionally_process_conversion,
    extract_text_from_upload,
    save_upload_file,
)
from app.tts.factory import get_tts_provider
from app.tts.runtime import run_async

router = APIRouter(prefix='/conversions', tags=['conversions'])


@router.post('/text', response_model=ConversionResponse)
def convert_pasted_text(
    payload: TextConversionRequest,
    process_synchronously: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversionResponse:
    if not payload.text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Text cannot be empty')

    try:
        return create_and_optionally_process_conversion(
            db,
            user=current_user,
            text=payload.text,
            voice_name=payload.voice_name,
            language_code=payload.language_code,
            speed=payload.speed,
            input_type='text',
            process_synchronously=process_synchronously,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except ConversionProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc


@router.post('/file', response_model=ConversionResponse)
def upload_file_and_convert(
    file: UploadFile = File(...),
    voice_name: str = Form(...),
    language_code: str = Form(...),
    speed: float = Form(1.0),
    process_synchronously: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversionResponse:
    try:
        upload_path = save_upload_file(file)
        extracted_text = extract_text_from_upload(upload_path)
        return create_and_optionally_process_conversion(
            db,
            user=current_user,
            text=extracted_text,
            voice_name=voice_name,
            language_code=language_code,
            speed=speed,
            input_type='file',
            original_filename=file.filename,
            process_synchronously=process_synchronously,
        )
    except InvalidUploadFileError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except ConversionProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc


@router.get('/download/{filename}')
def download_generated_audio(filename: str) -> FileResponse:
    safe_filename = Path(filename).name
    output_path = Path(get_settings().output_dir) / safe_filename

    if not output_path.exists() or not output_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Audio file not found')

    return FileResponse(path=output_path, filename=safe_filename, media_type='audio/mpeg')


@router.get('/voices', response_model=list[VoiceOption])
def get_available_voice_options() -> list[VoiceOption]:
    provider = get_tts_provider()

    try:
        voices_data = run_async(provider.list_voices())
    except NotImplementedError as exc:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    return [
        VoiceOption(
            name=voice.get('FriendlyName', voice.get('Name', '')),
            short_name=voice.get('ShortName', ''),
            gender=voice.get('Gender'),
            locale=voice.get('Locale'),
        )
        for voice in voices_data
    ]


@router.get('/languages', response_model=list[LanguageOption])
def get_supported_languages() -> list[LanguageOption]:
    provider = get_tts_provider()

    try:
        voices_data = run_async(provider.list_voices())
    except NotImplementedError as exc:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    language_codes = sorted({voice.get('Locale') for voice in voices_data if voice.get('Locale')})
    return [LanguageOption(code=code) for code in language_codes]
