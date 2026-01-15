from app.ai.graphs.nutrition_graph import nutrition_graph

# def run_nutrition_agent(user_profile: dict):
#     initial_state = {
#         "user_profile": user_profile,
#         "meal_plan": {}
#     }

#     final_state = nutrition_graph.invoke(initial_state)
#     return final_state["meal_plan"]

def run_nutrition_agent(user_profile: dict):
    if "user_id" not in user_profile:
        raise ValueError("user_id missing before nutrition graph")

    return nutrition_graph.invoke({
        "user_profile": user_profile
    })