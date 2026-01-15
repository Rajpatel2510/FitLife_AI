// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import type { WorkoutDay } from "@/lib/store"

// interface WorkoutDetailProps {
//   day: WorkoutDay
// }

// export function WorkoutDetail({ day }: WorkoutDetailProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{day.name}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div>
//           <h3 className="font-bold text-lg mb-2">Warm-up</h3>
//           <p className="text-sm">{day.warmup}</p>
//         </div>

//         <div>
//           <h3 className="font-bold text-lg mb-4">Main Workout</h3>
//           <div className="space-y-3">
//             {day.exercises.map((ex, i) => (
//               <div key={i} className="border border-border rounded-lg p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <h4 className="font-semibold">{ex.name}</h4>
//                   <span className="text-sm text-muted-foreground bg-accent/10 px-2 py-1 rounded">Exercise {i + 1}</span>
//                 </div>
//                 <div className="grid grid-cols-4 gap-2 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Sets</p>
//                     <p className="font-semibold">{ex.sets}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Reps</p>
//                     <p className="font-semibold">{ex.reps}</p>
//                   </div>
//                   {ex.weight && (-
//                     <div>
//                       <p className="text-muted-foreground">Weight</p>
//                       <p className="font-semibold">{ex.weight} kg</p>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-muted-foreground">Rest</p>
//                     <p className="font-semibold">{ex.restSeconds}s</p>
//                   </div>
//                 </div>
//                 {ex.notes && <p className="text-sm text-muted-foreground mt-2">💡 {ex.notes}</p>}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="font-bold text-lg mb-2">Cool-down</h3>
//           <p className="text-sm">{day.cooldown}</p>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

interface Exercise {
  name: string
  sets?: number
  reps?: number
  rest_seconds?: number
  duration_seconds?: number
}

interface WorkoutDay {
  day_number: number
  workout_split?: string
  label?: string
  workout_warmup?: Exercise[]
  workout_main_exercise?: Exercise[]
  workout_cool_down?: Exercise[]
}

interface WorkoutDetailProps {
  day: WorkoutDay
}

export function WorkoutDetail({ day }: WorkoutDetailProps) {
  // 💤 REST DAY
  if (day.label === "REST DAY") {
    return (
      <div className="p-6 border rounded-lg text-center text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2">Rest Day</h3>
        <p>Take time to recover and prepare for the next workout.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* WARM-UP */}
      {Array.isArray(day.workout_warmup) && (
        <section>
          <h3 className="font-bold text-lg mb-3">Warm-up</h3>
          <div className="space-y-2">
            {day.workout_warmup.map((ex, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-3"
              >
                <p className="font-medium">{ex.name}</p>
                {ex.duration_seconds && (
                  <p className="text-xs text-muted-foreground">
                    Duration: {ex.duration_seconds}s
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN WORKOUT */}
      {Array.isArray(day.workout_main_exercise) && (
        <section>
          <h3 className="font-bold text-lg mb-3">Main Workout</h3>
          <div className="space-y-3">
            {day.workout_main_exercise.map((ex, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-4"
              >
                <h4 className="font-semibold">{ex.name}</h4>
                <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                  {ex.sets && <span>Sets: {ex.sets}</span>}
                  {ex.reps && <span>Reps: {ex.reps}</span>}
                  {ex.rest_seconds && <span>Rest: {ex.rest_seconds}s</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COOL DOWN */}
      {Array.isArray(day.workout_cool_down) && (
        <section>
          <h3 className="font-bold text-lg mb-3">Cool Down</h3>
          <div className="space-y-2">
            {day.workout_cool_down.map((ex, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-3"
              >
                <p className="font-medium">{ex.name}</p>
                {ex.duration_seconds && (
                  <p className="text-xs text-muted-foreground">
                    Duration: {ex.duration_seconds}s
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
