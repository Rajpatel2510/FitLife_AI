from app.ai.graphs.nutrition_state import nutritionState
from app.ai.llm import nutrition_structure_model


def weekly_plan(state:nutritionState) -> nutritionState:
    prompt = f"""
You are a certified nutritionist and professional diet planner.

Below is a SINGLE-DAY meal plan that is already optimized for the user:
{state["meal_plan"]}

TASK:
Using the provided single-day meal plan as the BASE TEMPLATE, generate a complete 7-day weekly meal plan (Day 1 to Day 7).

PLANNING INSTRUCTIONS:
- Day 1 MUST be exactly the same as the provided meal plan.
- Days 2 to 7 should be slight variations of Day 1.
- Variations should be made by changing ingredients or preparation styles while keeping the same meal structure.
- Maintain similar portion sizes and digestion-friendly choices across all days.
- Ensure meals remain realistic, home-friendly, and easy to prepare.
- Ensure balanced nutrition across the full week without repetition fatigue.

STRICT RULES (must follow exactly):
1. Do NOT introduce foods that would violate the original meal plan’s diet type.
2. Do NOT introduce any new allergens or disliked foods.
3. Meals must continue to support the same fitness goal.
4. Do NOT include junk food, fried food, sugar-heavy items, or supplements.
5. Keep all meals simple, familiar, and stress-friendly.
6. Do NOT add calories, macros, explanations, or extra commentary.

OUTPUT RULES (VERY IMPORTANT):
- Return ONLY a valid JSON object.
- Do NOT add headings, markdown, explanations, or extra text.
- Every meal value must be a short phrase or single concise sentence.
- Output must match EXACTLY the schema below.

OUTPUT SCHEMA (STRICT):

{{
  "day_1": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_2": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_3": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_4": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_5": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_6": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }},
  "day_7": {{
    "breakfast": "<string>",
    "lunch": "<string>",
    "dinner": "<string>",
    "pre_workout": "<string>",
    "post_workout": "<string>"
  }}
}}
"""
    weekly_plan = nutrition_structure_model.invoke(prompt)
    return {"weekly_plan":weekly_plan}