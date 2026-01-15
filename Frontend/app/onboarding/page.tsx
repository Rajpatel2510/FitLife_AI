"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StepBasicInfo } from "@/components/onboarding/step-basic-info"
import { StepFitnessProfile } from "@/components/onboarding/step-fitness-profile"
import { StepDietProfile } from "@/components/onboarding/step-diet-profile"
import { StepWorkoutSetup } from "@/components/onboarding/step-workout-setup"
import { StepLifestyleOptional } from "@/components/onboarding/step-lifestyle-optional"
import { generatePlans } from "@/lib/plan-generator"
import { createUser, createUserProfile, login, fetchUserData } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = "basic" | "fitness" | "diet" | "workout" | "lifestyle"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setUserProfile = useAppStore((state) => state.setUserProfile)
  const setIsOnboarded = useAppStore((state) => state.setIsOnboarded)
  const setWorkoutPlan = useAppStore((state) => state.setWorkoutPlan)
  const setMealPlan = useAppStore((state) => state.setMealPlan)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: 25,
    gender: "male",
    height_cm: 180,
    weight_kg: 80,
    fitness_goal: "weight_loss",
    fitness_level: "intermediate",
    activity_level: "moderate",
    body_type: "mesomorph",
    diet_type: "non_veg",
    allergies_restrictions: [] as string[],
    food_dislikes: [] as string[],
    place_of_workout: "gym",
    available_equipment: [] as string[],
    injury_pain_conditions: [] as string[],
    sleep_duration_hours: 7,
    water_intake_liters: 2,
    steps_per_day: 5000,
    stress_level: "medium",
  })

  const steps: Array<{ id: Step; label: string }> = [
    { id: "basic", label: "Basic Info" },
    { id: "fitness", label: "Fitness" },
    { id: "diet", label: "Diet" },
    { id: "workout", label: "Workout Setup" },
    { id: "lifestyle", label: "Lifestyle" },
  ]

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleLogin = async () => {
    try {
      const loginResponse = await login(loginData)
      // loginResponse returns { access_token, token_type, message } 
      if (loginResponse.access_token) {
        const { setAuthToken } = await import("@/lib/api")
        setAuthToken(loginResponse.access_token)
      }

      const userDataResponse = await fetchUserData(loginResponse.access_token)
      // userDataResponse returns { user: {...}, profile: {...} }

      if (userDataResponse.profile) {
        setUserProfile(userDataResponse.profile)
        setIsOnboarded(true)

        if (userDataResponse.workout_plan) {
          setWorkoutPlan(userDataResponse.workout_plan)
        } else {
          // Fallback only if backend didn't provide one
          const plans = await generatePlans(userDataResponse.profile, loginResponse.access_token)
          setWorkoutPlan(plans.workout)
          setMealPlan(plans.meal)
        }

        toast.success(`Welcome back, ${userDataResponse.user.name}!`)
        router.push("/dashboard")
      } else {
        toast.error("Profile not found. Please complete onboarding.")
        setIsLoginOpen(false)
        if (userDataResponse.user) {
          setFormData(prev => ({ ...prev, name: userDataResponse.user.name, email: userDataResponse.user.email }))
        }
      }

    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed")
    }
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      // 1. Calculate fitness metrics
      const bmi = formData.weight_kg / (formData.height_cm / 100) ** 2
      const bmr =
        10 * formData.weight_kg + 6.25 * formData.height_cm - 5 * formData.age + (formData.gender === "male" ? 5 : -161)

      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderate: 1.55,
        very_active: 1.725,
        extremely_active: 1.9,
      }
      const tdee = bmr * (activityMultipliers[formData.activity_level] || 1.55)

      const profileData = {
        ...formData,
        bmi,
        bmr,
        tdee,
      }

      // 1. Create user first
      console.log("Creating user...")
      // 1️⃣ Create user
      const userResponse = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!userResponse?.user?.id) {
        throw new Error("Failed to create user");
      }

      // 2️⃣ LOGIN FIRST (GET TOKEN)
      const loginRes = await login({
        email: formData.email,
        password: formData.password,
      });

      // token is already saved by login()
      const token = loginRes.access_token;

      // 3️⃣ Create user profile (NOW AUTHORIZED)
      const userProfileResponse = await createUserProfile(userResponse.user.id, {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        weight_value: formData.weight_kg,
        weight_unit: "kg",
        height_unit: "cm",
        height_cm: formData.height_cm,
        height_ft: 0,
        height_in: 0,
        fitness_goal: formData.fitness_goal,
        fitness_level: formData.fitness_level,
        activity_level: formData.activity_level,
        body_type: formData.body_type,
        diet_type: formData.diet_type,
        allergies_restrictions: formData.allergies_restrictions,
        food_dislikes: formData.food_dislikes,
        place_of_workout: formData.place_of_workout,
        available_equipment: formData.available_equipment,
        injury_pain_conditions: formData.injury_pain_conditions,
        sleep_duration_hours: formData.sleep_duration_hours,
        water_intake_liters: formData.water_intake_liters,
        steps_per_day: formData.steps_per_day,
        stress_level: formData.stress_level,
      });
      
      // 4. Generate plans with token
      console.log("Generating plans with token...")
      const plans = await generatePlans({ ...profileData, user_id: userResponse.user.id } as any, token)
      console.log("Plans generated:", plans)

      // 5. Update local state
      setUserProfile(profileData)
      setWorkoutPlan(plans.workout)
      setMealPlan(plans.meal)
      setIsOnboarded(true)

      console.log("Onboarding complete, redirecting...")
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Onboarding error:", error)
      let msg = "Something went wrong during onboarding"
      if (error.message.includes("Failed to generate plan")) msg = "AI Plan Generation failed, but your profile was saved."
      else if (error.message.includes("Failed to create user profile")) msg = "User created, but profile saving failed."
      else if (error.message.includes("Email already registered")) msg = "This email is already registered. Please try logging in."

      toast.error(error.message || msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = (updates: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex gap-2 mb-6">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-colors ${idx <= currentStepIndex ? "bg-primary" : "bg-border"
                      }`}
                  />
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-bold">{steps.find((s) => s.id === currentStep)?.label}</h1>
            <p className="text-muted-foreground mt-2">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>

          {currentStep === "basic" && (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Already have an account? Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login to specific account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="john@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button className="w-full" onClick={handleLogin}>Log In</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="p-8 mb-8">
          {currentStep === "basic" && <StepBasicInfo data={formData} onUpdate={handleUpdate} />}
          {currentStep === "fitness" && <StepFitnessProfile data={formData} onUpdate={handleUpdate} />}
          {currentStep === "diet" && <StepDietProfile data={formData} onUpdate={handleUpdate} />}
          {currentStep === "workout" && <StepWorkoutSetup data={formData} onUpdate={handleUpdate} />}
          {currentStep === "lifestyle" && <StepLifestyleOptional data={formData} onUpdate={handleUpdate} />}
        </Card>

        <div className="flex gap-4 justify-between">
          <Button onClick={handlePrev} disabled={currentStepIndex === 0} variant="outline">
            Previous
          </Button>
          <Button
            onClick={currentStep === "lifestyle" ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === "lifestyle" ? (isSubmitting ? "Processing..." : "Complete Setup") : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
