import { X } from 'lucide-react'

type ChipVariant = 'default' | 'active'

interface ChipProps {
  label: string
  variant?: ChipVariant
  removable?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

const variantClasses: Record<ChipVariant, string> = {
  default: 'bg-surface-secondary text-text-secondary border-border hover:bg-surface-tertiary',
  active: 'bg-accent-muted text-accent-strong border-accent/30 hover:bg-glacier-200',
}

export function Chip({
  label,
  variant = 'default',
  removable = false,
  onClick,
  onRemove,
  className = '',
}: ChipProps) {
  return (
    <span
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-small font-medium transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${variantClasses[variant]} ${className}`}
    >
      {label}
      {removable && onRemove && (
        <button
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          className="inline-flex items-center justify-center rounded-full h-4 w-4 hover:bg-carbon-950/10 transition-colors cursor-pointer"
          aria-label={`Retirer ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
