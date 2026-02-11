import { useRef, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Message } from '../../types/chat'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'

interface ChatContainerProps {
  messages: Message[]
  isTyping?: boolean
  onSend: (content: string) => void
  onStreamComplete?: (messageId: string) => void
  inputPlaceholder?: string
  inputActions?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export function ChatContainer({
  messages,
  isTyping = false,
  onSend,
  onStreamComplete,
  inputPlaceholder,
  inputActions,
  header,
  className = '',
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isUserNearBottomRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    if (isUserNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const threshold = 100
    isUserNearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  return (
    <div className={`flex flex-col h-full bg-surface rounded-2xl shadow-lg overflow-hidden border border-border ${className}`}>
      {header}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onStreamComplete={
                onStreamComplete ? () => onStreamComplete(message.id) : undefined
              }
            />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={onSend}
        disabled={isTyping}
        placeholder={inputPlaceholder}
        actions={inputActions}
      />
    </div>
  )
}
