"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WorkoutSchedule } from "@/components/workout/workout-schedule"
import { WorkoutDetail } from "@/components/workout/workout-detail"

export default function WorkoutPage() {
  const workoutPlan = useAppStore((state) => state.workoutPlan)
  const generateWorkoutPlan = useAppStore((state) => state.generateWorkoutPlan)
  const isGenerating = useAppStore((state) => state.isGeneratingWorkoutPlan)
  const loadUserData = useAppStore((state) => state.loadUserData)

  const [selectedDay, setSelectedDay] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        await loadUserData()
      } catch (error) {
        console.error("Failed to load workout data", error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [loadUserData])

  const handleGenerate = async () => {
    try {
      await generateWorkoutPlan()
      toast.success("Workout plan generated successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to generate workout plan")
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!workoutPlan) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-xl font-semibold">No Workout Plan Found</h2>
            <p className="text-muted-foreground">
              Generate a personalized workout plan based on your profile.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? "Generating Plan..." : "Generate Workout Plan"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (
    !Array.isArray((workoutPlan as any).weekly_schedule) ||
    (workoutPlan as any).weekly_schedule.length === 0
  ) {
    return <div className="p-4">No workout plan available</div>
  }

  const currentDay =
    (workoutPlan as any).weekly_schedule[selectedDay] ??
    (workoutPlan as any).weekly_schedule[0]

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Your Workout Plan</h1>
        <p className="text-muted-foreground mt-2">Personalized Weekly Plan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <WorkoutSchedule
            days={(workoutPlan as any).weekly_schedule}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>

        <div className="lg:col-span-3">
          <WorkoutDetail day={currentDay} />
        </div>
      </div>
    </div>
  )
}
