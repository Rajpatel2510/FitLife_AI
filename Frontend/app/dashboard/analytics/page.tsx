"use client"

import { useState, useEffect } from "react"
import { WeeklyProgress } from "@/components/analytics/weekly-progress"
import { ProgressCharts } from "@/components/analytics/progress-charts"
import { getProgressHistory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getProgressHistory()
        setHistory(data)
      } catch (err) {
        console.error("Error fetching history:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 animate-pulse">
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="h-32"></CardContent>
            </Card>
          ))}
        </div>
        <div className="h-[400px] bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Analytics & Progress
          </h1>
          <p className="text-muted-foreground text-lg">
            Detailed insights into your fitness journey and performance trends
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Last 30 Days</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{history.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Logged in the last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workout Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {history.length > 0
                ? Math.round((history.filter(h => h.workout_completed).length / history.length) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-secondary/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Meal Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {history.length > 0
                ? Math.round(history.reduce((acc, curr) => acc + curr.meal_adherence, 0) / history.length)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Focus on nutrition</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <ProgressCharts data={history} />
        </div>
        <div className="lg:col-span-3">
          <WeeklyProgress data={history} />
        </div>
      </div>

      {history.length === 0 && (
        <Card className="bg-muted/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No progress data yet</p>
            <p className="text-sm">Start logging your daily progress to see analytics here!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
