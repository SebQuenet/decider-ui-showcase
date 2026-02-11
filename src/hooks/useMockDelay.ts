import { useState, useCallback } from 'react'

interface UseMockDelayReturn {
  execute: <T>(callback: () => T) => Promise<T>
  isLoading: boolean
}

export function useMockDelay(minMs = 800, maxMs = 2000): UseMockDelayReturn {
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    <T>(callback: () => T): Promise<T> => {
      setIsLoading(true)
      const delay = Math.random() * (maxMs - minMs) + minMs

      return new Promise<T>((resolve) => {
        setTimeout(() => {
          const result = callback()
          setIsLoading(false)
          resolve(result)
        }, delay)
      })
    },
    [minMs, maxMs],
  )

  return { execute, isLoading }
}
