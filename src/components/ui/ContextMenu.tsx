import { type ReactNode, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ContextMenuItemVariant = 'default' | 'danger'

interface ContextMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: ContextMenuItemVariant
  disabled?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  position: { x: number; y: number } | null
  onClose: () => void
}

const itemVariantClasses: Record<ContextMenuItemVariant, string> = {
  default: 'text-text-primary hover:bg-surface-secondary',
  danger: 'text-danger hover:bg-danger-muted',
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!position) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [position, onClose])

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{ left: position.x, top: position.y }}
          className="fixed z-50 min-w-[160px] rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              disabled={item.disabled}
              onClick={() => {
                item.onClick()
                onClose()
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-caption transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                itemVariantClasses[item.variant ?? 'default']
              }`}
            >
              {item.icon && <span className="[&_svg]:h-4 [&_svg]:w-4 shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
