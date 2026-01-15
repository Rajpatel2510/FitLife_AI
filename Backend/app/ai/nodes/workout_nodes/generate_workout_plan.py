from app.ai.graphs.workout_state import WorkoutState
from app.ai.llm import workout_structure_model



def generate_workout_plan(state:WorkoutState) -> WorkoutState:
   prompt = f"""
You are a certified fitness coach and workout planner.

User profile:
{state["user_profile"]}

CRITICAL INSTRUCTIONS (MUST FOLLOW EXACTLY):

1. The user trains exactly {state["days_per_week"]} days per week.
2. A 7-day week is used ONLY to decide spacing internally.
   - Rest days exist ONLY in your reasoning.
   - Rest days must NEVER appear in the output.
3. Generate workouts ONLY for workout days.
4. The output must contain EXACTLY {state["days_per_week"]} workout days.
5. Do NOT include, mention, label, or imply rest days in any form.
6. Do NOT use terms like "Rest", "Rest Day", "Recovery", or similar.

WORKOUT LOGIC (MANDATORY):

- Fitness goal (`fitness_goal`) determines workout focus.
- Activity level (`activity_level`) adjusts volume and intensity.
- Fitness level (`fitness_level`) determines exercise difficulty.
- Place of workout:
  - If `place_of_workout` is "home": ONLY bodyweight or minimal-equipment exercises.
  - If `place_of_workout` is "gym": ONLY gym-based exercises.
- If home workout AND beginner → Full Body only.

WORKOUT SPLIT RULES (STRICT):

- 3 days → Full Body
- 4 days → Upper / Lower
- 5-6 days → Push / Pull / Legs

OUTPUT RULES (NO EXCEPTIONS):

- Output ONLY workout days.
- Do NOT include explanations, tips, warm-ups, rest days, or extra text.
- Do NOT output plain text formatting.
- Return ONLY a structured JSON object.
- The JSON must match the required schema exactly.
- Each item in `workout_days` MUST be a valid workout day with ALL required fields.
- `workout_days` length MUST equal {state["days_per_week"]}.

STRUCTURED OUTPUT REQUIREMENT:

- Return the output as a JSON object matching the schema.
- `workout_days` must be a list.
- Each list item represents ONE workout day ONLY.
- No extra fields, no missing fields.
"""

   response = workout_structure_model.invoke(prompt)
   return {"workout_plan":response}
