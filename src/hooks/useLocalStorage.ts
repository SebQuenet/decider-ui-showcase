import { useState, useCallback } from 'react'

function readStoredValue<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item !== null ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readStoredValue(key, defaultValue),
  )

  const setValue = useCallback(
    (value: T | ((previous: T) => T)): void => {
      setStoredValue((previous) => {
        const nextValue =
          value instanceof Function ? value(previous) : value
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // Quota exceeded, silently ignore
        }
        return nextValue
      })
    },
    [key],
  )

  return [storedValue, setValue]
}
