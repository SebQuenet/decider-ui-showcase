import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import type { Message } from '../../types/chat'
import { messageVariants } from '../../lib/animations'
import { StreamingText } from './StreamingText'

interface MessageBubbleProps {
  message: Message
  onStreamComplete?: () => void
}

export function MessageBubble({ message, onStreamComplete }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-glacier-600 text-white'
            : 'bg-surface-tertiary text-text-secondary'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-glacier-600 text-white rounded-br-md'
            : 'bg-surface-tertiary text-text-primary rounded-bl-md'
        }`}
      >
        <div className="text-body leading-relaxed whitespace-pre-wrap">
          {isStreaming ? (
            <StreamingText
              text={message.content}
              speed={80}
              onComplete={onStreamComplete}
            />
          ) : (
            message.content
          )}
        </div>

        <div
          className={`text-small mt-1.5 ${
            isUser ? 'text-white/60' : 'text-text-muted'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
