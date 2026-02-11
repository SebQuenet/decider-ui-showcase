import { type SelectHTMLAttributes, useId } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  id: externalId,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = externalId ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-caption font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-md border bg-surface pl-3 pr-9 py-2 text-body text-text-primary transition-colors outline-none cursor-pointer focus:ring-2 focus:ring-accent/40 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
