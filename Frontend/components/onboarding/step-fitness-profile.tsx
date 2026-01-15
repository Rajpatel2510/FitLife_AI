"use client"

import { FormSelect } from "@/components/ui/form-inputs"

export function StepFitnessProfile({ data, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <FormSelect
        label="Fitness Goal"
        value={data.fitness_goal || ""}
        onChange={(e) => onUpdate({ fitness_goal: e.target.value })}
        options={[
          { value: "weight_loss", label: "Weight Loss" },
          { value: "weight_gain", label: "Weight Gain" },
          { value: "maintenance", label: "Maintenance" },
        ]}
      />

      <FormSelect
        label="Fitness Level"
        value={data.fitness_level || ""}
        onChange={(e) => onUpdate({ fitness_level: e.target.value })}
        options={[
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ]}
      />

      <FormSelect
        label="Activity Level"
        value={data.activity_level || ""}
        onChange={(e) => onUpdate({ activity_level: e.target.value })}
        options={[
          { value: "sedentary", label: "Sedentary" },
          { value: "lightly_active", label: "Lightly Active" },
          { value: "moderate", label: "Moderate" },
          { value: "very_active", label: "Very Active" },
          { value: "extremely_active", label: "Extremely Active" },
        ]}
      />

      <FormSelect
        label="Body Type"
        value={data.body_type || ""}
        onChange={(e) => onUpdate({ body_type: e.target.value })}
        options={[
          { value: "ectomorph", label: "Ectomorph (Slim)" },
          { value: "mesomorph", label: "Mesomorph (Athletic)" },
          { value: "endomorph", label: "Endomorph (Rounded)" },
        ]}
      />
    </div>
  )
}
