# from app.ai.graphs.workout_state import WorkoutState
# from app.ai.nodes.exercise_node import get_exercises_based_on_user_data
# from app.ai.nodes.stretch_node import get_stretches_based_on_user_data


# def assemble_plan(state: WorkoutState) -> WorkoutState:
#     """
#     This node assembles the final workout plan.
#     It uses:
#     - user_profile
#     - analysis (days_per_week)
#     - strategy (AI-decided split, intensity, cardio)
#     """

#     user_profile = state["user_profile"]
#     analysis = state["analysis"]
#     strategy = state.get("strategy", {})

#     days_per_week = analysis["days_per_week"]
#     split = strategy.get("split", "upper_lower")
#     intensity = strategy.get("intensity", "moderate")
#     cardio_focus = strategy.get("cardio_focus", "no")

#     if split == "full_body":
#         focus_sequence = [
#             "Full Body - Strength",
#             "Full Body - Conditioning",
#             "Full Body - Core",
#         ]

#     elif split == "push_pull_legs":
#         focus_sequence = [
#             "Push Day - Chest & Shoulders",
#             "Pull Day - Back & Biceps",
#             "Leg Day - Quads & Glutes",
#         ]

#     else:  # upper_lower (default)
#         focus_sequence = [
#             "Upper Body - Push",
#             "Lower Body - Legs",
#             "Upper Body - Pull",
#             "Lower Body - Posterior Chain",
#         ]

#     # --------------------------------------------------
#     # 2️⃣ Build weekly schedule
#     # --------------------------------------------------

#     day_names = [
#         "Monday",
#         "Tuesday",
#         "Wednesday",
#         "Thursday",
#         "Friday",
#         "Saturday",
#         "Sunday",
#     ]

#     weekly_schedule = {}

#     # First, allow the AI to explicitly pick weekdays via `strategy.exercise_days`.
#     strategy_ex_days = strategy.get("exercise_days") if isinstance(strategy, dict) else None
#     if strategy_ex_days and isinstance(strategy_ex_days, list):
#         # Normalize provided day names to indices (names-only support: full names and 3-letter abbreviations)
#         import re

#         name_to_index = {}
#         for i, name in enumerate(day_names):
#             lname = name.lower()
#             name_to_index[lname] = i
#             name_to_index[lname[:3]] = i  # mon, tue, wed, ...

#         exercise_indices = []
#         for d in strategy_ex_days:
#             if not isinstance(d, str):
#                 continue
#             cleaned = re.sub(r"[^a-z]", "", d.strip().lower())
#             idx = None
#             if cleaned in name_to_index:
#                 idx = name_to_index[cleaned]
#             else:
#                 # try first 3 letters
#                 if len(cleaned) >= 3 and cleaned[:3] in name_to_index:
#                     idx = name_to_index[cleaned[:3]]
#             if idx is not None:
#                 exercise_indices.append(idx)

#         # remove duplicates and sort
#         exercise_indices = sorted(list(dict.fromkeys(exercise_indices)))

#         # fallback if empty
#         if not exercise_indices:
#             exercise_indices = list(range(min(days_per_week, len(day_names))))
#     else:
#         # Choose which day indices in the week will be exercise days.
#         # Custom patterns:
#         # - 3 days/week -> alternate days: Mon, Wed, Fri
#         # - 4 days/week -> two consecutive days, rest, two consecutive days: Mon, Tue, Thu, Fri
#         # - 5 days/week -> two consecutive days, rest, two consecutive days, rest, one day: Mon, Tue, (Wed rest), Thu, Fri, (Sat rest), Sun
#         if days_per_week == 3:
#             exercise_indices = [0, 2, 4]
#         elif days_per_week == 4:
#             exercise_indices = [0, 1, 3, 4]
#         elif days_per_week == 5:
#             exercise_indices = [0, 1, 3, 4, 6]
#         else:
#             exercise_indices = list(range(min(days_per_week, len(day_names))))

#     for i, day in enumerate(day_names):
#         if i in exercise_indices:
#             # Use the position of this exercise day to pick a focus from the sequence
#             seq_index = exercise_indices.index(i)
#             focus = focus_sequence[seq_index % len(focus_sequence)]

#             exercises = get_exercises_based_on_user_data(
#                 user_profile=user_profile, focus=focus
#             )

#             # Simple intensity adjustment (beginner safe)
#             if intensity == "low":
#                 exercises = exercises[: max(2, len(exercises) - 2)]
#             elif intensity == "high":
#                 exercises = exercises + exercises[:1]

#             # Optional cardio
#             if cardio_focus == "yes":
#                 exercises.append(
#                     {
#                         "name": "Light Cardio (Brisk Walk / Cycling)",
#                         "sets": 1,
#                         "reps": "15-20 min",
#                         "rest_seconds": 0,
#                     }
#                 )

#             weekly_schedule[day] = {
#                 "focus": focus,
#                 "intensity": intensity,
#                 "exercises": exercises,
#                 "warmup_stretches": get_stretches_based_on_user_data(
#                     user_profile, focus, is_warmup=True
#                 ),
#                 "cooldown_stretches": get_stretches_based_on_user_data(
#                     user_profile, focus, is_warmup=False
#                 ),
#             }

#         else:
#             weekly_schedule[day] = {
#                 "focus": "Rest Day",
#                 "intensity": "recovery",
#                 "exercises": [],
#                 "warmup_stretches": [],
#                 "cooldown_stretches": [],
#             }

#     # --------------------------------------------------
#     # 3️⃣ Store final plan in state
#     # --------------------------------------------------

#     state["workout_plan"] = {
#         "split": split,
#         "days_per_week": days_per_week,
#         "intensity": intensity,
#         "cardio_focus": cardio_focus,
#         "weekly_schedule": weekly_schedule,
#         "reasoning": strategy.get(
#             "reasoning",
#             "Workout plan generated based on your profile and fitness goal.",
#         ),
#     }

#     return state
