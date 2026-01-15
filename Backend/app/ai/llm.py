from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
import json
import re
from app.schemas.workout_schema import WorkoutWeekPlan
from app.schemas.nutrition_schema import MealPlanSchema


load_dotenv()

# Initialize OpenAI LLM
api_key = os.getenv("OPENAI_API_KEY")

model = ChatOpenAI(model="gpt-4o-mini",api_key=api_key)
workout_structure_model = model.with_structured_output(WorkoutWeekPlan)
nutrition_structure_model = model.with_structured_output(MealPlanSchema)

# class MockLLM:
#     def invoke(self, prompt: str):
#         # default strategy
#         strategy = {
#             "split": "upper_lower",
#             "intensity": "moderate",
#             "cardio_focus": "no",
#             "reasoning": "Mock response - OPENAI_API_KEY not configured",
#         }

#         profile = None
#         # Try to parse JSON block after USER PROFILE:
#         try:
#             start = prompt.index("USER PROFILE:") + len("USER PROFILE:")
#             sub = prompt[start : start + 5000]
#             jstart = sub.find("{")
#             if jstart != -1:
#                 candidate = sub[jstart:]
#                 # try progressively smaller slices to find valid JSON
#                 for cut in range(len(candidate), 0, -1):
#                     try:
#                         profile = json.loads(candidate[:cut])
#                         break
#                     except Exception:
#                         continue
#         except Exception:
#             profile = None

#         # fallback: regex extract common fields
#         if not profile:
#             profile = {}
#             try:
#                 m = re.search(r'"age"\s*:\s*(\d+)', prompt)
#                 if m:
#                     profile["age"] = int(m.group(1))
#                 m = re.search(r'"fitness_level"\s*:\s*"([^"]+)"', prompt)
#                 if m:
#                     profile["fitness_level"] = m.group(1)
#                 m = re.search(r'"activity_level"\s*:\s*"([^"]+)"', prompt)
#                 if m:
#                     profile["activity_level"] = m.group(1)
#                 m = re.search(r'"injury_pain_conditions"\s*:\s*\[([^\]]+)\]', prompt)
#                 if m:
#                     items = [
#                         s.strip().strip('"') for s in m.group(1).split(",") if s.strip()
#                     ]
#                     profile["injury_pain_conditions"] = items
#                 m = re.search(r'"goals"\s*:\s*\[([^\]]+)\]', prompt)
#                 if m:
#                     items = [
#                         s.strip().strip('"') for s in m.group(1).split(",") if s.strip()
#                     ]
#                     profile["goals"] = items
#             except Exception:
#                 pass

#         # If we have any profile data, derive days/intensity
#         if profile:
#             fitness = str(profile.get("fitness_level", "")).lower()
#             activity = str(profile.get("activity_level", "")).lower()
#             age = profile.get("age")
#             injuries = profile.get("injury_pain_conditions", []) or []
#             goals = profile.get("goals", []) or []

#             days = 4
#             intensity = "moderate"

#             if "beginner" in fitness or "new" in fitness:
#                 days -= 1
#                 intensity = "low"
#             elif "intermediate" in fitness:
#                 intensity = "moderate"
#             elif "advanced" in fitness or "high" in activity:
#                 days += 1
#                 intensity = "high"

#             try:
#                 if age is not None and int(age) >= 60:
#                     days -= 1
#                     intensity = "low"
#             except Exception:
#                 pass

#             if injuries:
#                 days -= 1
#                 intensity = "low"

#             if any(g.lower() in ("strength", "hypertrophy") for g in goals):
#                 days += 1

#             days = max(2, min(days, 6))

#             strategy["days_per_week"] = days
#             strategy["intensity"] = intensity

#             week_days = [
#                 "Monday",
#                 "Tuesday",
#                 "Wednesday",
#                 "Thursday",
#                 "Friday",
#                 "Saturday",
#                 "Sunday",
#             ]
#             if days == 2:
#                 exercise_days = [week_days[0], week_days[2]]
#             elif days == 3:
#                 exercise_days = [week_days[0], week_days[2], week_days[4]]
#             elif days == 4:
#                 exercise_days = [week_days[0], week_days[1], week_days[3], week_days[4]]
#             elif days == 5:
#                 exercise_days = [
#                     week_days[0],
#                     week_days[1],
#                     week_days[3],
#                     week_days[4],
#                     week_days[6],
#                 ]
#             else:
#                 exercise_days = week_days[:days]

#             strategy["exercise_days"] = exercise_days
#             strategy["reasoning"] = (
#                 f"Mocked decision: {days} days/week ({', '.join(exercise_days)}) based on profile inputs."
#             )

            


# if not api_key:
#     llm = MockLLM()
# else:
#     llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, api_key=api_key)
