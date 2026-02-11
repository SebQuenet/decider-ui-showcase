import { useCallback } from 'react'

import { useLocalStorage } from './useLocalStorage.ts'

interface UseSidebarReturn {
  isCollapsed: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

export function useSidebar(): UseSidebarReturn {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    'sidebar-collapsed',
    false,
  )

  const toggle = useCallback((): void => {
    setIsCollapsed((previous) => !previous)
  }, [setIsCollapsed])

  const open = useCallback((): void => {
    setIsCollapsed(false)
  }, [setIsCollapsed])

  const close = useCallback((): void => {
    setIsCollapsed(true)
  }, [setIsCollapsed])

  return { isCollapsed, toggle, open, close }
}
