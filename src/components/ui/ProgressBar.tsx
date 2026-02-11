import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.round(Math.min(100, Math.max(0, (value / max) * 100)))

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 rounded-full bg-surface-tertiary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="h-full rounded-full bg-accent"
        />
      </div>
      {showLabel && (
        <span className="text-small font-medium text-text-secondary tabular-nums min-w-[3ch] text-right">
          {percentage}%
        </span>
      )}
    </div>
  )
}
