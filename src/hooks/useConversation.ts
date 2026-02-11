import { useState, useCallback } from 'react'

import type { Message } from '../types/chat.ts'

interface UseConversationReturn {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message
  updateMessage: (id: string, updates: Partial<Message>) => void
  removeMessage: (id: string) => void
  isTyping: boolean
  setIsTyping: (value: boolean) => void
  clearMessages: () => void
}

let messageCounter = 0

function generateMessageId(): string {
  messageCounter += 1
  return `msg-${Date.now()}-${messageCounter}`
}

export function useConversation(
  initialMessages: Message[] = [],
): UseConversationReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)

  const addMessage = useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>): Message => {
      const newMessage: Message = {
        ...message,
        id: generateMessageId(),
        timestamp: new Date(),
      }
      setMessages((previous) => [...previous, newMessage])
      return newMessage
    },
    [],
  )

  const updateMessage = useCallback(
    (id: string, updates: Partial<Message>): void => {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === id ? { ...message, ...updates } : message,
        ),
      )
    },
    [],
  )

  const removeMessage = useCallback((id: string): void => {
    setMessages((previous) =>
      previous.filter((message) => message.id !== id),
    )
  }, [])

  const clearMessages = useCallback((): void => {
    setMessages([])
  }, [])

  return {
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    isTyping,
    setIsTyping,
    clearMessages,
  }
}
