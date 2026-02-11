import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}: ToggleProps) {
  return (
    <label
      className={`inline-flex items-center gap-2.5 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed ${
          checked ? 'bg-accent' : 'bg-carbon-300'
        }`}
      >
        <motion.span
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="block h-4.5 w-4.5 rounded-full bg-white shadow-sm"
        />
      </button>
      {label && <span className="text-caption text-text-primary">{label}</span>}
    </label>
  )
}
