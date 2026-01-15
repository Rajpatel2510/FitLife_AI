"use client"

import { FormSelect, FormMultiSelect } from "@/components/ui/form-inputs"

export function StepDietProfile({ data, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <FormSelect
        label="Diet Type"
        value={data.diet_type || ""}
        onChange={(e) => onUpdate({ diet_type: e.target.value })}
        options={[
          { value: "veg", label: "Vegetarian" },
          { value: "non_veg", label: "Non-Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "keto", label: "Keto" },
          { value: "high_protein", label: "High Protein" },
        ]}
      />

      <FormMultiSelect
        label="Allergies & Restrictions"
        selected={data.allergies_restrictions}
        onChange={(selected) => onUpdate({ allergies_restrictions: selected })}
        options={[
          { value: "dairy", label: "Dairy" },
          { value: "gluten", label: "Gluten" },
          { value: "nuts", label: "Nuts" },
          { value: "soy", label: "Soy" },
          { value: "shellfish", label: "Shellfish" },
        ]}
      />

      <FormMultiSelect
        label="Food Dislikes"
        selected={data.food_dislikes}
        onChange={(selected) => onUpdate({ food_dislikes: selected })}
        options={[
          { value: "broccoli", label: "Broccoli" },
          { value: "mushrooms", label: "Mushrooms" },
          { value: "seafood", label: "Seafood" },
          { value: "spicy", label: "Spicy Foods" },
          { value: "onions", label: "Onions" },
        ]}
      />
    </div>
  )
}
