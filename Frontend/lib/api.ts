// Backend API URL
const API_URL = "http://127.0.0.1:8000";

const TOKEN_KEY = "access_token";
console.log("API_URL =", API_URL);

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};


export async function createUser(userData: any) {
  try {
    const data = { ...userData, email: userData.email?.toLowerCase().trim() };
    const response = await fetch(`${API_URL}/onboarding/create_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create user");
    }

    return response.json();
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(`Failed to connect to backend at ${API_URL}: ${error.message}`);
  }
}

export async function createUserProfile(userId: string | number, profileData: any) {
  const token = getAuthToken()
  console.log("TOKEN:", token);

  if (!token) {
    throw new Error("User not authenticated. Please login again.")
  }

  const response = await fetch(`${API_URL}/onboarding/create_user_profile/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create user profile");
  }

  return response.json();
}

export async function login(credentials: any) {
  const response = await fetch(`${API_URL}/onboarding/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const result = await response.json()

  // ✅ STORE TOKEN CORRECTLY
  setAuthToken(result.access_token);

  // ✅ RETURN SAME RESULT
  return result;
}


export async function fetchUserData(token: string) {
  const res = await fetch(`${API_URL}/onboarding/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("❌ /onboarding/me failed:", res.status, text)
    throw new Error(`Failed to fetch user data (${res.status})`)
  }

  return res.json()
}

export async function generateWorkoutPlan(userProfile: any, token?: string) {
  const headers: any = {
    "Content-Type": "application/json",
  };
  const authToken = token || getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}/workout/generate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ user_profile: userProfile }),
  });

  if (!response.ok) {
    let errorMsg = "Failed to generate meal plan"

    try {
      const errorData = await response.json()

      // ✅ Handle FastAPI validation errors (array)
      if (Array.isArray(errorData.detail)) {
        errorMsg = errorData.detail
          .map((err: any) => err.msg || JSON.stringify(err))
          .join(", ")
      }
      // ✅ Handle normal string errors
      else if (typeof errorData.detail === "string") {
        errorMsg = errorData.detail
      }
      // ✅ Fallback
      else {
        errorMsg = JSON.stringify(errorData)
      }
    } catch (e) {
      errorMsg = "Meal plan generation failed (invalid server response)"
    }

    throw new Error(errorMsg)
  }


  const data = await response.json()
  // backend returns { final_workout_plan: { ... } } or { workout_plan: { ... } }
  const rawPlan = data.final_workout_plan || data.workout_plan || data;
  return transformWorkoutPlan(rawPlan);
}

export async function generateMealPlan(userProfile: any, token?: string) {
  const headers: any = {
    "Content-Type": "application/json",
  };
  const authToken = token || getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}/nutrition/generate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ user_profile: userProfile }),
  });

  if (!response.ok) {
    let errorMsg = "Failed to generate meal plan"
    try {
      const errorData = await response.json()
      errorMsg = errorData.detail || errorMsg
    } catch (e) { }
    throw new Error(errorMsg)
  }

  const data = await response.json()
  // backend returns { meal_plan: { ... } }
  const rawPlan = data.meal_plan || data;
  return transformMealPlan(rawPlan, userProfile);
}

function transformMealPlan(rawPlan: any, userProfile?: any) {
  if (!rawPlan) return null

  // If the backend returned a wrapper { meal_plan: { ... } }
  const plan = rawPlan.meal_plan || rawPlan

  // If the backend already returned a frontend-friendly MealPlan ({ meals: [...] }), return as-is
  if (plan.meals && Array.isArray(plan.meals)) {
    return plan
  }

  // Backend returns structure with keys like breakfast, lunch, dinner
  // with string descriptions. We map these to the Meal[] structure.
  const mealTypes = [
    { key: "breakfast", type: "breakfast", name: "Breakfast" },
    { key: "pre_workout", type: "pre_workout", name: "Pre-Workout" },
    { key: "lunch", type: "lunch", name: "Lunch" },
    { key: "post_workout", type: "post_workout", name: "Post-Workout" },
    { key: "dinner", type: "dinner", name: "Dinner" },
  ]

  const meals = mealTypes
    .filter((mt) => plan[mt.key])
    .map((mt) => ({
      type: mt.type,
      name: mt.name,
      items: [
        {
          name: plan[mt.key],
          quantity: "1 serving",
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        },
      ],
      totals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    }))

  return {
    id: plan.id || Date.now().toString(),
    dailyCalorieTarget: userProfile?.tdee || 2000,
    protein: userProfile?.protein || 150,
    carbs: userProfile?.carbs || 200,
    fats: userProfile?.fats || 60,
    meals: meals,
  }
}


function unwrap(obj: any): any {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const keys = Object.keys(obj);

  // If it's a wrapper object with one key like "WorkoutDay", "RestDay", etc.
  if (keys.length === 1 && typeof obj[keys[0]] === "object" && !Array.isArray(obj[keys[0]])) {
    return unwrap(obj[keys[0]]);
  }

  // If it's a regular object, unwrap its properties
  const newObj: any = {};
  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      newObj[key] = obj[key].map((item: any) => unwrap(item));
    } else {
      newObj[key] = unwrap(obj[key]);
    }
  }
  return newObj;
}

function transformWorkoutPlan(rawPlan: any): any {
  if (!rawPlan) return null;

  // 1. First, handle any top-level wrapper like { workout_plan: ... } or { final_workout_plan: ... }
  let data = rawPlan.final_workout_plan || rawPlan.workout_plan || rawPlan.WorkoutWeekPlan || rawPlan;

  // 2. Recursively unwrap schema-named wrappers
  data = unwrap(data);

  // 3. Identify the schedule (backend uses workout_days or weekly_schedule)
  const schedule = data.weekly_schedule || data.workout_days || data.days;

  if (!Array.isArray(schedule)) {
    console.warn("Could not find a valid schedule array in workout plan:", data);
    return null;
  }

  // 4. Normalize each day
  const normalizedDays = schedule.map((rawDay: any, index: number) => {
    const day = unwrap(rawDay);

    // Check if it's a rest day
    const isRest = day.label === "REST DAY" || day.isRest === true || day.workout_split?.toLowerCase() === "rest";

    if (isRest) {
      return {
        day_number: day.day_number || (index + 1),
        label: "REST DAY",
        type: "rest",
        workout_split: "Rest Day",
      };
    }

    // Workout Day
    return {
      day_number: day.day_number || (index + 1),
      type: "workout",
      workout_split: day.workout_split || "Workout",
      label: day.label || "",
      workout_warmup: Array.isArray(day.workout_warmup) ? day.workout_warmup.map(unwrap) : [],
      workout_main_exercise: Array.isArray(day.workout_main_exercise) ? day.workout_main_exercise.map(unwrap) : [],
      workout_cool_down: Array.isArray(day.workout_cool_down) ? day.workout_cool_down.map(unwrap) : [],
    };
  });

  return {
    id: data.id || Date.now().toString(),
    days_per_week: data.days_per_week || normalizedDays.filter(d => d.type === "workout").length,
    weekly_schedule: normalizedDays,
    // Keep legacy field for compatibility
    days: normalizedDays,
    workoutSplit: data.workout_split || "Personalized Plan"
  };
}


export async function saveDailyProgress(log: any) {
  const token = localStorage.getItem("access_token")

  if (!token) {
    throw new Error("User not authenticated");
  }

  // Map frontend camelCase to backend snake_case
  const payload = {
    date: log.date,
    workout_completed: !!log.workoutCompleted,
    steps_count: Number(log.stepsCount || 0),
    water_consumed: Number(log.waterConsumed || 0),
    sleep_hours: Number(log.sleepHours || 0),
    energy_level: Number(log.energyLevel || 0),
    hunger_level: Number(log.hungerLevel || 0),
    meal_adherence: Number(log.mealAdherence || 0),
  };

  const res = await fetch(`${API_URL}/progress/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to save daily progress")
  }

  return res.json()
}

export async function getTodayProgress() {
  const token = localStorage.getItem("access_token")
  if (!token) return { exists: false }

  const res = await fetch(`${API_URL}/progress/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return { exists: false }
  return res.json()
}

export async function getProgressHistory() {
  const token = localStorage.getItem("access_token")
  if (!token) return []

  const res = await fetch(`${API_URL}/progress/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return []
  return res.json()
}
