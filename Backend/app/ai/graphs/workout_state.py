# from typing import TypedDict, Dict, Any

# class WorkoutState(TypedDict):
#     user_profile:str
#     days_per_week:int
#     memory: Dict[str, Any]      
#     workout_plan:str
#     final_workout_plan:str


# app/ai/graphs/workout_state.py
from typing import TypedDict, Dict, Any

class WorkoutState(TypedDict, total=False):
    user_profile: Dict[str, Any]
    days_per_week: int
    memory: Dict[str, Any]
    workout_plan: Dict[str, Any]
    final_workout_plan: Dict[str, Any]
