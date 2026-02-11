import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export function StreamingText({ text, speed = 80, onComplete, className = '' }: StreamingTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const completedRef = useRef(false)

  useEffect(() => {
    setDisplayedLength(0)
    completedRef.current = false
    const msPerChar = 1000 / speed

    function animate(timestamp: number) {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const elapsed = timestamp - lastTimeRef.current

      if (elapsed >= msPerChar) {
        const charsToAdd = Math.floor(elapsed / msPerChar)
        lastTimeRef.current = timestamp

        setDisplayedLength((previous) => {
          const next = Math.min(previous + charsToAdd, text.length)
          if (next >= text.length && !completedRef.current) {
            completedRef.current = true
            onComplete?.()
          }
          return next
        })
      }

      if (!completedRef.current) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      lastTimeRef.current = 0
    }
  }, [text, speed, onComplete])

  const displayedText = text.slice(0, displayedLength)
  const isComplete = displayedLength >= text.length

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-0.5 h-[1.1em] bg-current align-text-bottom ml-0.5"
        />
      )}
    </span>
  )
}
