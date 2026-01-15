"use client"

import { useState } from "react"
import { DailyCheckIn } from "@/components/daily/daily-check-in"
import { RemindersCard } from "@/components/daily/reminders-card"

export default function DailyRoutinePage() {
  const [checkInDone, setCheckInDone] = useState(false)

  const reminders = [
    { icon: "🏋️", title: "Workout Reminder", time: "06:00 AM", description: "Time for your morning workout!" },
    { icon: "🍽️", title: "Meal Reminder", time: "12:30 PM", description: "Lunch time! Check your meal plan" },
    { icon: "💧", title: "Hydration Reminder", time: "03:00 PM", description: "Drink 250ml water now" },
    { icon: "💪", title: "Motivation", time: "08:00 PM", description: "You're doing great! Keep it up!" },
  ]

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Daily Routine</h1>
        <p className="text-muted-foreground mt-2">Stay on track with daily reminders and check-ins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyCheckIn onComplete={() => setCheckInDone(true)} />
        </div>

        <div>
          <RemindersCard reminders={reminders} />
        </div>
      </div>
    </div>
  )
}
