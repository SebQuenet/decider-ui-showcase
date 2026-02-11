import { type ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  return (
    <div className={`relative group inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-surface-inverse px-2.5 py-1.5 text-small text-text-inverse opacity-0 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100"
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-inverse" />
      </span>
    </div>
  )
}
