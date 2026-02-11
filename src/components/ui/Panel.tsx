import { type ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { IconButton } from './IconButton.tsx'

interface PanelProps {
  open: boolean
  onClose: () => void
  title: string
  width?: number
  children: ReactNode
  className?: string
}

export function Panel({
  open,
  onClose,
  title,
  width = 400,
  children,
  className = '',
}: PanelProps) {
  useEffect(() => {
    if (!open) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-carbon-950/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width }}
            className={`relative z-10 flex flex-col h-full bg-surface border-l border-border shadow-xl ${className}`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-h4 font-semibold text-text-primary">{title}</h2>
              <IconButton icon={<X />} label="Fermer" size="sm" onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
