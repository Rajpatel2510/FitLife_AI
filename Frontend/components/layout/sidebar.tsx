"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, Zap, UtensilsCrossed, CheckCircle, BarChart3, Settings, LogOut } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAppStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/onboarding")
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/dashboard/workout", label: "Workouts", icon: Zap },
    { href: "/dashboard/nutrition", label: "Nutrition", icon: UtensilsCrossed },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border/40 hidden md:flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground/10 border border-foreground/20 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-foreground rounded-md"></div>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">FitAI Coach</h1>
            <p className="text-xs text-muted-foreground">Personal Trainer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-150 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-all duration-150"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
