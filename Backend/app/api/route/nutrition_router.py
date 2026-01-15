from fastapi import APIRouter,Depends
from app.schemas.nutrition_schema import NutritionGenerateRequest
from app.ai.agents.nutrition_agent import run_nutrition_agent
from fastapi.security import HTTPAuthorizationCredentials
from app.authentication.auth import security
from app.api.route.onboarding_router import get_current_user_data
import re
import json

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])


@router.post("/generate")
def generate_nutrition(data: NutritionGenerateRequest,credentials:HTTPAuthorizationCredentials=Depends(security),current_user=Depends(get_current_user_data)):

    # user_profile = data.user_profile.model_dump()
    user_profile = data.user_profile


    user_profile["user_id"] = current_user["user"]["id"]
    print("DEBUG nutrition user_id:", user_profile["user_id"])

    meal_plan = run_nutrition_agent(user_profile)
    return {"meal_plan": meal_plan.get("meal_plan", meal_plan)}



