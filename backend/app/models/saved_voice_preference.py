from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SavedVoicePreference(Base):
    __tablename__ = 'saved_voice_preferences'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        unique=True,
        index=True,
    )
    default_voice_name: Mapped[str] = mapped_column(String(120), nullable=False)
    default_language_code: Mapped[str] = mapped_column(String(20), nullable=False)
    default_speed: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    user: Mapped['User'] = relationship(back_populates='saved_voice_preference')
