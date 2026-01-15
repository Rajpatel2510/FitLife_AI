"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function QuickStats() {
  const userProfile = useAppStore((state) => state.userProfile)
  const workoutPlan = useAppStore((state) => state.workoutPlan)
  const mealPlan = useAppStore((state) => state.mealPlan)

  const stats = [
    {
      label: "Current Weight",
      value: `${userProfile?.weight_kg}`,
      unit: "kg",
      secondary: `BMI: ${userProfile?.bmi?.toFixed(1)}`,
    },
    {
      label: "Daily Calories",
      value: `${userProfile?.calorie_target}`,
      unit: "kcal",
      secondary: "Target intake",
    },
    {
      label: "Workout Days",
      value: workoutPlan?.days_per_week,
      unit: "per week",
      secondary: "Training frequency",
    },
    {
      label: "BMR",
      value: `${userProfile?.bmr?.toFixed(0)}`,
      unit: "kcal/day",
      secondary: "Resting metabolism",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="border border-border/60 shadow-none hover:border-foreground/30 transition-colors duration-200"
        >
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.unit}</p>
              </div>
              <p className="text-xs text-muted-foreground">{stat.secondary}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
