# app/ai/nodes/save_plan_node.py

from datetime import datetime
from app.ai.graphs.workout_state import WorkoutState
from app.db.database import sessionLocal
from app.models import WorkoutPlan


def save_plan_node(state: WorkoutState) -> WorkoutState:
    user_profile = state.get("user_profile", {})
    final_workout_plan = state.get("final_workout_plan", {})

    user_id = user_profile.get("user_id")
    if not user_id:
        return state

    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return state

    # ✅ FIX: safely extract days_per_week
    days_per_week = state.get("days_per_week")

    if hasattr(days_per_week, "content"):  # AIMessage
        training_days = int(days_per_week.content.strip())
    else:
        training_days = int(days_per_week)

    db = sessionLocal()
    try:
        db.query(WorkoutPlan).filter(
            WorkoutPlan.user_id == user_id,
            WorkoutPlan.is_active == True,
        ).update({"is_active": False})

        workout_plan_record = WorkoutPlan(
            user_id=user_id,
            plan_name=f"AI Workout Plan - {datetime.utcnow().strftime('%Y-%m-%d')}",
            training_days_per_week=training_days,
            total_days_in_week=7,
            workout_plan_data=final_workout_plan,
            is_active=True,
        )

        db.add(workout_plan_record)
        db.commit()
        db.refresh(workout_plan_record)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to save workout plan: {e}")

    finally:
        db.close()

    return state
