import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  layoutId?: string
  className?: string
}

export function Tabs({
  tabs,
  activeTabId,
  onTabChange,
  layoutId = 'tab-indicator',
  className = '',
}: TabsProps) {
  return (
    <div className={`flex border-b border-border ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2.5 text-caption font-medium transition-colors cursor-pointer ${
              isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-x-0 bottom-0 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
