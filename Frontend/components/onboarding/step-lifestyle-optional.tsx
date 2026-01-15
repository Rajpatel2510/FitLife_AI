"use client"

import { FormInput, FormSelect } from "@/components/ui/form-inputs"

export function StepLifestyleOptional({ data, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <FormInput
        label="Sleep Duration (hours)"
        type="number"
        value={data.sleep_duration_hours || ""}
        onChange={(e) => onUpdate({ sleep_duration_hours: Number.parseFloat(e.target.value) || 0 })}
        step="0.5"
        min="0"
        max="12"
      />

      <FormInput
        label="Water Intake (liters per day)"
        type="number"
        value={data.water_intake_liters || ""}
        onChange={(e) => onUpdate({ water_intake_liters: Number.parseFloat(e.target.value) || 0 })}
        step="0.5"
      />

      <FormInput
        label="Steps Per Day"
        type="number"
        value={data.steps_per_day || ""}
        onChange={(e) => onUpdate({ steps_per_day: Number.parseInt(e.target.value) || 0 })}
      />

      <FormSelect
        label="Stress Level"
        value={data.stress_level || ""}
        onChange={(e) => onUpdate({ stress_level: e.target.value })}
        options={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
      />
    </div>
  )
}
