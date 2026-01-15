"use client"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAppStore } from "@/lib/store"

export function TopNav() {
  const userProfile = useAppStore((state) => state.userProfile)

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-semibold text-foreground">{userProfile?.name}</h2>
          <p className="text-xs text-muted-foreground capitalize">{userProfile?.fitness_goal?.replace(/_/g, " ")}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </nav>
  )
}
