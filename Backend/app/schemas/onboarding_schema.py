from pydantic import BaseModel,EmailStr
from typing import List, Optional

class OnboardingUserSchema(BaseModel):
    name: str
    email: EmailStr
    password : str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class OnboardingUserProfileSchema(BaseModel):
    name: str
    age: int
    gender: str

    weight_value: float
    weight_unit: str  

    height_unit: str
    height_cm: Optional[float] = None
    height_ft: Optional[int] = None
    height_in: Optional[int] = None

    fitness_goal: str
    fitness_level: str
    activity_level: str
    body_type: str

    diet_type: str
    allergies_restrictions: List[str]
    food_dislikes: List[str]

    place_of_workout: str
    available_equipment: List[str]
    injury_pain_conditions: List[str]

    sleep_duration_hours: float
    water_intake_liters: float
    steps_per_day: int
    stress_level: str