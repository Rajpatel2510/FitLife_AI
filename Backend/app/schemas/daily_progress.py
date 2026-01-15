from pydantic import BaseModel
from datetime import date

class DailyProgressCreate(BaseModel):
    date: date
    workout_completed: bool
    steps_count: int
    water_consumed: float
    sleep_hours: float
    energy_level: int
    hunger_level: int
    meal_adherence: int
