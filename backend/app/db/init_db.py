from app.db.base import Base
from app.db.session import engine

# Ensure model metadata is registered before creating tables.
from app import models  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
