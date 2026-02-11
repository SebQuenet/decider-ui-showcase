import { useState, useCallback, type ReactNode } from 'react'

interface UsePanelReturn {
  isOpen: boolean
  title: string
  content: ReactNode
  open: (title: string, content: ReactNode) => void
  close: () => void
  toggle: () => void
}

export function usePanel(): UsePanelReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<ReactNode>(null)

  const open = useCallback((panelTitle: string, panelContent: ReactNode): void => {
    setTitle(panelTitle)
    setContent(panelContent)
    setIsOpen(true)
  }, [])

  const close = useCallback((): void => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback((): void => {
    setIsOpen((previous) => !previous)
  }, [])

  return { isOpen, title, content, open, close, toggle }
}
