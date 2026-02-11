import { type InputHTMLAttributes, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id: externalId,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = externalId ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-caption font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-md border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-muted transition-colors outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-small text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  )
}
