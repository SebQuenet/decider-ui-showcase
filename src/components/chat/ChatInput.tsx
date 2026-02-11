import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { fadeInUp } from '../../lib/animations'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
  actions?: React.ReactNode
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Écrivez un message...',
  actions,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="border-t border-border bg-surface p-4"
    >
      {actions && <div className="flex gap-2 mb-2 max-w-3xl mx-auto">{actions}</div>}
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-text-muted"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-accent p-3 text-text-inverse
            hover:bg-accent-hover transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
