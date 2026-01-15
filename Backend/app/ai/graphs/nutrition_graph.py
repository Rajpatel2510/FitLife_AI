from langgraph.graph import StateGraph,END
from app.ai.graphs.nutrition_state import nutritionState
from app.ai.nodes.nutrition_nodes.nutrition_plan import nutrition_plan
from app.ai.nodes.nutrition_nodes.save_meal_plan_node import save_meal_plan_node

def create_nutrition_graph():
    graph = StateGraph(nutritionState)

    graph.add_node("nutrition_plan", nutrition_plan)
    graph.add_node("save_meal_plan_node", save_meal_plan_node)

    graph.set_entry_point('nutrition_plan')
    graph.add_edge('nutrition_plan', 'save_meal_plan_node')
    graph.add_edge('save_meal_plan_node', END)

    return graph.compile()


nutrition_graph = create_nutrition_graph()