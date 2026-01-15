"use client"

import type React from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
    </div>
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string; label: string }>
}

export function FormSelect({ label, options, ...props }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <select
        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FormMultiSelectProps {
  label: string
  selected: string[]
  onChange: (selected: string[]) => void
  options: Array<{ value: string; label: string }>
}

export function FormMultiSelect({ label, selected, onChange, options }: FormMultiSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selected, opt.value])
                } else {
                  onChange(selected.filter((v) => v !== opt.value))
                }
              }}
              className="rounded border-border"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
