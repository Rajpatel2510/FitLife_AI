// "use client"

// import { Card } from "@/components/ui/card"
// import { useAppStore } from "@/lib/store"
// import { MealList } from "@/components/nutrition/meal-list"
// import { MacroChart } from "@/components/nutrition/macro-chart"

// export default function NutritionPage() {
//   const mealPlan = useAppStore((state) => state.mealPlan)

//   if (!mealPlan) {
//     return (
//       <div className="p-8">
//         <Card>
//           <div className="p-8 text-center">
//             <p>Generate a meal plan first.</p>
//           </div>
//         </Card>
//       </div>
//     )
//   } 

//   return (
//     <div className="p-4 md:p-8 space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold">Your Meal Plan</h1>
//         <p className="text-muted-foreground mt-2">Daily Target: {mealPlan.dailyCalorieTarget} calories</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <MealList meals={mealPlan.meals} />
//         </div>
//         <div>
//           <MacroChart macros={{ protein: mealPlan.protein, carbs: mealPlan.carbs, fats: mealPlan.fats }} />
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { useAppStore } from "@/lib/store"
// import { MealList } from "@/components/nutrition/meal-list"

// export default function NutritionPage() {
//   const mealPlan = useAppStore((state) => state.mealPlan)
//   const loadUserData = useAppStore((state) => state.loadUserData)

//   // useEffect(() => {
//   //   loadUserData()
//   // }, [loadUserData])

//   useEffect(() => {
//   const token = localStorage.getItem("access_token")
//   if (token) {
//     loadUserData()
//   }
// }, [])


//   const selectedDay = "day_1"
//   const dayMeals = mealPlan?.week?.[selectedDay]

//   if (!mealPlan || !dayMeals) {
//     return (
//       <div className="p-8">
//         <Card>
//           <div className="p-8 text-center">
//             No Meal Plan Found
//           </div>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="p-8 space-y-6">
//       <h1 className="text-3xl font-bold">
//         Meal Plan – Day 1
//       </h1>

//       <MealList meals={dayMeals} />
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { MealList } from "@/components/nutrition/meal-list"
import { Button } from "@/components/ui/button"

export default function NutritionPage() {
  const mealPlan = useAppStore((state) => state.mealPlan)
  const loadUserData = useAppStore((state) => state.loadUserData)

  const [selectedDay, setSelectedDay] = useState("day_1")

  useEffect(() => {
    loadUserData()
  }, [])

  if (!mealPlan || !mealPlan.week) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">No Meal Plan Found</Card>
      </div>
    )
  }

  const days = Object.keys(mealPlan.week).filter((key) =>
  key.startsWith("day_")
)
  const dayMeals = mealPlan.week[selectedDay]

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* LEFT: DAY SELECTOR (LIKE WORKOUT) */}
      <div className="space-y-2">
        <h2 className="font-semibold mb-2">Weekly Plan</h2>
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setSelectedDay(day)}
          >
            {day.replace("_", " ").toUpperCase()}
          </Button>
        ))}
      </div>

      {/* RIGHT: MEALS */}
      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold">
          Meal Plan – {selectedDay.replace("_", " ").toUpperCase()}
        </h1>

        <MealList meals={dayMeals} />
      </div>
    </div>
  )
}
