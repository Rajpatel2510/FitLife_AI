"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const router = useRouter()
  const isOnboarded = useAppStore((state) => state.isOnboarded)

  useEffect(() => {
    if (isOnboarded) {
      router.push("/dashboard")
    } else {
      router.push("/onboarding")
    }
  }, [isOnboarded, router])

  return null
}
