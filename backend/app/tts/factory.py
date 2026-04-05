from app.core.config import get_settings
from app.tts.base import TTSProvider
from app.tts.providers.edge_tts_provider import EdgeTTSProvider
from app.tts.providers.openai_tts_provider import OpenAITTSProvider

_PROVIDER_REGISTRY: dict[str, type[TTSProvider]] = {
    'edge-tts': EdgeTTSProvider,
    'openai-tts': OpenAITTSProvider,
}


def get_tts_provider(provider_name: str | None = None) -> TTSProvider:
    settings = get_settings()
    resolved_name = (provider_name or settings.tts_provider).strip().lower()

    provider_cls = _PROVIDER_REGISTRY.get(resolved_name)
    if not provider_cls:
        supported = ', '.join(sorted(_PROVIDER_REGISTRY.keys()))
        raise ValueError(f'Unsupported tts provider: {resolved_name}. Supported: {supported}')

    return provider_cls()


def get_supported_tts_providers() -> list[str]:
    return sorted(_PROVIDER_REGISTRY.keys())
