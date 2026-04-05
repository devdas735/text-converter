from datetime import datetime

from pydantic import BaseModel

from app.models.conversion import ConversionStatus


class ConversionHistoryItem(BaseModel):
    id: int
    input_type: str
    original_filename: str | None
    extracted_text: str
    voice_name: str
    language_code: str
    speed: float
    output_audio_filename: str | None
    output_audio_url: str | None
    status: ConversionStatus
    created_at: datetime

    model_config = {'from_attributes': True}


class DeleteConversionResponse(BaseModel):
    deleted: bool
    conversion_id: int
