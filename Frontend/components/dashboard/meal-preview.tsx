// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useAppStore } from "@/lib/store"
// import Link from "next/link"

// export function MealPreview() {
//   const mealPlan = useAppStore((state) => state.mealPlan)

//   if (!mealPlan) return null

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Today's Meals</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div>
//           <p className="text-sm text-muted-foreground">Daily Calories</p>
//           <p className="font-semibold text-2xl">{mealPlan.dailyCalorieTarget}</p>
//         </div>
//         <div className="grid grid-cols-3 gap-2 text-sm">
//           <div>
//             <p className="text-muted-foreground">Protein</p>
//             <p className="font-semibold">{mealPlan.protein}g</p>
//           </div>
//           <div>
//             <p className="text-muted-foreground">Carbs</p>
//             <p className="font-semibold">{mealPlan.carbs}g</p>
//           </div>
//           <div>
//             <p className="text-muted-foreground">Fats</p>
//             <p className="font-semibold">{mealPlan.fats}g</p>
//           </div>
//         </div>
//         <Link href="/dashboard/nutrition">
//           <Button className="w-full bg-secondary hover:bg-secondary/80">View Meal Plan</Button>
//         </Link>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export function MealPreview() {
  const mealPlan = useAppStore((state) => state.mealPlan)
  const userProfile = useAppStore((state) => state.userProfile)

  // Data structure: mealPlan.week contains { breakfast, lunch, dinner, etc. }
  // It is currently a single-day plan, not a week.
  const planData = mealPlan?.week

  const mealCount = planData
    ? Object.keys(planData).filter(key => planData[key] && planData[key] !== "None" && typeof planData[key] === 'string').length
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {planData ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Focus</p>
              <p className="font-semibold capitalize">
                {userProfile?.diet_type || "Balanced Nutrition"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Meals</p>
              <p className="font-semibold">{mealCount} meals scheduled</p>
            </div>

            <Link href="/dashboard/nutrition">
              <Button className="w-full">View Full Plan</Button>
            </Link>
          </>
        ) : (
          <div className="py-4 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No meal plan found for today.</p>
            <Link href="/dashboard/nutrition">
              <Button variant="outline" className="w-full">Generate Plan</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
