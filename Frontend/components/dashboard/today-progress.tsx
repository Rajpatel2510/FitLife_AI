// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useAppStore } from "@/lib/store"
// import { FormInput } from "@/components/ui/form-inputs"

// export function TodayProgress() {
//   const addDailyLog = useAppStore((state) => state.addDailyLog)
//   const getDailyLog = useAppStore((state) => state.getDailyLog)
//   const today = new Date().toISOString().split("T")[0]
//   const todayLog = getDailyLog(today)

//   const [log, setLog] = useState(
//     todayLog || {
//       date: today,
//       workoutCompleted: false,
//       mealAdherence: 100,
//       energyLevel: 7,
//       hungerLevel: 5,
//       stepsCount: 0,
//       waterConsumed: 0,
//       sleepHours: 0,
//       stressLevel: "medium",
//       mood: "motivated",
//     },
//   )

//   const handleSave = () => {
//     addDailyLog(log)
//   }

//   return (
//     <Card className="border border-border/50 shadow-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-base">Today's Progress</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <label className="flex items-center gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={log.workoutCompleted}
//                 onChange={(e) => setLog({ ...log, workoutCompleted: e.target.checked })}
//                 className="w-5 h-5 rounded border-border/50 cursor-pointer"
//               />
//               <span className="font-medium text-foreground text-sm">Workout Completed</span>
//             </label>

//             <FormInput
//               label="Steps"
//               type="number"
//               value={log.stepsCount}
//               onChange={(e) => setLog({ ...log, stepsCount: Number.parseInt(e.target.value) })}
//             />

//             <FormInput
//               label="Water Intake (liters)"
//               type="number"
//               value={log.waterConsumed}
//               onChange={(e) => setLog({ ...log, waterConsumed: Number.parseFloat(e.target.value) })}
//               step="0.25"
//             />

//             <FormInput
//               label="Sleep (hours)"
//               type="number"
//               value={log.sleepHours}
//               onChange={(e) => setLog({ ...log, sleepHours: Number.parseFloat(e.target.value) })}
//               step="0.5"
//             />
//           </div>

//           <div className="space-y-4">
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium">Energy Level</label>
//                 <span className="text-sm font-semibold text-primary">{log.energyLevel}/10</span>
//               </div>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={log.energyLevel}
//                 onChange={(e) => setLog({ ...log, energyLevel: Number.parseInt(e.target.value) })}
//                 className="w-full h-2 bg-muted rounded-lg accent-primary cursor-pointer"
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium">Hunger Level</label>
//                 <span className="text-sm font-semibold text-secondary">{log.hungerLevel}/10</span>
//               </div>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={log.hungerLevel}
//                 onChange={(e) => setLog({ ...log, hungerLevel: Number.parseInt(e.target.value) })}
//                 className="w-full h-2 bg-muted rounded-lg accent-secondary cursor-pointer"
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium">Meal Adherence</label>
//                 <span className="text-sm font-semibold text-primary">{log.mealAdherence}%</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 step="10"
//                 value={log.mealAdherence}
//                 onChange={(e) => setLog({ ...log, mealAdherence: Number.parseInt(e.target.value) })}
//                 className="w-full h-2 bg-muted rounded-lg accent-primary cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>

//         <Button
//           onClick={handleSave}
//           className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 font-medium"
//         >
//           Save Progress
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { FormInput } from "@/components/ui/form-inputs"
import { saveDailyProgress, getTodayProgress } from "@/lib/api"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"

export function TodayProgress() {
  const addDailyLog = useAppStore((state) => state.addDailyLog)
  const getDailyLog = useAppStore((state) => state.getDailyLog)

  const today = new Date().toISOString().split("T")[0]
  const todayLogFromStore = getDailyLog(today)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState(
    todayLogFromStore || {
      date: today,
      workoutCompleted: false,
      mealAdherence: 100,
      energyLevel: 7,
      hungerLevel: 5,
      stepsCount: 0,
      waterConsumed: 0,
      sleepHours: 0,
      stressLevel: "medium",
      mood: "motivated",
    }
  )

  useEffect(() => {
    async function checkTodayProgress() {
      try {
        const result = await getTodayProgress()
        if (result.exists) {
          setIsSubmitted(true)
          // Optionally populate the form with existing data
          if (result.data) {
            setLog({
              date: result.data.date,
              workoutCompleted: result.data.workout_completed,
              mealAdherence: result.data.meal_adherence,
              energyLevel: result.data.energy_level,
              hungerLevel: result.data.hunger_level,
              stepsCount: result.data.steps_count,
              waterConsumed: result.data.water_consumed,
              sleepHours: result.data.sleep_hours,
              stressLevel: result.data.stress_level || "medium",
              mood: result.data.mood || "motivated",
            })
          }
        }
      } catch (err) {
        console.error("Error checking today's progress:", err)
      } finally {
        setLoading(false)
      }
    }
    checkTodayProgress()
  }, [])

  const handleSave = async () => {
    try {
      await saveDailyProgress(log)
      setIsSubmitted(true)
      toast.success("Progress saved successfully!")
      // Since the user asked for a "pop up", the toast might be enough, 
      // but let's make it very clear.
    } catch (err: any) {
      toast.error(err.message || "Failed to save progress")
    }
  }

  if (loading) {
    return (
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-400">Loading Today's Progress...</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="border-2 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 className="w-24 h-24 text-emerald-500" />
        </div>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            Today's Progress Logged
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-black/40 border border-emerald-100 dark:border-emerald-900/50 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              You've already completed your daily log for today! Great job staying consistent.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{log.stepsCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-700/60 dark:text-emerald-300/60 font-bold">Steps</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{log.waterConsumed}L</p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-700/60 dark:text-emerald-300/60 font-bold">Water</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground italic">
              Come back tomorrow to log your next session.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Today's Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={log.workoutCompleted}
                onChange={(e) =>
                  setLog({ ...log, workoutCompleted: e.target.checked })
                }
                className="w-5 h-5 rounded border-border/50"
              />
              <span className="text-sm font-medium">Workout Completed</span>
            </label>

            <FormInput
              label="Steps"
              type="number"
              value={Number.isFinite(log.stepsCount) ? log.stepsCount : 0}
              onChange={(e) =>
                setLog({
                  ...log,
                  stepsCount:
                    e.target.value === ""
                      ? 0
                      : Number.parseInt(e.target.value, 10),
                })
              }
            />

            <FormInput
              label="Water Intake (liters)"
              type="number"
              step="0.25"
              value={Number.isFinite(log.waterConsumed) ? log.waterConsumed : 0}
              onChange={(e) =>
                setLog({
                  ...log,
                  waterConsumed:
                    e.target.value === ""
                      ? 0
                      : Number.parseFloat(e.target.value),
                })
              }
            />

            <FormInput
              label="Sleep (hours)"
              type="number"
              step="0.5"
              value={Number.isFinite(log.sleepHours) ? log.sleepHours : 0}
              onChange={(e) =>
                setLog({
                  ...log,
                  sleepHours:
                    e.target.value === ""
                      ? 0
                      : Number.parseFloat(e.target.value),
                })
              }
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* ENERGY */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Energy Level</label>
                <span className="text-sm font-semibold">
                  {log.energyLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={log.energyLevel}
                onChange={(e) =>
                  setLog({
                    ...log,
                    energyLevel: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* HUNGER */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Hunger Level</label>
                <span className="text-sm font-semibold">
                  {log.hungerLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={log.hungerLevel}
                onChange={(e) =>
                  setLog({
                    ...log,
                    hungerLevel: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            {/* MEAL ADHERENCE */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Meal Adherence</label>
                <span className="text-sm font-semibold">
                  {log.mealAdherence}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={log.mealAdherence}
                onChange={(e) =>
                  setLog({
                    ...log,
                    mealAdherence: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Save Progress
        </Button>
      </CardContent>
    </Card>
  )
}
