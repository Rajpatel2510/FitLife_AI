from app.ai.graphs.workout_state import WorkoutState
from app.ai.llm import model
import re
import json
from app.services.workout_service import safe_json_parse


def final_workout_plan(state:WorkoutState) -> WorkoutState:
    prompt = f"""
You are a workout plan formatter.

INPUT:
Workout plan (only workout days, no rest days yet):
{state["workout_plan"]}

TASK:
Insert REST days into the weekly schedule based on the total number of workout days.

STRICT RULES (must follow exactly):
1. A week has exactly 7 days.
2. Do NOT modify workout details (exercises, warmup, cooldown).
3. Only INSERT rest days at correct positions.
4. Maintain the original order of workout days.
5. Label rest days clearly as "REST DAY".
6. Output must be a full 7-day weekly sequence.

DISTRIBUTION RULES (mandatory):
- If days_per_week = 3:
  exercise, rest, exercise, rest, exercise, rest, rest
- If days_per_week = 4:
  exercise, exercise, rest, exercise, exercise, rest, rest
- If days_per_week = 5:
  exercise, exercise, exercise, rest, exercise, exercise, rest
- If days_per_week = 6:
  exercise, exercise, exercise, exercise, exercise, exercise, rest

OUTPUT FORMAT (strict):
WorkoutWeekPlan(
  days_per_week=<int>,
  weekly_schedule=[
    WorkoutDay(...) OR RestDay(...),
    ...
    (exactly 7 entries)
  ]
)

RestDay format:
RestDay(day_number=<int>, label="REST DAY")

IMPORTANT:
- Do not add explanations.
- Do not add extra text.
- Return ONLY the final structured plan.
- I want in JSON format
"""


    response = model.invoke(prompt)
    cleaned = re.sub(r"```json|```", "", response.content).strip()

    # final_workout_plan = json.loads(cleaned)
    final_workout_plan = safe_json_parse(cleaned)
    # print("RAW LLM OUTPUT:")
    # print(cleaned)
    # print("----- END -----")

    return {"final_workout_plan":final_workout_plan}
