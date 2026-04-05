from app.tts.base import TTSProvider


class EdgeTTSProvider(TTSProvider):
    provider_name = 'edge-tts'

    @staticmethod
    def _speed_to_rate(speed: float) -> str:
        safe_speed = max(0.5, min(2.0, speed))
        percentage = int((safe_speed - 1.0) * 100)
        return f'{percentage:+d}%'

    async def synthesize_chunk(
        self,
        text: str,
        *,
        voice_name: str,
        language_code: str,
        speed: float,
    ) -> bytes:
        try:
            import edge_tts
        except ImportError as exc:
            raise RuntimeError('edge-tts is required for the EdgeTTSProvider') from exc

        full_voice = voice_name
        if '-' not in voice_name and language_code:
            full_voice = f'{language_code}-{voice_name}'

        communicate = edge_tts.Communicate(
            text=text,
            voice=full_voice,
            rate=self._speed_to_rate(speed),
        )

        audio_chunks: list[bytes] = []
        async for event in communicate.stream():
            if event.get('type') == 'audio':
                audio_chunks.append(event['data'])

        if not audio_chunks:
            raise RuntimeError('TTS provider returned no audio data')

        return b''.join(audio_chunks)

    async def list_voices(self) -> list[dict]:
        try:
            import edge_tts
        except ImportError as exc:
            raise RuntimeError('edge-tts is required for voice listing') from exc

        return await edge_tts.list_voices()
