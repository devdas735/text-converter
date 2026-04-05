from app.core.config import get_settings
from app.tts.base import TTSProvider


class OpenAITTSProvider(TTSProvider):
    provider_name = 'openai-tts'

    @staticmethod
    def _normalize_speed(speed: float) -> float:
        return max(0.25, min(4.0, speed))

    async def synthesize_chunk(
        self,
        text: str,
        *,
        voice_name: str,
        language_code: str,
        speed: float,
    ) -> bytes:
        try:
            from openai import AsyncOpenAI
        except ImportError as exc:
            raise RuntimeError('openai package is required for OpenAITTSProvider') from exc

        settings = get_settings()
        if not settings.openai_api_key:
            raise RuntimeError('OPENAI_API_KEY is required when tts_provider=openai-tts')

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.audio.speech.create(
            model=settings.openai_tts_model,
            voice=voice_name,
            input=text,
            speed=self._normalize_speed(speed),
        )

        return response.content
