import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

type IconButtonVariant = 'ghost' | 'subtle'
type IconButtonSize = 'sm' | 'md'

interface IconButtonProps {
  variant?: IconButtonVariant
  size?: IconButtonSize
  icon: ReactNode
  label: string
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
  subtle: 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 [&_svg]:h-4 [&_svg]:w-4',
  md: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  icon,
  label,
  disabled,
  onClick,
  className = '',
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
    </motion.button>
  )
}
