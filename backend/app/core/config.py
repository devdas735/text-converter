from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = 'Text Converter API'
    api_prefix: str = '/api'
    api_v1_prefix: str = '/v1'

    debug: bool = False

    backend_host: str = '0.0.0.0'
    backend_port: int = 8000
    output_dir: str = 'outputs'
    uploads_dir: str = 'uploads'
    tts_provider: str = 'edge-tts'
    openai_api_key: str | None = None
    openai_tts_model: str = 'gpt-4o-mini-tts'


    sqlite_db_file: str = 'text_converter.db'
    sqlalchemy_database_uri: str = Field(
        default='sqlite:///./text_converter.db',
        description='SQLAlchemy connection URI',
    )

    cors_origins: list[str] = ['http://localhost:5173', 'http://127.0.0.1:5173']

    jwt_secret_key: str = 'change-me-in-production'
    jwt_algorithm: str = 'HS256'
    jwt_access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.sqlalchemy_database_uri == 'sqlite:///./text_converter.db' and settings.sqlite_db_file:
        settings.sqlalchemy_database_uri = f'sqlite:///./{settings.sqlite_db_file}'
    return settings
