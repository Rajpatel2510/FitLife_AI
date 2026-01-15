# from app.ai.graphs.workout_graph import workout_graph

# def run_workout_agent(user_profile: dict):
#     initial_state = {
#         "user_profile": user_profile,
#         "days_per_week":{},
#         "workout_plan": {},
#         "full_workout_plan":{}
#     }

#     final_state = workout_graph.invoke(initial_state)
#     return final_state["final_workout_plan"]


from app.ai.graphs.workout_graph import workout_graph


def run_workout_agent(user_profile: dict) -> dict:
    """
    Runs the workout LangGraph pipeline and returns the final workout plan.
    """

    

    # IMPORTANT: user_profile MUST contain user_id
    if "user_id" not in user_profile:
        raise ValueError("user_profile must include user_id for saving workout plan")

    initial_state = {
        "user_profile": user_profile,          # dict
        "days_per_week": 0,                    # int placeholder
        "memory": {},                          # optional, future use
        "workout_plan": {},                    # intermediate output
        "full_workout_plan": {},              # FINAL output (this is saved)
    }

    final_state = workout_graph.invoke(initial_state)

    # Safety check
    final_workout_plan = final_state.get("final_workout_plan")
    if not final_workout_plan:
        raise RuntimeError("Workout generation failed: full_workout_plan is empty")

    return final_workout_plan
