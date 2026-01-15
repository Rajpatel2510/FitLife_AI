// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import type { WorkoutDay } from "@/lib/store"

// interface WorkoutScheduleProps {
//   days: WorkoutDay[]
//   selectedDay: number
//   onSelectDay: (index: number) => void
// }

// export function WorkoutSchedule({ days, selectedDay, onSelectDay }: WorkoutScheduleProps) {
//   return (
//     <Card>
//       <CardContent className="pt-6 space-y-2">
//         <h3 className="font-bold mb-4">Weekly Schedule</h3>
//         {days.map((day, i) => (
//           <Button
//             key={i}
//             onClick={() => onSelectDay(i)}
//             variant={selectedDay === i ? "default" : "ghost"}
//             className="w-full justify-start"
//           >
//             <span className="text-xs font-medium mr-2">{day.name.slice(0, 3)}</span>
//             <span className="text-xs">{day.focus}</span>
//           </Button>
//         ))}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { Button } from "@/components/ui/button"

interface WorkoutDay {
  day_number: number
  workout_split?: string
  label?: string
}

interface WorkoutScheduleProps {
  days: WorkoutDay[]
  selectedDay: number
  onSelectDay: (index: number) => void
}

export function WorkoutSchedule({
  days,
  selectedDay,
  onSelectDay,
}: WorkoutScheduleProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2">Weekly Schedule</h3>

      {days.map((day, index) => {
        const isRest = day.label === "REST DAY"

        return (
          <Button
            key={index}
            variant={selectedDay === index ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onSelectDay(index)}
          >
            {/* DAY NUMBER */}
            <span className="text-xs font-medium mr-2">
              DAY {day.day_number}
            </span>

            {/* WORKOUT TYPE / REST */}
            <span className="text-xs text-muted-foreground">
              {isRest
                ? "Rest Day"
                : day.workout_split?.toUpperCase() || "Workout"}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
