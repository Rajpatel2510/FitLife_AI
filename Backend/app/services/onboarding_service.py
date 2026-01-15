# def covert_pounds_to_kg(pounds:float) -> float:
#     return pounds * 0.453592

# def convert_feet_inches_to_cm(feet:int,inches:int) -> float:
#     total_inches = (feet * 12) + inches
#     return total_inches * 2.54


def convert_weight_to_kg(weight_value: float, weight_unit: str) -> float:
    """
    Convert weight to KG
    Supported units: kg, pound
    """
    weight_value = float(weight_value)

    if weight_unit.lower() in ["pound", "lb", "lbs"]:
        return round(weight_value * 0.453592, 2)

    # already in kg
    return round(weight_value, 2)


def convert_height_to_cm(height_unit: str,height_cm: float | None = None,height_ft: int | None = None,height_in: int | None = None,) -> float:
    if height_unit.lower() == "cm":
        return round(float(height_cm), 2)

    if height_unit.lower() in ["ft+in", "ft"]:
        if height_ft is None or height_in is None:
            raise ValueError("Height in feet and inches is required")

        total_inches = (height_ft * 12) + height_in
        return round(total_inches * 2.54, 2)

    raise ValueError("Invalid height unit")


def calculate_exercises_per_week(fitness_level: str,fitness_goal: str,activity_level: str,age: int,injuries: list | None = None,) -> dict:
    """
    Calculate optimal exercise days per week based on user profile.
    

    Args:
        fitness_level: beginner, intermediate, advanced
        fitness_goal: weight_loss, muscle_gain, endurance, flexibility, general_fitness
        activity_level: sedentary, lightly_active, moderately_active, very_active
        age: user age
        injuries: list of injuries/conditions

    Returns:
        dict with exercise_days, exercises_per_day, rest_days, and recommendations
    """

    # Base exercise days on fitness level
    base_days = {"beginner": 3, "intermediate": 4, "advanced": 5}

    exercise_days = base_days.get(fitness_level.lower(), 3)

    # Adjust based on fitness goal
    goal_adjustments = {
        "weight_loss": 1,  # Increase by 1 day
        "muscle_gain": 0,  # Keep base
        "endurance": 1,  # Increase by 1 day
        "flexibility": 0,  # Keep base
        "general_fitness": 0,
    }

    adjustment = goal_adjustments.get(fitness_goal.lower(), 0)
    exercise_days = min(exercise_days + adjustment, 6)  # Cap at 6 days

    # Adjust based on activity level
    if activity_level.lower() == "sedentary":
        exercise_days = min(exercise_days, 4)  # Don't push sedentary users too hard
    elif activity_level.lower() == "very_active":
        exercise_days = min(exercise_days + 1, 7)  # Can handle more

    # Age consideration (reduce for 60+)
    if age >= 60:
        exercise_days = max(exercise_days - 1, 2)

    # Injury consideration
    if injuries and len(injuries) > 0:
        exercise_days = max(exercise_days - 1, 2)  # Reduce intensity

    # Calculate rest days
    rest_days = 7 - exercise_days
    
    # Determine exercises per session
    exercises_per_session = (
        5
        if fitness_level.lower() == "beginner"
        else (6 if fitness_level.lower() == "intermediate" else 7)
    )

    # Build recommendations
    recommendations = []
    if fitness_goal.lower() == "weight_loss":
        recommendations.append("Include 2-3 cardio sessions per week")
        recommendations.append("Combine strength training with HIIT workouts")
    elif fitness_goal.lower() == "muscle_gain":
        recommendations.append("Focus on progressive overload")
        recommendations.append("Ensure adequate protein intake")
    elif fitness_goal.lower() == "endurance":
        recommendations.append("Include long-duration cardio sessions")
        recommendations.append("Progressively increase intensity")

    if activity_level.lower() == "sedentary":
        recommendations.append("Start with low-impact exercises")
        recommendations.append("Gradually increase duration before intensity")

    if injuries and len(injuries) > 0:
        recommendations.append("Focus on rehabilitation and injury prevention")
        recommendations.append("Avoid high-impact exercises")

    return {
        "exercise_days_per_week": exercise_days,
        "rest_days": rest_days,
        "exercises_per_session": exercises_per_session,
        "recommendations": recommendations,
    }
