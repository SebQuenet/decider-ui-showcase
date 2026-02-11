import { type ReactNode } from 'react'

interface CardProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ header, footer, children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-lg shadow-sm ${className}`}>
      {header && (
        <div className="px-4 py-3 border-b border-border">{header}</div>
      )}
      <div className="px-4 py-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-border">{footer}</div>
      )}
    </div>
  )
}
