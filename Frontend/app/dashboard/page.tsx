// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useAppStore } from "@/lib/store"
// import { QuickStats } from "@/components/dashboard/quick-stats"
// import { TodayProgress } from "@/components/dashboard/today-progress"
// import { WorkoutPreview } from "@/components/dashboard/workout-preview"
// import { MealPreview } from "@/components/dashboard/meal-preview"
// import { MotivationCard } from "@/components/dashboard/motivation-card"
// import { ArrowRight, Activity, UtensilsCrossed, TrendingUp } from "lucide-react"
// import { useEffect } from "react"

// export default function DashboardPage() {
//   const userProfile = useAppStore((state) => state.userProfile)
//   const loadWorkoutPlan = useAppStore((state) => state.loadWorkoutPlan)
//   const loadMealPlan = useAppStore((state) => state.loadMealPlan)


//   return (
//     <div className="p-4 md:p-8 space-y-8">
//       <div className="space-y-1">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {userProfile?.name}</h1>
//         <p className="text-sm text-muted-foreground font-medium">
//           {new Date().toLocaleDateString("en-US", {
//             weekday: "long",
//             month: "long",
//             day: "numeric",
//           })}
//         </p>
//       </div>

//       {/* Key Metrics */}
//       <QuickStats />

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Today's Progress */}
//           <TodayProgress />

//           {/* Workout & Meal Preview */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <WorkoutPreview />
//             <MealPreview />
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           <MotivationCard />

//           {/* Quick Actions */}
//           <Card className="border border-border/60 shadow-none">
//             <CardHeader className="pb-4">
//               <CardTitle className="text-base">Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Button className="w-full bg-foreground hover:bg-foreground/90 text-background gap-2 h-9 text-sm font-medium">
//                 <Activity className="w-4 h-4" />
//                 Log Workout
//                 <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
//               </Button>
//               <Button className="w-full bg-muted hover:bg-muted/80 text-foreground gap-2 h-9 text-sm font-medium">
//                 <UtensilsCrossed className="w-4 h-4" />
//                 Log Meal
//                 <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full gap-2 h-9 text-sm font-medium border-border/60 bg-transparent hover:bg-muted/30"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 View Analytics
//                 <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-60" />
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { TodayProgress } from "@/components/dashboard/today-progress"
import { WorkoutPreview } from "@/components/dashboard/workout-preview"
import { MealPreview } from "@/components/dashboard/meal-preview"
import { MotivationCard } from "@/components/dashboard/motivation-card"
import { ArrowRight, Activity, UtensilsCrossed, TrendingUp } from "lucide-react"
import { RemindersCard } from "@/components/daily/reminders-card"

export default function DashboardPage() {
  const userProfile = useAppStore((state) => state.userProfile)
  const loadUserData = useAppStore((state) => state.loadUserData)

  const reminders = [
    { icon: "🏋️", title: "Workout Reminder", time: "06:00 AM", description: "Time for your morning workout!" },
    { icon: "🍽️", title: "Meal Reminder", time: "12:30 PM", description: "Lunch time! Check your meal plan" },
    { icon: "💧", title: "Hydration Reminder", time: "03:00 PM", description: "Drink 250ml water now" },
    { icon: "💪", title: "Motivation", time: "08:00 PM", description: "You're doing great! Keep it up!" },
  ]

  // 🔥 THIS IS THE MISSING PIECE
  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {userProfile?.name}
        </h1>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayProgress />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkoutPreview />
            <MealPreview />
          </div>
        </div>

        <div className="space-y-6">
          <MotivationCard />
        </div>
      </div>
    </div>
  )
}
