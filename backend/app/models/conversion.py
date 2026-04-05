from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ConversionStatus(str, Enum):
    pending = 'pending'
    processing = 'processing'
    completed = 'completed'
    failed = 'failed'


class Conversion(Base):
    __tablename__ = 'conversions'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)

    input_type: Mapped[str] = mapped_column(String(50), nullable=False)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    extracted_text: Mapped[str] = mapped_column(Text, nullable=False)

    voice_name: Mapped[str] = mapped_column(String(120), nullable=False)
    language_code: Mapped[str] = mapped_column(String(20), nullable=False)
    speed: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    output_audio_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    output_audio_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[ConversionStatus] = mapped_column(
        SQLEnum(ConversionStatus, name='conversion_status'),
        default=ConversionStatus.pending,
        nullable=False,
    )
    error_message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped['User'] = relationship(back_populates='conversions')
