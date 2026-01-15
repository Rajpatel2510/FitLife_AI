"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function MotivationCard() {
  const motivations = [
    "Every rep counts! You're building a stronger you.",
    "Progress over perfection. Keep pushing!",
    "Your future self will thank you for the effort today.",
    "Small steps lead to big changes. You got this!",
    "Consistency is key. Stay the course!",
    "You're stronger than you think. Let's prove it!",
  ]

  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)]

  return (
    <Card className="border border-border/50 bg-card shadow-sm overflow-hidden h-full flex flex-col justify-center min-h-[180px]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Quote className="w-5 h-5 fill-current opacity-20" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Daily Insight
          </span>
        </div>

        <p className="text-base md:text-lg font-medium leading-relaxed tracking-tight text-foreground/90 italic">
          "{randomMotivation}"
        </p>

        <div className="pt-2">
          <div className="h-0.5 w-8 bg-primary/20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
