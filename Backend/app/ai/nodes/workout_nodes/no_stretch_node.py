# def get_stretches_based_on_user_data(user_profile: dict, focus: str, is_warmup: bool):
#     """
#     Generate stretches based on user data using LLM for personalization.
#     """
#     import json
#     from app.ai.llm import llm

#     # 1. Construct Prompt
#     prompt = f"""
#     You are an expert fitness coach.
#     Generate a stretching routine for the following context:

#     USER PROFILE:
#     {json.dumps(user_profile, indent=2)}

#     FOCUS: {focus}  (e.g., "Push Day", "Legs")
#     TYPE: {"Warm-up (Dynamic)" if is_warmup else "Cooldown (Static)"}

#     CONSTRAINTS:
#     - Injuries: {user_profile.get("injury_pain_conditions", [])} (Avoid aggravating these)
#     - Age: {user_profile.get("age", 30)}
#     - Equipment: {user_profile.get("available_equipment", [])}
#     - Place: {user_profile.get("place_of_workout", "gym")}

#     TASK:
#     Return a JSON list of 3-4 stretches.
#     Each stretch must have:
#     - name (string)
#     - duration_seconds (int)
#     - instructions (string)

#     JSON OUTPUT FORMAT:
#     [
#       {{ "name": "...", "duration_seconds": 30, "instructions": "..." }},
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
        
#         stretches = json.loads(raw_output)
        
#         if not isinstance(stretches, list):
#             raise ValueError("LLM returned not a list")
            
#         return stretches

#     except Exception as e:
#         print(f"Error generating stretches via AI: {e}")
#         # Simplest fallback
#         if is_warmup:
#             return [{"name": "Arm Circles", "duration_seconds": 30, "instructions": "Rotate arms forwards and backwards"}, {"name": "Leg Swings", "duration_seconds": 30, "instructions": "Swing legs front and back"}]
#         else:
#             return [{"name": "Child's Pose", "duration_seconds": 60, "instructions": "Sit back on heels, stretch arms forward"}, {"name": "Forward Fold", "duration_seconds": 45, "instructions": "Bend at hips, reach toward toes"}]
