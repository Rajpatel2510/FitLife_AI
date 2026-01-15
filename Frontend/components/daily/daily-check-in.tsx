"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyCheckInProps {
  onComplete: () => void
}

export function DailyCheckIn({ onComplete }: DailyCheckInProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center py-12">
        <p className="text-4xl">✅</p>
        <p className="text-lg font-semibold">Log your progress in the form on the left</p>
        <p className="text-muted-foreground">Track your workout, meals, and how you're feeling today</p>
      </CardContent>
    </Card>
  )
}
