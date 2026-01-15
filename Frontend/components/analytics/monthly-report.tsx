"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"

export function MonthlyReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Consistency Score</span>
            <span className="font-bold">92%</span>
          </div>
          <ProgressBar value={92} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Diet Adherence</span>
            <span className="font-bold">88%</span>
          </div>
          <ProgressBar value={88} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Workout Completion</span>
            <span className="font-bold">100%</span>
          </div>
          <ProgressBar value={100} />
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold mb-3">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Weight Change</p>
              <p className="font-bold text-lg">-2.8 kg</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Energy</p>
              <p className="font-bold text-lg">7.6/10</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
