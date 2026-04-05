from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from app.core.config import get_settings
from app.tts.base import TTSProvider
from app.tts.factory import get_tts_provider
from app.tts.runtime import run_async


@dataclass(slots=True)
class TTSRequest:
    text: str
    voice_name: str
    language_code: str
    speed: float = 1.0


@dataclass(slots=True)
class TTSResult:
    output_file_path: str
    output_filename: str
    provider: str


def _clean_text(text: str) -> str:
    return ' '.join(text.split()).strip()


def _split_text(text: str, max_chars: int = 2500) -> list[str]:
    if len(text) <= max_chars:
        return [text]

    chunks: list[str] = []
    current = ''

    for sentence in text.replace('\n', ' ').split('. '):
        sentence = sentence.strip()
        if not sentence:
            continue

        candidate = f'{current} {sentence}'.strip() if current else sentence
        if len(candidate) <= max_chars:
            current = candidate
            continue

        if current:
            chunks.append(current)
            current = ''

        while len(sentence) > max_chars:
            chunks.append(sentence[:max_chars])
            sentence = sentence[max_chars:]

        current = sentence

    if current:
        chunks.append(current)

    return chunks or [text[:max_chars]]


class TextToSpeechService:
    def __init__(self, provider: TTSProvider | None = None, output_dir: str | Path | None = None) -> None:
        settings = get_settings()
        self.provider = provider or get_tts_provider(settings.tts_provider)
        self.output_dir = Path(output_dir or settings.output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def synthesize(self, request: TTSRequest) -> TTSResult:
        cleaned_text = _clean_text(request.text)
        if not cleaned_text:
            raise ValueError('Text is empty after cleaning')

        chunks = _split_text(cleaned_text)

        audio_parts: list[bytes] = []
        for chunk in chunks:
            part = run_async(
                self.provider.synthesize_chunk(
                    chunk,
                    voice_name=request.voice_name,
                    language_code=request.language_code,
                    speed=request.speed,
                )
            )
            audio_parts.append(part)

        filename = f'tts_{uuid4().hex}.mp3'
        output_path = self.output_dir / filename
        output_path.write_bytes(b''.join(audio_parts))

        return TTSResult(
            output_file_path=str(output_path),
            output_filename=filename,
            provider=self.provider.provider_name,
        )
