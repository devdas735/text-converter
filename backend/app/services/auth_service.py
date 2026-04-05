from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest


class DuplicateEmailError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def get_user_by_id(db: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    return db.scalar(statement)


def create_user(db: Session, payload: SignupRequest) -> User:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise DuplicateEmailError('Email is already registered')

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User:
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise InvalidCredentialsError('Invalid email or password')

    return user
