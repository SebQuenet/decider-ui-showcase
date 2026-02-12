import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { TabView } from '../types/navigation'

interface TabGroup {
  id: string
  label: string
  tabs: TabView[]
}

interface TabNavigationProps {
  tabs: TabView[]
  activeTabId: string
  onTabChange: (tabId: string) => void
}

const GROUP_ORDER = ['chat', 'contenu', 'analyse', 'finance', 'attribution', 'plateforme']

const GROUP_LABELS: Record<string, string> = {
  chat: 'Chat',
  contenu: 'Contenu',
  analyse: 'Analyse',
  finance: 'Finance',
  attribution: 'Attribution',
  plateforme: 'Plateforme',
}

function groupTabs(tabs: TabView[]): TabGroup[] {
  const groups: Record<string, TabView[]> = {}
  for (const tab of tabs) {
    const group = tab.group || 'chat'
    if (!groups[group]) groups[group] = []
    groups[group].push(tab)
  }

  return GROUP_ORDER
    .filter((id) => groups[id]?.length > 0)
    .map((id) => ({ id, label: GROUP_LABELS[id] || id, tabs: groups[id] }))
}

export function TabNavigation({ tabs, activeTabId, onTabChange }: TabNavigationProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const groups = groupTabs(tabs)
  const hasGroups = groups.length > 1

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!hasGroups) {
    return <FlatTabs tabs={tabs} activeTabId={activeTabId} onTabChange={onTabChange} />
  }

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const activeGroup = groups.find((g) => g.tabs.some((t) => t.id === activeTabId))

  return (
    <nav
      ref={navRef}
      className="flex items-center gap-1 bg-surface/60 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-border-muted"
    >
      {groups.map((group) => {
        const isGroupActive = activeGroup?.id === group.id
        const isOpen = openGroup === group.id

        return (
          <div key={group.id} className="relative">
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isGroupActive
                  ? 'text-text-primary bg-surface shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span>{group.label}</span>
              {isGroupActive && activeTab && (
                <span className="text-accent text-xs">· {activeTab.label}</span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 z-50 min-w-[200px] max-h-[400px] overflow-y-auto scrollbar-thin bg-surface rounded-lg shadow-lg border border-border p-1"
                >
                  {group.tabs.map((tab) => {
                    const isActive = tab.id === activeTabId
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onTabChange(tab.id)
                          setOpenGroup(null)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-accent-muted text-accent-strong font-medium'
                            : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}

function FlatTabs({
  tabs,
  activeTabId,
  onTabChange,
}: {
  tabs: TabView[]
  activeTabId: string
  onTabChange: (tabId: string) => void
}) {
  return (
    <nav className="flex gap-1 bg-surface/60 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-border-muted overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-surface rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
