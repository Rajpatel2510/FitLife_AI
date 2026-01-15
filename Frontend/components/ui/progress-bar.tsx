interface ProgressBarProps {
  value: number
  max?: number
}

export function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-primary to-secondary h-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
