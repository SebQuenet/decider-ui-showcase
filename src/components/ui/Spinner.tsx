interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-3',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      className={`inline-block rounded-full border-current border-r-transparent animate-spin opacity-75 ${sizeClasses[size]} ${className}`}
    />
  )
}
