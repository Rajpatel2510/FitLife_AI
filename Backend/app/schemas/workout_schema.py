from pydantic import BaseModel
from typing import List, Optional, Dict, Any,Annotated,Literal
from pydantic import BaseModel,Field



class UserProfileSchema(BaseModel):
    
    name: str
    age: int
    gender: str

    weight_kg: float
    height_cm: float

    fitness_goal: str
    fitness_level: str
    activity_level: str
    body_type: str

    place_of_workout: str
    available_equipment: List[str]
    injury_pain_conditions: List[str]


class WorkoutGenerateRequest(BaseModel):
    user_profile: UserProfileSchema


# class Exercise(BaseModel):
#     name: str
#     sets: int
#     reps: int
#     rest_seconds: int


# class Stretch(BaseModel):
#     name: str
#     duration_seconds: int
#     instructions: Optional[str] = None

# class DayWorkout(BaseModel):
#     focus: str
#     exercises: List[Exercise]
#     warmup_stretches: List[Stretch] = []
#     cooldown_stretches: List[Stretch] = []

# class WorkoutPlan(BaseModel):
#     split: str
#     days_per_week: int
#     weekly_schedule: Dict[str, DayWorkout]
#     reasoning: List[str]

class WorkoutmainExercise(BaseModel):
    name: str
    sets: int
    reps: int
    rest_seconds: int


class Stretch(BaseModel):
    name: str
    duration_seconds: int
    instructions: Optional[str] = None


class WorkoutDay(BaseModel):
    day_number: int = Field(description="Workout day number (1-based index)")
    workout_split: Literal[
        "full body",
        "upper body",
        "lower body",
        "push",
        "pull",
        "legs"
    ]
    workout_warmup: List[Stretch] = []
    # workout_main_exercise: Annotated[str,Field(description="The main workout it contain exercises + sets + reps of the User based on User goal, user weight, user fitness_level and place_of_workout and main exercises at least 3")]
    workout_main_exercise: list[WorkoutmainExercise]
    workout_cool_down: List[Stretch] = []


class WorkoutWeekPlan(BaseModel):
    days_per_week: int
    workout_days: list[WorkoutDay]


