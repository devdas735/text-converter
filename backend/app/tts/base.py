from abc import ABC, abstractmethod


class TTSProvider(ABC):
    provider_name: str

    @abstractmethod
    async def synthesize_chunk(
        self,
        text: str,
        *,
        voice_name: str,
        language_code: str,
        speed: float,
    ) -> bytes:
        """Synthesize one text chunk and return audio bytes."""

    async def list_voices(self) -> list[dict]:
        """Return provider voice metadata list.

        Providers that do not support voice introspection can keep default behavior.
        """
        raise NotImplementedError(f'Voice listing is not implemented for provider: {self.provider_name}')
