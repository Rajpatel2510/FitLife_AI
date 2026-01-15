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

    diet_type: str
    allergies_restrictions:str
    food_dislikes:str

    place_of_workout: str
    available_equipment: List[str]
    injury_pain_conditions: List[str]


class NutritionGenerateRequest(BaseModel):
    # user_profile: UserProfileSchema
    user_profile: dict

class MealSchema(BaseModel):
    dish_name: str = Field(description="Dish name of the meal")
    ingredients: str = Field(description="Ingredients used in the meal")
    approx_calories: float = Field(description="Approximate calories")
    approx_macros: float = Field(description="Approximate protein in grams")
    approx_carbs: float = Field(description="Approximate carbs in grams")
    approx_fat: float = Field(description="Approximate fat in grams")
    portion_size: str = Field(description="Portion size description")


class MealTimingSchema(BaseModel):
    breakfast: MealSchema
    lunch: MealSchema
    dinner: MealSchema
    pre_workout: MealSchema
    post_workout: MealSchema

class MealPlanSchema(BaseModel):
    day_1: MealTimingSchema
    day_2: MealTimingSchema
    day_3: MealTimingSchema
    day_4: MealTimingSchema
    day_5: MealTimingSchema
    day_6: MealTimingSchema
    day_7: MealTimingSchema
