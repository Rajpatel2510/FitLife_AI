from langgraph.graph import StateGraph, END
from app.ai.graphs.workout_state import WorkoutState
from app.ai.nodes.workout_nodes.analyze_user import analyze_user
# from app.ai.nodes.memory_node import memory_node
# from app.ai.nodes.strategy_node import strategy_node
# from app.ai.nodes.assemble_plan import assemble_plan
from app.ai.nodes.workout_nodes.save_plan_node import save_plan_node
from app.ai.nodes.workout_nodes.generate_workout_plan import generate_workout_plan
from app.ai.nodes.workout_nodes.final_workout_plan import final_workout_plan


def create_workout_graph():
    # graph = StateGraph(WorkoutState)

    # graph.add_node("analyze_user", analyze_user)
    # graph.add_node("memory_node", memory_node)
    # graph.add_node("strategy_node", strategy_node)
    # graph.add_node("assemble_plan", assemble_plan)
    # graph.add_node("save_plan_node", save_plan_node)

    # graph.set_entry_point("analyze_user")

    # graph.add_edge("analyze_user", "memory_node")
    # graph.add_edge("memory_node", "strategy_node")
    # graph.add_edge("strategy_node", "assemble_plan")
    # graph.add_edge("assemble_plan", "save_plan_node")
    # graph.add_edge("save_plan_node", END)
    
    graph = StateGraph(WorkoutState)

    graph.add_node("analyze_user",analyze_user)
    graph.add_node("generate_workout_plan",generate_workout_plan)
    graph.add_node("final_workout_plan",final_workout_plan)
    graph.add_node("save_plan_node",save_plan_node)

    graph.set_entry_point("analyze_user")

    graph.add_edge("analyze_user","generate_workout_plan")
    graph.add_edge('generate_workout_plan','final_workout_plan')
    graph.add_edge('final_workout_plan','save_plan_node')
    graph.add_edge('save_plan_node',END)
    
    return graph.compile()


workout_graph = create_workout_graph()
