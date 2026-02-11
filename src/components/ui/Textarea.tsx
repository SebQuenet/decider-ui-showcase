import { type TextareaHTMLAttributes, useId, useRef, useCallback, useEffect } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoExpand?: boolean
  maxHeight?: number
}

export function Textarea({
  label,
  error,
  autoExpand = true,
  maxHeight = 200,
  className = '',
  id: externalId,
  value,
  onChange,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = externalId ?? generatedId
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea || !autoExpand) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [autoExpand, maxHeight])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-caption font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={textareaId}
        value={value}
        onChange={onChange}
        rows={2}
        className={`rounded-md border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-muted transition-colors outline-none resize-none focus:ring-2 focus:ring-accent/40 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
