# import json
# from app.ai.llm import llm

# def get_exercises_based_on_user_data(user_profile: dict, focus: str):
#     """
#     Build exercises that respect user context using LLM for true personalization.
#     """

#     # 1. Construct Prompt
#     prompt = f"""
#     You are an expert fitness coach.
#     Generate a workout block for the following context:

#     USER PROFILE:
#     {json.dumps(user_profile, indent=2)}

#     FOCUS: {focus}  (e.g., "Push Day", "Full Body", "Legs")

#     CONSTRAINTS:
#     - Place: {user_profile.get("place_of_workout", "gym")}
#     - Equipment: {user_profile.get("available_equipment", ["bodyweight"])}
#     - Injuries: {user_profile.get("injury_pain_conditions", [])} (CRITICAL: Avoid aggravating these)
#     - Fitness Level: {user_profile.get("fitness_level", "beginner")}

#     TASK:
#     Return a JSON list of 4-6 exercises that fit this focus and constraints.
#     Each exercise must have:
#     - name (string)
#     - sets (int)
#     - reps (string or int)
#     - rest_seconds (int)
#     - tags (list of strings, e.g. ["chest", "shoulder"])

#     JSON OUTPUT FORMAT:
#     [
#       {{ "name": "...", "sets": 3, "reps": "12", "rest_seconds": 60, "tags": [...] }},
#       ...
#     ]
#     """

#     # 2. Call LLM
#     try:
#         response = llm.invoke(prompt)
#         raw_output = response.content.strip()

#         # Clean markdown
#         if raw_output.startswith("```"):
#             raw_output = raw_output.replace("```json", "").replace("```", "").strip()
        
#         exercises = json.loads(raw_output)
        
#         # Validation fallback
#         if not isinstance(exercises, list):
#             raise ValueError("LLM returned not a list")
            
#         return exercises

#     except Exception as e:
#         print(f"Error generating exercises via AI: {e}")
#         # Fallback (simple bodyweight safe mode) if AI fails
#         return [
#             {"name": "Bodyweight Squats", "sets": 3, "reps": 15, "rest_seconds": 60, "tags": ["legs"]},
#             {"name": "Push-ups", "sets": 3, "reps": 10, "rest_seconds": 60, "tags": ["push"]},
#             {"name": "Plank", "sets": 3, "reps": "30s", "rest_seconds": 45, "tags": ["core"]}
#         ]
