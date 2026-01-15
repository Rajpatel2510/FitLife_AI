"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MacroChartProps {
  macros: { protein: number; carbs: number; fats: number }
}

export function MacroChart({ macros }: MacroChartProps) {
  const data = [
    { name: "Protein", value: macros.protein, color: "hsl(var(--primary))" },
    { name: "Carbs", value: macros.carbs, color: "hsl(var(--secondary))" },
    { name: "Fats", value: macros.fats, color: "hsl(var(--accent))" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Macro Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}g`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
