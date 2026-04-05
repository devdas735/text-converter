from pydantic import BaseModel, Field

from app.models.conversion import ConversionStatus


class TextConversionRequest(BaseModel):
    text: str = Field(min_length=1)
    voice_name: str = Field(min_length=1, max_length=120)
    language_code: str = Field(min_length=1, max_length=20)
    speed: float = Field(default=1.0, ge=0.5, le=2.0)


class ConversionResponse(BaseModel):
    conversion_id: int
    extracted_text: str
    output_audio_url: str | None
    output_audio_filename: str | None
    voice_name: str
    language_code: str
    speed: float
    status: ConversionStatus


class VoiceOption(BaseModel):
    name: str
    short_name: str
    gender: str | None = None
    locale: str | None = None


class LanguageOption(BaseModel):
    code: str
