import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Spinner } from './Spinner.tsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children: ReactNode
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-text-inverse hover:bg-accent-hover',
  secondary: 'border border-border text-text-primary hover:bg-surface-secondary',
  ghost: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
  danger: 'bg-danger text-text-inverse hover:bg-red-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-small rounded-sm gap-1.5',
  md: 'px-4 py-2 text-caption rounded-md gap-2',
  lg: 'px-6 py-3 text-body rounded-lg gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <Spinner size={size === 'lg' ? 'md' : 'sm'} />}
      {children}
    </motion.button>
  )
}
