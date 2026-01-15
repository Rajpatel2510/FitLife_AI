from app.ai.graphs.nutrition_state import nutritionState
from app.ai.llm import nutrition_structure_model


def nutrition_plan(state:nutritionState) -> nutritionState:
    prompt = f"""
You are a certified nutritionist and diet planner.

Analyze the following user profile:
{state["user_profile"]}

TASK:
Generate a personalized daily meal plan based on the user's:
- Age
- Weight and height
- Fitness goal
- Fitness level
- Activity level
- Body type
- Diet type
- Allergies or food restrictions
- Food dislikes
- Stress level
- Sleep duration
- Daily steps
- Workout type and recovery needs

STRICT RULES (must follow exactly):
1. Respect the user's diet type strictly (e.g., vegetarian only).
2. Avoid all foods listed in allergies or food dislikes.
3. Meals must support the stated fitness goal (e.g., weight loss).
4. Keep meals simple, realistic, and suitable for a home-based lifestyle.
5. Portion sizes should be moderate and appropriate for the user's activity level.
6. Do NOT include supplements unless naturally food-based.
7. Do NOT include junk food, sugar-heavy items, or fried food.
8. Ensure meals are digestion-friendly and stress-aware.

OUTPUT RULES (VERY IMPORTANT):
- Return ONLY a valid JSON object.
- Do NOT add explanations, headings, markdown, or extra text.
- Do NOT add calories, macros, or emojis.
- Every field must be a single concise sentence or short phrase.
- Output must match EXACTLY this schema:

{{
  "breakfast": "<string>",
  "lunch": "<string>",
  "dinner": "<string>",
  "pre_workout": "<string>",
  "post_workout": "<string>"
}}
"""
    meal_plan = nutrition_structure_model.invoke(prompt)
    return {"meal_plan":meal_plan}