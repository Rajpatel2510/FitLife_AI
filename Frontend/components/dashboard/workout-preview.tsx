// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useAppStore } from "@/lib/store"
// import Link from "next/link"

// export function WorkoutPreview() {
//   const workoutPlan = useAppStore((state) => state.workoutPlan)

//   if (!workoutPlan || !workoutPlan.days) return null

//   const today = new Date().getDay()
//   const todayWorkout = workoutPlan.days[today === 0 ? 0 : today - 1]

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Today's Workout</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {todayWorkout ? (
//           <>
//             <div>
//               <p className="text-sm text-muted-foreground">Focus</p>
//               <p className="font-semibold">{todayWorkout.focus}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Exercises</p>
//               <p className="font-semibold">{todayWorkout.exercises.length} exercises</p>
//             </div>
//             <Link href="/dashboard/workout">
//               <Button className="w-full">View Full Workout</Button>
//             </Link>
//           </>
//         ) : (
//           <p className="text-muted-foreground">Rest day</p>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export function WorkoutPreview() {
  const workoutPlan = useAppStore((state) => state.workoutPlan)

  // ❌ No plan or no weekly data
  if (!workoutPlan || !Array.isArray(workoutPlan.weekly_schedule)) {
    return null
  }

  // 📅 Today index (Mon = 0 ... Sun = 6)
  const todayIndex = new Date().getDay() === 0 ? 0 : new Date().getDay() - 1
  const todayWorkout = workoutPlan.weekly_schedule[todayIndex]

  // ✅ SAFE exercise count (NEW BACKEND SCHEMA)
  const exerciseCount = Array.isArray(
    todayWorkout?.workout_main_exercise
  )
    ? todayWorkout.workout_main_exercise.length
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Workout</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {todayWorkout && todayWorkout.workout_split ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Focus</p>
              <p className="font-semibold capitalize">
                {todayWorkout.workout_split}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Exercises</p>
              <p className="font-semibold">{exerciseCount} exercises</p>
            </div>

            <Link href="/dashboard/workout">
              <Button className="w-full">View Full Workout</Button>
            </Link>
          </>
        ) : (
          <p className="text-muted-foreground">Rest day</p>
        )}
      </CardContent>
    </Card>
  )
}
