from app.ai.graphs.workout_state import WorkoutState
from app.ai.llm import model

def analyze_user(state:WorkoutState) -> WorkoutState:
    prompt = f"""You are a certified fitness expert.

    Analyze the following user profile:
    {state["user_profile"]}

    Based on the user's age, fitness goal, fitness level, activity level, body condition, and recovery capacity, determine the optimal number of workout days per week.

    Rules:
    - Return ONLY a single integer.
    - The value must be between 3 and 6.
    - Do NOT include any explanation, text, or symbols.
    - Output format must be a plain number (example: 4)."""
    
    response = model.invoke(prompt)
    days_per_week = int(response.content.strip())
    return {"days_per_week":days_per_week}
