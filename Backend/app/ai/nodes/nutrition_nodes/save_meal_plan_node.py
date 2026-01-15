from datetime import datetime
from app.ai.graphs.nutrition_state import nutritionState
from app.db.database import sessionLocal
from app.models.nutrition_plan_model import NutritionPlan
import json, re
from langchain_core.messages import AIMessage
from pydantic import BaseModel

def save_meal_plan_node(state: nutritionState) -> nutritionState:
    user_profile = state.get("user_profile", {})
    # meal_plan = state.get("meal_plan",{})
    raw_meal_plan = state.get("meal_plan")

    if not raw_meal_plan:
        print("[ERROR] meal_plan missing")
        return state

    # ✅ CASE 1: AIMessage (already handled earlier, keep for safety)
    if isinstance(raw_meal_plan, AIMessage):
        raw_meal_plan = raw_meal_plan.content

    # ✅ CASE 2: Pydantic Schema (THIS IS YOUR CURRENT ERROR)
    if isinstance(raw_meal_plan, BaseModel):
        meal_plan = raw_meal_plan.model_dump()

    # ✅ CASE 3: string JSON
    elif isinstance(raw_meal_plan, str):
        raw_meal_plan = raw_meal_plan.replace("```json", "").replace("```", "").strip()
        try:
            meal_plan = json.loads(raw_meal_plan)
        except json.JSONDecodeError as e:
            print("[ERROR] meal_plan JSON parse failed:", e)
            return state

    # ✅ CASE 4: already a dict
    elif isinstance(raw_meal_plan, dict):
        meal_plan = raw_meal_plan

    else:
        print("[ERROR] meal_plan invalid type:", type(raw_meal_plan))
        return state

    user_id = user_profile.get("user_id")
    # print("DEBUG save node user_profile:", user_profile)
    # print("DEBUG save node meal_plan:", meal_plan)

    if not user_id:
        print("[ERROR] user_id missing in nutrition save node")
        return state

    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return state

    # ✅ Normalize meal_plan
    if hasattr(meal_plan, "content"):
        cleaned = re.sub(r"```json|```", "", meal_plan.content).strip()
        meal_plan = json.loads(cleaned)
    elif isinstance(meal_plan, str):
        cleaned = re.sub(r"```json|```", "", meal_plan).strip()
        meal_plan = json.loads(cleaned)

    if not isinstance(meal_plan, dict):
        print("[ERROR] meal_plan is not JSON")
        return state

    db = sessionLocal()
    try:
        db.query(NutritionPlan).filter(
            NutritionPlan.user_id == user_id,
            NutritionPlan.is_active == True,
        ).update({"is_active": False})

        training_days = user_profile.get("activity_level_days", 4)

        nutrition_plan_record = NutritionPlan(
            user_id=user_id,
            plan_name=f"AI Nutrition Plan - {datetime.utcnow().strftime('%Y-%m-%d')}",
            training_days_per_week=training_days,
            plan_data=meal_plan,
            is_active=True,
        )

        db.add(nutrition_plan_record)
        db.commit()
        db.refresh(nutrition_plan_record)
        print("[SUCCESS] Nutrition plan saved")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to save nutrition plan: {e}")

    finally:
        db.close()

    return state