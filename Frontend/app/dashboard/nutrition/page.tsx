"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MealList } from "@/components/nutrition/meal-list"
import { useAppStore } from "@/lib/store"

export default function NutritionPage() {
  const mealPlan = useAppStore((state) => state.mealPlan)
  const loadUserData = useAppStore((state) => state.loadUserData)

  const [selectedDay, setSelectedDay] = useState("day_1")

  useEffect(() => {
    loadUserData().catch((error) => {
      console.error("Failed to load nutrition data", error)
    })
  }, [loadUserData])

  const days = mealPlan?.week
    ? Object.keys(mealPlan.week).filter((key) => key.startsWith("day_"))
    : []

  useEffect(() => {
    if (days.length > 0 && !days.includes(selectedDay)) {
      setSelectedDay(days[0])
    }
  }, [days, selectedDay])

  if (!mealPlan?.week || days.length === 0) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">No Meal Plan Found</Card>
      </div>
    )
  }

  const dayMeals = mealPlan.week[selectedDay]

  if (!dayMeals) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">No meals available for the selected day</Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
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

      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold">
          Meal Plan - {selectedDay.replace("_", " ").toUpperCase()}
        </h1>

        <MealList meals={dayMeals} />
      </div>
    </div>
  )
}
