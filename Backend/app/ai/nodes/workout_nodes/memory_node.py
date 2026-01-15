from sqlalchemy.orm import Session
from app.ai.graphs.workout_state import WorkoutState
from app.db.database import sessionLocal
from app.models import WorkoutPlan


def memory_node(state: WorkoutState) -> WorkoutState:
    """
    Retrieves memory of previous workout plans for the user.
    Uses database session internally.
    """
    user_id = state["user_profile"].get("user_id")

    if not user_id:
        state["memory"] = {}
        return state

    db = sessionLocal()
    try:
        # Convert user_id to int if it's a string for database query
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            # If conversion fails, user probably doesn't exist in DB, skip memory
            state["memory"] = {}
            return state

        last_plan = (
            db.query(WorkoutPlan)
            .filter(WorkoutPlan.user_id == user_id_int)
            .order_by(WorkoutPlan.created_at.desc())
            .first()
        )

        if last_plan:
            state["memory"] = {
                "last_split": (
                    last_plan.strategy.get("split")
                    if hasattr(last_plan, "strategy")
                    else None
                ),
                "last_days": (
                    last_plan.days_per_week
                    if hasattr(last_plan, "days_per_week")
                    else None
                ),
                "last_intensity": (
                    last_plan.strategy.get("intensity")
                    if hasattr(last_plan, "strategy")
                    else None
                ),
            }
        else:
            state["memory"] = {}
    except Exception as e:
        # If any database error occurs, gracefully fall back to empty memory
        print(f"Warning: Could not retrieve workout memory: {e}")
        state["memory"] = {}
    finally:
        db.close()

    return state
