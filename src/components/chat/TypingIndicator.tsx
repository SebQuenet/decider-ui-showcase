import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { typingDotVariants } from '../../lib/animations'

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-surface-tertiary text-text-secondary">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-surface-tertiary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            variants={typingDotVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: index * 0.15,
            }}
            className="block w-2 h-2 bg-text-muted rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
