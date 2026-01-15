from fastapi import APIRouter,Depends
from app.schemas.workout_schema import WorkoutGenerateRequest
from app.ai.agents.workout_agent import run_workout_agent
from fastapi.security import HTTPAuthorizationCredentials
from app.authentication.auth import security
from app.api.route.onboarding_router import get_current_user_data
import re
import json

router = APIRouter(prefix="/workout", tags=["Workout"])


# @router.post("/generate")
# def generate_workout(data: WorkoutGenerateRequest,credentials:HTTPAuthorizationCredentials=Depends(security)):
#     """
#     Generate a workout plan and return it. Persisting is handled by the workflow nodes.
#     """
#     workout_plan = run_workout_agent(data.user_profile.model_dump())
#     # cleaned = re.sub(r"```json|```", "", workout_plan).strip()
#     # workout_plan_json = json.loads(cleaned)

#     return {"final_workout_plan": workout_plan}



@router.post("/generate")
def generate_workout(data: WorkoutGenerateRequest,current_user=Depends(get_current_user_data)):

    user_profile = data.user_profile.model_dump()

    user_profile["user_id"] = current_user["user"]["id"]

    workout_plan = run_workout_agent(user_profile)

    return {"final_workout_plan": workout_plan}
