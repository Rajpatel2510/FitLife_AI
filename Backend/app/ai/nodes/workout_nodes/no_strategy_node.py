# import json
# from app.ai.graphs.workout_state import WorkoutState
# from app.ai.llm import llm


# def strategy_node(state: WorkoutState) -> WorkoutState:
#     """
#     AI reasoning node.
#     Uses:
#     - user_profile
#     - analysis
#     - memory (previous workouts)
#     Decides workout strategy using LLM.
#     """

#     # -----------------------------
#     # 1️⃣ Safely extract state data
#     # -----------------------------
#     user = state.get("user_profile", {})
#     analysis = state.get("analysis", {})
#     memory = state.get("memory", {})

#     # -----------------------------
#     # 2️⃣ Build AI prompt
#     # -----------------------------
#     prompt = f"""
# You are an expert fitness coach.
# USER PROFILE:
# {json.dumps(user, indent=2)}

# ANALYSIS:
# {json.dumps(analysis, indent=2)}

# PREVIOUS WORKOUT MEMORY:
# {json.dumps(memory, indent=2)}

# TASK:
# Decide the best workout strategy for the user.

# IMPORTANT GUIDELINES (weight these strongly):
# - Age: Older users (e.g., 60+) should receive lower intensity, more recovery, and simpler movements.
# - Injuries / pain conditions: MUST avoid or modify exercises that aggravate injuries and increase recovery days as needed.
# - Goals: Prioritize the user's stated goals (strength, hypertrophy, endurance, weight_loss, flexibility) when choosing split, intensity, and cardio.
# - Available equipment & place_of_workout: Prefer exercises that fit equipment and environment.
# - Activity level & fitness_level: Use these to decide appropriate days_per_week and intensity.
# - Previous high intensity: prioritize recovery and reduce volume if last plan was high intensity.

# Make an evidence-based recommendation. If multiple trade-offs exist, explain briefly in `reasoning`.

# Return ONLY valid JSON. Do NOT include markdown or extra text.

# JSON FORMAT (required):
# {{
#     "split": "full_body | upper_lower | push_pull_legs",
#     "intensity": "low | moderate | high",
#     "cardio_focus": "yes | no",
#     "days_per_week": 3,
#     "exercise_days": ["Monday","Thursday"],  # OPTIONAL: explicit weekdays
#     "reasoning": "short explanation (1-2 sentences)"
# }}
# """

#     # -----------------------------
#     # 3️⃣ Call LLM
#     # -----------------------------
#     response = llm.invoke(prompt)
#     raw_output = response.content.strip()

#     # -----------------------------
#     # 4️⃣ Clean markdown if present
#     # -----------------------------
#     if raw_output.startswith("```"):
#         raw_output = raw_output.replace("```json", "").replace("```", "").strip()

#     # -----------------------------
#     # 5️⃣ Parse JSON safely
#     # -----------------------------
#     try:
#         strategy = json.loads(raw_output)
#     except json.JSONDecodeError:
#         # Fallback to safe defaults
#         strategy = {
#             "split": "upper_lower",
#             "intensity": "moderate",
#             "cardio_focus": "no",
#             "reasoning": "Fallback strategy used due to invalid AI response.",
#         }

#     # -----------------------------
#     # 6️⃣ Store strategy in state and apply days_per_week if provided
#     # -----------------------------
#     state["strategy"] = strategy

#     # If LLM provided days_per_week, validate and apply it to analysis (AI-decided)
#     dpw = strategy.get("days_per_week")
#     try:
#         if dpw is not None:
#             dpw = int(dpw)
#             # constrain to sensible training days (3-6)
#             dpw = max(3, min(dpw, 6))
#             state.setdefault("analysis", {})["days_per_week"] = dpw
#     except Exception:
#         # ignore invalid value and keep existing analysis
#         pass

#     # Ensure there's at least a default days_per_week
#     if "days_per_week" not in state.get("analysis", {}):
#         state.setdefault("analysis", {})["days_per_week"] = 3

#     return state
