from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.daily_progress import DailyProgress
from app.schemas.daily_progress import DailyProgressCreate
from app.api.route.onboarding_router import get_current_user_data
from fastapi.security import HTTPAuthorizationCredentials
from app.authentication.auth import security,decode_access_token
from datetime import date

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/today")
def get_today_progress(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload_data = decode_access_token(token)

    if not payload_data or "user_id" not in payload_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload_data["user_id"]
    today = date.today()

    progress = db.query(DailyProgress).filter(
        DailyProgress.user_id == user_id,
        DailyProgress.date == today
    ).first()

    return {"exists": progress is not None, "data": progress}

@router.get("/history")
def get_progress_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload_data = decode_access_token(token)

    if not payload_data or "user_id" not in payload_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload_data["user_id"]

    history = db.query(DailyProgress).filter(
        DailyProgress.user_id == user_id
    ).order_by(DailyProgress.date.desc()).limit(30).all()

    return history

@router.post("/")
def save_daily_progress(
    payload: DailyProgressCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload_data = decode_access_token(token)

    if not payload_data or "user_id" not in payload_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload_data["user_id"]  

    existing = db.query(DailyProgress).filter(
        DailyProgress.user_id == user_id,
        DailyProgress.date == payload.date,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Progress already exists for today")

    progress = DailyProgress(
        user_id=user_id,
        date=payload.date,
        workout_completed=payload.workout_completed,
        steps_count=payload.steps_count,
        water_consumed=payload.water_consumed,
        sleep_hours=payload.sleep_hours,
        energy_level=payload.energy_level,
        hunger_level=payload.hunger_level,
        meal_adherence=payload.meal_adherence,
    )

    db.add(progress)
    db.commit()
    db.refresh(progress)

    return {"message": "Progress saved successfully"}
