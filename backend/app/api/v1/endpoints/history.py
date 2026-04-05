from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from app.schemas.history import ConversionHistoryItem, DeleteConversionResponse
from app.services.history_service import (
    delete_user_conversion,
    get_user_conversion_item_or_404,
    get_user_conversions,
    regenerate_conversion,
)

router = APIRouter(prefix='/history', tags=['history'])


@router.get('', response_model=list[ConversionHistoryItem])
def list_conversion_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ConversionHistoryItem]:
    return get_user_conversions(db, current_user)


@router.get('/{conversion_id}', response_model=ConversionHistoryItem)
def get_conversion_history_item(
    conversion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversionHistoryItem:
    return get_user_conversion_item_or_404(db, current_user, conversion_id)


@router.delete('/{conversion_id}', response_model=DeleteConversionResponse, status_code=status.HTTP_200_OK)
def delete_conversion_history_item(
    conversion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DeleteConversionResponse:
    delete_user_conversion(db, current_user, conversion_id)
    return DeleteConversionResponse(deleted=True, conversion_id=conversion_id)


@router.post('/{conversion_id}/regenerate', response_model=ConversionHistoryItem, status_code=status.HTTP_201_CREATED)
def regenerate_conversion_history_item(
    conversion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversionHistoryItem:
    return regenerate_conversion(db, current_user, conversion_id)
