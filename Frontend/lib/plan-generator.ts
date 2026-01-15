import type { UserProfile, WorkoutPlan, MealPlan, WorkoutDay, Meal } from "./store"
import { generateWorkoutPlan as apiGenerateWorkoutPlan, generateMealPlan as apiGenerateMealPlan } from "./api"

export async function generatePlans(profile: UserProfile, token?: string) {
  // Try backend-generated plans first, fallback to local generator
  let workout: WorkoutPlan
  let meal: MealPlan

  try {
    workout = await apiGenerateWorkoutPlan(profile, token)
  } catch (e) {
    console.error("Backend workout generation failed, falling back:", e)
    workout = localGenerateWorkoutPlan(profile)
  }

  try {
    meal = await apiGenerateMealPlan(profile, token)
  } catch (e) {
    console.error("Backend meal generation failed, falling back:", e)
    meal = localGenerateMealPlan(profile)
  }

  return { workout, meal }
}

function localGenerateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const trainingFrequency =
    profile.activity_level === "sedentary" ? 3 : profile.activity_level === "extremely_active" ? 6 : 4

  let workoutSplit = "full_body"
  if (trainingFrequency >= 5) workoutSplit = "ppl"
  else if (trainingFrequency === 4) workoutSplit = "upper_lower"
  else if (profile.place_of_workout === "home") workoutSplit = "home_workout"

  const days: WorkoutDay[] = [
    {
      day: 0,
      name: "Monday",
      focus: "Chest & Triceps",
      warmup: "5 min cardio + arm circles",
      exercises: [
        {
          id: "1",
          name: "Bench Press",
          sets: 4,
          reps: 8,
          weight: 80,
          restSeconds: 120,
          notes: "Main strength builder",
        },
        { id: "2", name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 30, restSeconds: 90, notes: "" },
        { id: "3", name: "Tricep Dips", sets: 3, reps: 8, restSeconds: 90, notes: "" },
      ],
      cooldown: "5 min stretching",
    },
    {
      day: 1,
      name: "Tuesday",
      focus: "Back & Biceps",
      warmup: "5 min rowing + stretching",
      exercises: [
        { id: "1", name: "Deadlifts", sets: 4, reps: 6, weight: 140, restSeconds: 180, notes: "Full body compound" },
        { id: "2", name: "Barbell Rows", sets: 4, reps: 8, weight: 100, restSeconds: 120, notes: "" },
        { id: "3", name: "Barbell Curls", sets: 3, reps: 10, weight: 30, restSeconds: 90, notes: "" },
      ],
      cooldown: "5 min foam rolling",
    },
    {
      day: 2,
      name: "Wednesday",
      focus: "Rest or Cardio",
      warmup: "10 min easy pace",
      exercises: [
        { id: "1", name: "30 min Light Cardio", sets: 1, reps: 1, restSeconds: 0, notes: "Run, bike, or swim" },
      ],
      cooldown: "Stretching",
    },
    {
      day: 3,
      name: "Thursday",
      focus: "Legs",
      warmup: "10 min dynamic leg warmup",
      exercises: [
        { id: "1", name: "Squats", sets: 4, reps: 8, weight: 120, restSeconds: 120, notes: "Deep controlled reps" },
        { id: "2", name: "Leg Press", sets: 3, reps: 10, weight: 200, restSeconds: 90, notes: "" },
        { id: "3", name: "Leg Curls", sets: 3, reps: 12, weight: 70, restSeconds: 60, notes: "" },
      ],
      cooldown: "Leg stretches",
    },
    {
      day: 4,
      name: "Friday",
      focus: "Shoulders & Core",
      warmup: "5 min arm circles + shoulder rolls",
      exercises: [
        { id: "1", name: "Overhead Press", sets: 4, reps: 8, weight: 50, restSeconds: 120, notes: "" },
        { id: "2", name: "Lateral Raises", sets: 3, reps: 12, weight: 15, restSeconds: 60, notes: "" },
        { id: "3", name: "Planks", sets: 3, reps: 1, restSeconds: 90, notes: "Hold for 60 seconds" },
      ],
      cooldown: "Shoulder stretches",
    },
    {
      day: 5,
      name: "Saturday",
      focus: "Optional Active Recovery",
      warmup: "Easy warm-up",
      exercises: [{ id: "1", name: "Light Walk or Yoga", sets: 1, reps: 1, restSeconds: 0, notes: "30-45 minutes" }],
      cooldown: "Stretching",
    },
    {
      day: 6,
      name: "Sunday",
      focus: "Rest Day",
      warmup: "",
      exercises: [],
      cooldown: "",
    },
  ]

  return {
    id: "plan-1",
    trainingFrequency,
    workoutSplit,
    focusArea: profile.fitness_goal,
    days,
  }
}

function localGenerateMealPlan(profile: UserProfile): MealPlan {
  const bmr =
    10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + (profile.gender === "male" ? 5 : -161)
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  }
  const tdee = bmr * (activityMultipliers[profile.activity_level] || 1.55)

  let dailyCalories = tdee
  let proteinRatio = 0.3
  let carbsRatio = 0.45
  let fatsRatio = 0.25

  if (profile.fitness_goal === "weight_loss") {
    dailyCalories = tdee * 0.8
    proteinRatio = 0.35
    carbsRatio = 0.4
    fatsRatio = 0.25
  } else if (profile.fitness_goal === "weight_gain") {
    dailyCalories = tdee * 1.15
    proteinRatio = 0.3
    carbsRatio = 0.5
    fatsRatio = 0.2
  }

  const protein = Math.round((dailyCalories * proteinRatio) / 4)
  const carbs = Math.round((dailyCalories * carbsRatio) / 4)
  const fats = Math.round((dailyCalories * fatsRatio) / 9)

  const meals: Meal[] = [
    {
      type: "breakfast",
      name: "Oatmeal with Banana & Berries",
      items: [
        { name: "Oatmeal", quantity: "50g", calories: 190, protein: 5, carbs: 27, fats: 4 },
        { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fats: 0 },
        { name: "Mixed Berries", quantity: "100g", calories: 57, protein: 1, carbs: 12, fats: 0 },
      ],
      totals: { calories: 352, protein: 7, carbs: 66, fats: 4 },
    },
    {
      type: "snack",
      name: "Protein Bar & Apple",
      items: [
        { name: "Protein Bar", quantity: "1 bar", calories: 200, protein: 20, carbs: 20, fats: 7 },
        { name: "Apple", quantity: "1 medium", calories: 95, protein: 0, carbs: 25, fats: 0 },
      ],
      totals: { calories: 295, protein: 20, carbs: 45, fats: 7 },
    },
    {
      type: "lunch",
      name: "Grilled Chicken with Brown Rice",
      items: [
        { name: "Chicken Breast", quantity: "200g", calories: 330, protein: 62, carbs: 0, fats: 7 },
        { name: "Brown Rice", quantity: "150g cooked", calories: 195, protein: 4, carbs: 43, fats: 2 },
        { name: "Broccoli", quantity: "100g", calories: 34, protein: 3, carbs: 7, fats: 0 },
      ],
      totals: { calories: 559, protein: 69, carbs: 50, fats: 9 },
    },
    {
      type: "pre_workout",
      name: "Banana & Almond Butter",
      items: [
        { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fats: 0 },
        { name: "Almond Butter", quantity: "2 tbsp", calories: 190, protein: 7, carbs: 7, fats: 17 },
      ],
      totals: { calories: 295, protein: 8, carbs: 34, fats: 17 },
    },
    {
      type: "post_workout",
      name: "Protein Shake with Banana",
      items: [
        { name: "Whey Protein", quantity: "30g", calories: 120, protein: 25, carbs: 2, fats: 2 },
        { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fats: 0 },
        { name: "Almond Milk", quantity: "250ml", calories: 30, protein: 1, carbs: 1, fats: 3 },
      ],
      totals: { calories: 255, protein: 27, carbs: 30, fats: 5 },
    },
    {
      type: "dinner",
      name: "Salmon with Sweet Potato",
      items: [
        { name: "Salmon Fillet", quantity: "180g", calories: 280, protein: 35, carbs: 0, fats: 15 },
        { name: "Sweet Potato", quantity: "200g", calories: 180, protein: 2, carbs: 41, fats: 0 },
        { name: "Asparagus", quantity: "100g", calories: 25, protein: 3, carbs: 4, fats: 0 },
      ],
      totals: { calories: 485, protein: 40, carbs: 45, fats: 15 },
    },
  ]

  return {
    id: "meal-plan-1",
    dailyCalorieTarget: Math.round(dailyCalories),
    protein,
    carbs,
    fats,
    meals,
  }
}
