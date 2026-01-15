"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WeeklyProgressProps {
  data: any[]
}

export function WeeklyProgress({ data }: WeeklyProgressProps) {
  // Take last 7 days and reverse to chronological
  const chartData = [...data].slice(0, 7).reverse().map(item => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    adherence: item.meal_adherence,
    energy: item.energy_level,
    steps: item.steps_count
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Consistency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Meal Adherence (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="adherence" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Energy Levels (1-10)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="energy" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--secondary))" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
