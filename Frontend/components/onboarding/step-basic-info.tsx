"use client"

import { FormInput, FormSelect } from "@/components/ui/form-inputs"

export function StepBasicInfo({ data, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <FormInput
        label="Full Name"
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="John Doe"
      />

      <FormInput
        label="Email"
        type="email"
        value={data.email || ""}
        onChange={(e) => onUpdate({ email: e.target.value })}
        placeholder="john@example.com"
      />

      <FormInput
        label="Password"
        type="password"
        value={data.password || ""}
        onChange={(e) => onUpdate({ password: e.target.value })}
        placeholder="••••••••"
      />

      <FormInput
        label="Age"
        type="number"
        value={data.age || ""}
        onChange={(e) => onUpdate({ age: Number.parseInt(e.target.value) || 0 })}
        min="13"
        max="120"
      />

      <FormSelect
        label="Gender"
        value={data.gender || ""}
        onChange={(e) => onUpdate({ gender: e.target.value })}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
      />

      <FormInput
        label="Height (cm)"
        type="number"
        value={data.height_cm || ""}
        onChange={(e) => onUpdate({ height_cm: Number.parseFloat(e.target.value) || 0 })}
      />

      <FormInput
        label="Weight (kg)"
        type="number"
        value={data.weight_kg || ""}
        onChange={(e) => onUpdate({ weight_kg: Number.parseFloat(e.target.value) || 0 })}
      />
    </div>
  )
}
