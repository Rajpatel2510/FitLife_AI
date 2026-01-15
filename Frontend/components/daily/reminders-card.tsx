"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Reminder {
  icon: string
  title: string
  time: string
  description: string
}

interface RemindersCardProps {
  reminders: Reminder[]
}

export function RemindersCard({ reminders }: RemindersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Today's Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map((reminder, i) => (
          <div key={i} className="p-3 bg-accent/10 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{reminder.icon}</span>
              <div className="flex-1 text-sm">
                <p className="font-semibold">{reminder.title}</p>
                <p className="text-muted-foreground text-xs">{reminder.time}</p>
                <p className="text-muted-foreground mt-1">{reminder.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
