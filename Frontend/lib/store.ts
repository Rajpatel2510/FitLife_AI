// import { create } from "zustand"
// import { persist } from "zustand/middleware"
// import { generateWorkoutPlan as generateWorkoutPlanAPI } from "@/lib/api"
// import { fetchUserData } from "@/lib/api"


// /* =======================
//    USER & DOMAIN MODELS
// ======================= */

// export interface UserProfile {
//   id?: string
//   name: string
//   age: number
//   gender: string
//   height_cm: number
//   weight_kg: number
//   fitness_goal: string
//   fitness_level: string
//   activity_level: string
//   body_type: string
//   diet_type: string
//   allergies_restrictions: string[]
//   food_dislikes: string[]
//   place_of_workout: string
//   available_equipment: string[]
//   injury_pain_conditions: string[]
//   sleep_duration_hours: number
//   water_intake_liters: number
//   steps_per_day: number
//   stress_level: string
//   bmi?: number
//   bmr?: number
//   tdee?: number
// }

// export interface DailyLog {
//   date: string
//   workoutCompleted: boolean
//   mealAdherence: number
//   energyLevel: number
//   hungerLevel: number
//   stepsCount: number
//   waterConsumed: number
//   sleepHours: number
//   stressLevel: string
//   mood: string
// }

// export interface Exercise {
//   id: string
//   name: string
//   sets: number
//   reps: number
//   weight?: number
//   restSeconds: number
//   notes?: string
// }

// export interface WorkoutDay {
//   day: number
//   name: string
//   focus: string
//   warmup: string
//   exercises: Exercise[]
//   cooldown: string
// }

// export interface WorkoutPlan {
//   id: string
//   trainingFrequency: number
//   workoutSplit: string
//   focusArea: string
//   days: WorkoutDay[]
// }

// export interface Meal {
//   type: string
//   name: string
//   items: Array<{
//     name: string
//     quantity: string
//     calories: number
//     protein: number
//     carbs: number
//     fats: number
//   }>
//   totals: {
//     calories: number
//     protein: number
//     carbs: number
//     fats: number
//   }
// }

// export interface MealPlan {
//   id: string
//   dailyCalorieTarget: number
//   protein: number
//   carbs: number
//   fats: number
//   meals: Meal[]
// }

// /* =======================
//         APP STATE
// ======================= */

// interface AppState {
//   userProfile: UserProfile | null
//   setUserProfile: (profile: UserProfile) => void

//   isOnboarded: boolean
//   setIsOnboarded: (value: boolean) => void

//   workoutPlan: WorkoutPlan | null
//   isGeneratingWorkoutPlan: boolean
//   generateWorkoutPlan: (token?: string) => Promise<void>
//   setWorkoutPlan: (plan: WorkoutPlan) => void

//   mealPlan: MealPlan | null
//   isGeneratingMealPlan: boolean
//   generateMealPlan: (token?: string) => Promise<void>
//   setMealPlan: (plan: MealPlan | null) => void

//   logout: () => void

//   dailyLogs: DailyLog[]
//   addDailyLog: (log: DailyLog) => void
//   getDailyLog: (date: string) => DailyLog | undefined

//   weeklyData: any
//   setWeeklyData: (data: any) => void

//   monthlyData: any
//   setMonthlyData: (data: any) => void
// }

// /* =======================
//       ZUSTAND STORE
// ======================= */

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       /* USER */
//       userProfile: null,
//       setUserProfile: (profile) => set({ userProfile: profile }),

//       isOnboarded: false,
//       setIsOnboarded: (value) => set({ isOnboarded: value }),

//       /* WORKOUT */
//       workoutPlan: null,
//       isGeneratingWorkoutPlan: false,

//       generateWorkoutPlan: async (token?: string) => {
//         const profile = get().userProfile
//         if (!profile) {
//           throw new Error("User profile is missing")
//         }

//         set({ isGeneratingWorkoutPlan: true })

//         try {
//           const plan = await generateWorkoutPlanAPI(profile, token)
//           set({ workoutPlan: plan })
//         } catch (error) {
//           console.error("Workout plan generation failed:", error)
//           throw error
//         } finally {
//           set({ isGeneratingWorkoutPlan: false })
//         }
//       },

//       setWorkoutPlan: (plan) => set({ workoutPlan: plan }),

//       /* MEAL */
//       mealPlan: null,
//       isGeneratingMealPlan: false,

//       generateMealPlan: async (token?: string) => {
//         const profile = get().userProfile
//         if (!profile) throw new Error("User profile is missing")

//         set({ isGeneratingMealPlan: true })
//         try {
//           const { generateMealPlan: generateMealPlanAPI } = await import("@/lib/api")
//           const plan = await generateMealPlanAPI(profile, token)
//           set({ mealPlan: plan })
//         } catch (error) {
//           console.error("Meal plan generation failed:", error)
//           throw error
//         } finally {
//           set({ isGeneratingMealPlan: false })
//         }
//       },

//       setMealPlan: (plan) => set({ mealPlan: plan }),

//       logout: () => {
//         set({
//           userProfile: null,
//           isOnboarded: false,
//           workoutPlan: null,
//           mealPlan: null,
//           dailyLogs: [],
//           weeklyData: null,
//           monthlyData: null
//         })
//         // Also clear any persisted token if stored outside Zustand (though we don't seem to store it elsewhere yet)
//       },

//       /* DAILY LOGS */
//       dailyLogs: [],
//       addDailyLog: (log) => {
//         const state = get()
//         const existingIndex = state.dailyLogs.findIndex((l) => l.date === log.date)
//         if (existingIndex >= 0) {
//           const updated = [...state.dailyLogs]
//           updated[existingIndex] = log
//           set({ dailyLogs: updated })
//         } else {
//           set({ dailyLogs: [...state.dailyLogs, log] })
//         }
//       },

//       getDailyLog: (date) => {
//         return get().dailyLogs.find((l) => l.date === date)
//       },

//       /* ANALYTICS */
//       weeklyData: null,
//       setWeeklyData: (data) => set({ weeklyData: data }),

//       monthlyData: null,
//       setMonthlyData: (data) => set({ monthlyData: data }),
//     }),
//     {
//       name: "fitness-app-store",
//     },
//   ),
// )



import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  generateWorkoutPlan as generateWorkoutPlanAPI,
  fetchUserData,
} from "@/lib/api"

/* =======================
   USER & DOMAIN MODELS
======================= */

export interface UserProfile {
  id?: string
  name: string
  age: number
  gender: string
  height_cm: number
  weight_kg: number
  fitness_goal: string
  fitness_level: string
  activity_level: string
  body_type: string
  diet_type: string
  allergies_restrictions: string[]
  food_dislikes: string[]
  place_of_workout: string
  available_equipment: string[]
  injury_pain_conditions: string[]
  sleep_duration_hours: number
  water_intake_liters: number
  steps_per_day: number
  stress_level: string
  bmi?: number
  bmr?: number
  tdee?: number
}

export interface DailyLog {
  date: string
  workoutCompleted: boolean
  mealAdherence: number
  energyLevel: number
  hungerLevel: number
  stepsCount: number
  waterConsumed: number
  sleepHours: number
  stressLevel: string
  mood: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  restSeconds: number
  notes?: string
}

export interface WorkoutDay {
  day: number
  name: string
  focus: string
  warmup: string
  exercises: Exercise[]
  cooldown: string
}

export interface WorkoutPlan {
  id: string
  trainingFrequency: number
  workoutSplit: string
  focusArea: string
  days: WorkoutDay[]
}

export interface Meal {
  meals: {
    breakfast?: any
    lunch?: any
    dinner?: any
    pre_workout?: any
    post_workout?: any
  }
}

// export interface MealPlan {
//   id: string
//   dailyCalorieTarget: number
//   protein: number
//   carbs: number
//   fats: number
//   meals: Meal[]
// }

export interface MealPlan {
  week: Record<string, any>
}
/* =======================
        APP STATE
======================= */

interface AppState {
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile) => void

  isOnboarded: boolean
  setIsOnboarded: (value: boolean) => void

  workoutPlan: WorkoutPlan | null
  isGeneratingWorkoutPlan: boolean
  generateWorkoutPlan: (token?: string) => Promise<void>
  setWorkoutPlan: (plan: WorkoutPlan | null) => void

  mealPlan: MealPlan | null
  isGeneratingMealPlan: boolean
  generateMealPlan: (token?: string) => Promise<void>
  setMealPlan: (plan: MealPlan | null) => void

  loadUserData: () => Promise<void>

  logout: () => void

  dailyLogs: DailyLog[]
  addDailyLog: (log: DailyLog) => void
  getDailyLog: (date: string) => DailyLog | undefined

  weeklyData: any
  setWeeklyData: (data: any) => void

  monthlyData: any
  setMonthlyData: (data: any) => void
}

/* =======================
      ZUSTAND STORE
======================= */

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      /* USER */
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      isOnboarded: false,
      setIsOnboarded: (value) => set({ isOnboarded: value }),

      /* WORKOUT */
      workoutPlan: null,
      isGeneratingWorkoutPlan: false,

      // generateWorkoutPlan: async (token?: string) => {
      //   const profile = get().userProfile
      //   if (!profile) throw new Error("User profile is missing")

      //   set({ isGeneratingWorkoutPlan: true })
      //   try {
      //     const plan = await generateWorkoutPlanAPI(profile, token)
      //     set({ workoutPlan: plan })
      //   } finally {
      //     set({ isGeneratingWorkoutPlan: false })
      //   }
      // },
      generateWorkoutPlan: async (token?: string) => {
        const profile = get().userProfile
        if (!profile) throw new Error("User profile is missing")

        set({ isGeneratingWorkoutPlan: true })

        try {
          const plan = await generateWorkoutPlanAPI(profile, token)

          // ✅ NORMALIZE HERE
          set({
            workoutPlan: plan?.WorkoutWeekPlan ?? null,
          })
        } finally {
          set({ isGeneratingWorkoutPlan: false })
        }
      },

      setWorkoutPlan: (plan) => set({ workoutPlan: plan }),

      /* MEAL */
      mealPlan: null,
      isGeneratingMealPlan: false,

      generateMealPlan: async (token?: string) => {
        const profile = get().userProfile
        if (!profile) throw new Error("User profile is missing")

        set({ isGeneratingMealPlan: true })
        try {
          const { generateMealPlan } = await import("@/lib/api")
          const plan = await generateMealPlan(profile, token)
          set({ mealPlan: plan })
        } finally {
          set({ isGeneratingMealPlan: false })
        }
      },

      setMealPlan: (plan) => set({ mealPlan: plan }),

      /* 🔑 LOAD USER DATA FROM BACKEND */
      // loadUserData: async () => {
      //   const token = localStorage.getItem("access_token")
      //   if (!token) return

      //   try {
      //  const { fetchUserData } = await import("@/lib/api")
      //     const data = await fetchUserData(token)
      //     set({
      //       userProfile: data.profile ?? null,
      //       workoutPlan: data.workout_plan ?? null,
      //       mealPlan: data.meal_plan ?? null,
      //       isOnboarded: true,
      //     })
      //   } catch (err) {
      //     console.error("Failed to load user data:", err)
      //   }
      // }

      // loadUserData: async () => {
      //   const token = localStorage.getItem("access_token")
      //   if (!token) return

      //   const { fetchUserData } = await import("@/lib/api")
      //   const data = await fetchUserData(token)

      //   set({
      //     userProfile: data.profile ?? null,
      //     workoutPlan: data.workout_plan ?? null,
      //     mealPlan: data.meal_plan
      //       ? { week: data.meal_plan }
      //       : null,
      //     isOnboarded: true,
      //   })
      // },
      loadUserData: async () => {
        const token = localStorage.getItem("access_token")
        if (!token) {
          console.warn("⚠️ No access token found")
          return
        }

        const { fetchUserData } = await import("@/lib/api")
        const data = await fetchUserData(token)

        console.log("MEAL PLAN FROM API:", data.meal_plan)

        set({
          workoutPlan: data.workout_plan?.WorkoutWeekPlan ?? null,
        })

        set({
          userProfile: data.profile ?? null,
          workoutPlan: data.workout_plan?.WorkoutWeekPlan ?? null,
          mealPlan: data.meal_plan ? { week: data.meal_plan } : null,
          isOnboarded: true,
        })

      },


      logout: () => {
        set({
          userProfile: null,
          isOnboarded: false,
          workoutPlan: null,
          mealPlan: null,
          dailyLogs: [],
          weeklyData: null,
          monthlyData: null,
        })
      },

      /* DAILY LOGS */
      dailyLogs: [],
      addDailyLog: (log) => {
        const state = get()
        const idx = state.dailyLogs.findIndex((l) => l.date === log.date)
        if (idx >= 0) {
          const updated = [...state.dailyLogs]
          updated[idx] = log
          set({ dailyLogs: updated })
        } else {
          set({ dailyLogs: [...state.dailyLogs, log] })
        }
      },

      getDailyLog: (date) =>
        get().dailyLogs.find((l) => l.date === date),

      /* ANALYTICS */
      weeklyData: null,
      setWeeklyData: (data) => set({ weeklyData: data }),

      monthlyData: null,
      setMonthlyData: (data) => set({ monthlyData: data }),
    }),
    {
      name: "fitness-app-store",
    },
  ),
)
