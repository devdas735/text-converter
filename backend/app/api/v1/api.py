from fastapi import APIRouter

from app.api.v1.endpoints import auth, conversion, health, history

router = APIRouter()
router.include_router(health.router, tags=['health'])
router.include_router(auth.router, prefix='/auth', tags=['auth'])
router.include_router(conversion.router)
router.include_router(history.router)
