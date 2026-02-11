import { useState, useRef, useCallback } from 'react'

interface UseSimulatedStreamReturn {
  displayedText: string
  isStreaming: boolean
  start: (text: string) => void
  stop: () => void
  reset: () => void
}

export function useSimulatedStream(
  charactersPerSecond = 80,
): UseSimulatedStreamReturn {
  const [displayedText, setDisplayedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const fullTextRef = useRef('')
  const charIndexRef = useRef(0)
  const lastTimestampRef = useRef<number | null>(null)

  const cancelAnimation = useCallback((): void => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    lastTimestampRef.current = null
  }, [])

  const tick = useCallback(
    (timestamp: number): void => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }

      const elapsed = timestamp - lastTimestampRef.current
      const msPerChar = 1000 / charactersPerSecond
      const charsToAdd = Math.floor(elapsed / msPerChar)

      if (charsToAdd > 0) {
        lastTimestampRef.current = timestamp
        const nextIndex = Math.min(
          charIndexRef.current + charsToAdd,
          fullTextRef.current.length,
        )
        charIndexRef.current = nextIndex
        setDisplayedText(fullTextRef.current.slice(0, nextIndex))

        if (nextIndex >= fullTextRef.current.length) {
          setIsStreaming(false)
          cancelAnimation()
          return
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick)
    },
    [charactersPerSecond, cancelAnimation],
  )

  const start = useCallback(
    (text: string): void => {
      cancelAnimation()
      fullTextRef.current = text
      charIndexRef.current = 0
      setDisplayedText('')
      setIsStreaming(true)
      animationFrameRef.current = requestAnimationFrame(tick)
    },
    [tick, cancelAnimation],
  )

  const stop = useCallback((): void => {
    cancelAnimation()
    setIsStreaming(false)
    setDisplayedText(fullTextRef.current)
  }, [cancelAnimation])

  const reset = useCallback((): void => {
    cancelAnimation()
    fullTextRef.current = ''
    charIndexRef.current = 0
    setDisplayedText('')
    setIsStreaming(false)
  }, [cancelAnimation])

  return { displayedText, isStreaming, start, stop, reset }
}
