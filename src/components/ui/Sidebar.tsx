import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { IconButton } from './IconButton.tsx'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
  width?: number
  collapsedWidth?: number
  className?: string
}

export function Sidebar({
  collapsed,
  onToggle,
  children,
  width = 260,
  collapsedWidth = 56,
  className = '',
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? collapsedWidth : width }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex flex-col h-full bg-surface border-r border-border overflow-hidden shrink-0 ${className}`}
    >
      <div className={`flex items-center p-2 ${collapsed ? 'justify-center' : 'justify-end'}`}>
        <IconButton
          icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          label={collapsed ? 'Ouvrir le panneau' : 'Fermer le panneau'}
          size="sm"
          onClick={onToggle}
        />
      </div>
      <motion.div
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={{ duration: collapsed ? 0.1 : 0.2, delay: collapsed ? 0 : 0.1 }}
        className={`flex-1 overflow-y-auto ${collapsed ? 'pointer-events-none' : ''}`}
      >
        {children}
      </motion.div>
    </motion.aside>
  )
}
