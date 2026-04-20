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
