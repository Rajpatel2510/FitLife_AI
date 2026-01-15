"use client"

import { FormSelect, FormMultiSelect } from "@/components/ui/form-inputs"

export function StepWorkoutSetup({ data, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <FormSelect
        label="Place of Workout"
        value={data.place_of_workout || ""}
        onChange={(e) => onUpdate({ place_of_workout: e.target.value })}
        options={[
          { value: "gym", label: "Gym" },
          { value: "home", label: "Home" },
          { value: "outdoor", label: "Outdoor" },
        ]}
      />

      <FormMultiSelect
        label="Available Equipment"
        selected={data.available_equipment}
        onChange={(selected) => onUpdate({ available_equipment: selected })}
        options={[
          { value: "dumbbells", label: "Dumbbells" },
          { value: "barbell", label: "Barbell" },
          { value: "resistance_bands", label: "Resistance Bands" },
          { value: "kettlebell", label: "Kettlebell" },
          { value: "treadmill", label: "Treadmill" },
          { value: "stationary_bike", label: "Stationary Bike" },
        ]}
      />

      <FormMultiSelect
        label="Injury or Pain Conditions"
        selected={data.injury_pain_conditions}
        onChange={(selected) => onUpdate({ injury_pain_conditions: selected })}
        options={[
          { value: "lower_back_pain", label: "Lower Back Pain" },
          { value: "knee_pain", label: "Knee Pain" },
          { value: "shoulder_pain", label: "Shoulder Pain" },
          { value: "wrist_pain", label: "Wrist Pain" },
          { value: "none", label: "No Injuries" },
        ]}
      />
    </div>
  )
}
