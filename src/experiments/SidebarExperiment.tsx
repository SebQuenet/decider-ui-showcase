import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Archive,
  FolderOpen,
  FolderClosed,
  ChevronRight,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  X,
  CheckSquare,
  Square,
  Bot,
} from 'lucide-react'
import { IconButton } from '../components/ui/IconButton.tsx'
import { ContextMenu } from '../components/ui/ContextMenu.tsx'
import { Button } from '../components/ui/Button.tsx'
import type { Conversation, ConversationFolder } from '../types/chat.ts'

// --- Données mockées ---

function createMockConversations(): Conversation[] {
  const now = new Date()
  const hour = 3600000
  const day = 86400000

  return [
    { id: 'c1', title: 'Analyse portefeuille Q4', messages: [], createdAt: new Date(now.getTime() - 2 * hour), updatedAt: new Date(now.getTime() - 2 * hour), isPinned: true },
    { id: 'c2', title: 'Stratégie obligations 2025', messages: [], createdAt: new Date(now.getTime() - 4 * hour), updatedAt: new Date(now.getTime() - 4 * hour), isPinned: true },
    { id: 'c3', title: 'Revue des risques sectoriels', messages: [], createdAt: new Date(now.getTime() - 6 * hour), updatedAt: new Date(now.getTime() - 6 * hour) },
    { id: 'c4', title: 'Simulation Monte Carlo', messages: [], createdAt: new Date(now.getTime() - 8 * hour), updatedAt: new Date(now.getTime() - 8 * hour), folderId: 'folder-1' },
    { id: 'c5', title: 'Benchmark MSCI World', messages: [], createdAt: new Date(now.getTime() - 1 * day - 3 * hour), updatedAt: new Date(now.getTime() - 1 * day - 3 * hour) },
    { id: 'c6', title: 'Allocation tactique émergents', messages: [], createdAt: new Date(now.getTime() - 1 * day - 6 * hour), updatedAt: new Date(now.getTime() - 1 * day - 6 * hour) },
    { id: 'c7', title: 'Rapport ESG fonds durables', messages: [], createdAt: new Date(now.getTime() - 1 * day - 8 * hour), updatedAt: new Date(now.getTime() - 1 * day - 8 * hour), folderId: 'folder-1' },
    { id: 'c8', title: 'Due diligence Acme Corp', messages: [], createdAt: new Date(now.getTime() - 3 * day), updatedAt: new Date(now.getTime() - 3 * day), folderId: 'folder-2' },
    { id: 'c9', title: 'Valorisation DCF TechVenture', messages: [], createdAt: new Date(now.getTime() - 4 * day), updatedAt: new Date(now.getTime() - 4 * day), folderId: 'folder-2' },
    { id: 'c10', title: 'Stress test taux +200bp', messages: [], createdAt: new Date(now.getTime() - 5 * day), updatedAt: new Date(now.getTime() - 5 * day) },
    { id: 'c11', title: 'Comparaison ETF S&P 500', messages: [], createdAt: new Date(now.getTime() - 10 * day), updatedAt: new Date(now.getTime() - 10 * day) },
    { id: 'c12', title: 'Optimisation fiscale PEA', messages: [], createdAt: new Date(now.getTime() - 15 * day), updatedAt: new Date(now.getTime() - 15 * day) },
    { id: 'c13', title: 'Analyse corrélation crypto/actions', messages: [], createdAt: new Date(now.getTime() - 20 * day), updatedAt: new Date(now.getTime() - 20 * day) },
    { id: 'c14', title: 'Recherche fonds small cap Europe', messages: [], createdAt: new Date(now.getTime() - 30 * day), updatedAt: new Date(now.getTime() - 30 * day) },
  ]
}

const INITIAL_FOLDERS: ConversationFolder[] = [
  { id: 'folder-1', name: 'Analyses Q4', conversationIds: ['c4', 'c7'], isExpanded: false },
  { id: 'folder-2', name: 'Due Diligence', conversationIds: ['c8', 'c9'], isExpanded: false },
]

const PREVIEW_TEXTS: Record<string, string> = {
  c1: "L'analyse montre une surperformance de 2.3% par rapport au benchmark...",
  c2: "Les obligations investment grade offrent actuellement un spread de...",
  c3: "Les secteurs les plus exposés au risque de taux sont...",
  c4: "Après 10 000 simulations, la VaR à 95% est estimée à...",
  c5: "Le tracking error par rapport au MSCI World est de 1.8%...",
  c6: "Les marchés émergents asiatiques présentent un potentiel de...",
  c7: "Le score ESG moyen du portefeuille est de 7.2/10...",
  c8: "Les fondamentaux d'Acme Corp montrent un CA en croissance de...",
  c9: "La valorisation DCF suggère un upside de 15% par rapport...",
  c10: "Un choc de +200bp sur les taux entraînerait une perte de...",
  c11: "L'ETF Vanguard S&P 500 présente le TER le plus bas à 0.07%...",
  c12: "Le plafond PEA de 150 000€ permet d'optimiser la fiscalité...",
  c13: "La corrélation BTC/S&P 500 sur 90 jours est de 0.42...",
  c14: "Les meilleurs fonds small cap Europe sur 3 ans sont...",
}

type DateGroup = 'pinned' | 'today' | 'yesterday' | 'last7days' | 'older'

function getDateGroup(date: Date): DateGroup {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000)
  const startOfLast7Days = new Date(startOfToday.getTime() - 7 * 86400000)

  if (date >= startOfToday) return 'today'
  if (date >= startOfYesterday) return 'yesterday'
  if (date >= startOfLast7Days) return 'last7days'
  return 'older'
}

const DATE_GROUP_LABELS: Record<DateGroup, string> = {
  pinned: 'Épinglés',
  today: "Aujourd'hui",
  yesterday: 'Hier',
  last7days: '7 derniers jours',
  older: 'Plus ancien',
}

export function SidebarExperiment() {
  const [conversations, setConversations] = useState<Conversation[]>(createMockConversations)
  const [folders, setFolders] = useState<ConversationFolder[]>(INITIAL_FOLDERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [contextMenuConversationId, setContextMenuConversationId] = useState<string | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        (PREVIEW_TEXTS[c.id] ?? '').toLowerCase().includes(query),
    )
  }, [conversations, searchQuery])

  // Grouper les conversations par date (hors dossiers et hors épinglés)
  const groupedConversations = useMemo(() => {
    const folderConversationIds = new Set(folders.flatMap((f) => f.conversationIds))

    const pinned = filteredConversations.filter((c) => c.isPinned && !c.isArchived)
    const unpinned = filteredConversations.filter(
      (c) => !c.isPinned && !c.isArchived && !folderConversationIds.has(c.id),
    )

    const groups: Record<DateGroup, Conversation[]> = {
      pinned,
      today: [],
      yesterday: [],
      last7days: [],
      older: [],
    }

    for (const conversation of unpinned) {
      const group = getDateGroup(conversation.updatedAt)
      groups[group].push(conversation)
    }

    return groups
  }, [filteredConversations, folders])

  const folderConversations = useMemo(() => {
    const map: Record<string, Conversation[]> = {}
    for (const folder of folders) {
      map[folder.id] = folder.conversationIds
        .map((id) => filteredConversations.find((c) => c.id === id))
        .filter((c): c is Conversation => c !== undefined)
    }
    return map
  }, [filteredConversations, folders])

  function handleNewConversation(): void {
    const newConv: Conversation = {
      id: `c-new-${Date.now()}`,
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConv, ...prev])
    setSelectedId(newConv.id)
    setEditingId(newConv.id)
    setEditTitle(newConv.title)
  }

  function handleContextMenu(event: React.MouseEvent, conversationId: string): void {
    event.preventDefault()
    setContextMenuPosition({ x: event.clientX, y: event.clientY })
    setContextMenuConversationId(conversationId)
  }

  function handleRename(conversationId: string): void {
    const conv = conversations.find((c) => c.id === conversationId)
    if (!conv) return
    setEditingId(conversationId)
    setEditTitle(conv.title)
  }

  function handleSubmitRename(conversationId: string): void {
    if (!editTitle.trim()) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, title: editTitle.trim() } : c,
      ),
    )
    setEditingId(null)
    setEditTitle('')
  }

  function handleCancelRename(): void {
    setEditingId(null)
    setEditTitle('')
  }

  function handleTogglePin(conversationId: string): void {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, isPinned: !c.isPinned } : c,
      ),
    )
  }

  function handleArchive(conversationId: string): void {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, isArchived: true } : c,
      ),
    )
    if (selectedId === conversationId) setSelectedId(null)
  }

  function handleDelete(conversationId: string): void {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId))
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        conversationIds: f.conversationIds.filter((id) => id !== conversationId),
      })),
    )
    if (selectedId === conversationId) setSelectedId(null)
  }

  function handleToggleFolder(folderId: string): void {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f,
      ),
    )
  }

  function handleToggleBulkSelect(conversationId: string): void {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(conversationId)) {
        next.delete(conversationId)
      } else {
        next.add(conversationId)
      }
      return next
    })
  }

  function handleBulkDelete(): void {
    setConversations((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        conversationIds: f.conversationIds.filter((id) => !selectedIds.has(id)),
      })),
    )
    setSelectedIds(new Set())
    setBulkMode(false)
    if (selectedId && selectedIds.has(selectedId)) setSelectedId(null)
  }

  function handleBulkArchive(): void {
    setConversations((prev) =>
      prev.map((c) => (selectedIds.has(c.id) ? { ...c, isArchived: true } : c)),
    )
    setSelectedIds(new Set())
    setBulkMode(false)
  }

  const contextMenuItems = contextMenuConversationId
    ? [
        {
          label: 'Renommer',
          icon: <Pencil />,
          onClick: () => handleRename(contextMenuConversationId),
        },
        {
          label: conversations.find((c) => c.id === contextMenuConversationId)?.isPinned
            ? 'Désépingler'
            : 'Épingler',
          icon: conversations.find((c) => c.id === contextMenuConversationId)?.isPinned
            ? <PinOff />
            : <Pin />,
          onClick: () => handleTogglePin(contextMenuConversationId),
        },
        {
          label: 'Archiver',
          icon: <Archive />,
          onClick: () => handleArchive(contextMenuConversationId),
        },
        {
          label: 'Supprimer',
          icon: <Trash2 />,
          variant: 'danger' as const,
          onClick: () => handleDelete(contextMenuConversationId),
        },
      ]
    : []

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  return (
    <div className="w-full h-[700px] mx-auto flex bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 280 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex flex-col h-full bg-surface border-r border-border overflow-hidden shrink-0"
      >
        {/* Toggle button */}
        <div className={`flex items-center p-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="text-caption font-semibold text-text-primary px-2">Conversations</span>
          )}
          <IconButton
            icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            label={collapsed ? 'Ouvrir' : 'Fermer'}
            size="sm"
            onClick={() => setCollapsed((prev) => !prev)}
          />
        </div>

        {/* Collapsed view */}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <IconButton
              icon={<Plus />}
              label="Nouvelle conversation"
              size="sm"
              variant="subtle"
              onClick={handleNewConversation}
            />
            <IconButton
              icon={<Search />}
              label="Rechercher"
              size="sm"
              onClick={() => setCollapsed(false)}
            />
          </div>
        )}

        {/* Expanded sidebar content */}
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: collapsed ? 0.1 : 0.2, delay: collapsed ? 0 : 0.1 }}
          className={`flex-1 flex flex-col overflow-hidden ${collapsed ? 'pointer-events-none' : ''}`}
        >
          {/* New conversation + search */}
          <div className="px-3 pb-2 space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleNewConversation}
            >
              <Plus className="w-4 h-4" />
              Nouvelle conversation
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-8 pr-3 py-1.5 text-small rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  setBulkMode((prev) => !prev)
                  setSelectedIds(new Set())
                }}
                className="text-small text-text-muted hover:text-text-primary cursor-pointer"
              >
                {bulkMode ? 'Annuler' : 'Sélectionner'}
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          <AnimatePresence>
            {bulkMode && selectedIds.size > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-border"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-tertiary">
                  <span className="text-small text-text-muted">{selectedIds.size} sélectionné(s)</span>
                  <div className="ml-auto flex gap-1">
                    <IconButton
                      icon={<Archive />}
                      label="Archiver"
                      size="sm"
                      onClick={handleBulkArchive}
                    />
                    <IconButton
                      icon={<Trash2 />}
                      label="Supprimer"
                      size="sm"
                      className="text-danger"
                      onClick={handleBulkDelete}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-1">
            {/* Folders */}
            {folders.map((folder) => {
              const folderItems = folderConversations[folder.id] ?? []
              if (folderItems.length === 0 && searchQuery) return null

              return (
                <div key={folder.id} className="mb-1">
                  <button
                    onClick={() => handleToggleFolder(folder.id)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-small font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors"
                  >
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${folder.isExpanded ? 'rotate-90' : ''}`}
                    />
                    {folder.isExpanded ? (
                      <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <FolderClosed className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{folder.name}</span>
                    <span className="text-text-muted ml-auto">{folderItems.length}</span>
                  </button>
                  <AnimatePresence>
                    {folder.isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        {folderItems.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedId === conv.id}
                            isEditing={editingId === conv.id}
                            editTitle={editTitle}
                            bulkMode={bulkMode}
                            isBulkSelected={selectedIds.has(conv.id)}
                            onSelect={() => setSelectedId(conv.id)}
                            onContextMenu={(event) => handleContextMenu(event, conv.id)}
                            onEditTitleChange={setEditTitle}
                            onSubmitRename={() => handleSubmitRename(conv.id)}
                            onCancelRename={handleCancelRename}
                            onToggleBulkSelect={() => handleToggleBulkSelect(conv.id)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* Date groups */}
            {(Object.entries(groupedConversations) as [DateGroup, Conversation[]][]).map(
              ([group, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={group} className="mb-2">
                    <p className="px-2 py-1 text-small font-medium text-text-muted flex items-center gap-1.5">
                      {group === 'pinned' && <Pin className="w-3 h-3 text-amber-500" />}
                      {DATE_GROUP_LABELS[group]}
                    </p>
                    {items.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isSelected={selectedId === conv.id}
                        isEditing={editingId === conv.id}
                        editTitle={editTitle}
                        bulkMode={bulkMode}
                        isBulkSelected={selectedIds.has(conv.id)}
                        onSelect={() => setSelectedId(conv.id)}
                        onContextMenu={(event) => handleContextMenu(event, conv.id)}
                        onEditTitleChange={setEditTitle}
                        onSubmitRename={() => handleSubmitRename(conv.id)}
                        onCancelRename={handleCancelRename}
                        onToggleBulkSelect={() => handleToggleBulkSelect(conv.id)}
                      />
                    ))}
                  </div>
                )
              },
            )}
          </div>
        </motion.div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {selectedConversation ? (
          <motion.div
            key={selectedConversation.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-md"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-tertiary flex items-center justify-center mx-auto">
              <Bot className="w-7 h-7 text-text-muted" />
            </div>
            <h2 className="text-h3 font-semibold text-text-primary">{selectedConversation.title}</h2>
            <p className="text-body text-text-muted">
              {PREVIEW_TEXTS[selectedConversation.id] ?? 'Aucun aperçu disponible.'}
            </p>
            <p className="text-small text-text-muted">
              Créée le {selectedConversation.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </motion.div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-tertiary flex items-center justify-center mx-auto">
              <MessageSquare className="w-7 h-7 text-text-muted" />
            </div>
            <h2 className="text-h3 font-semibold text-text-primary">Sélectionnez une conversation</h2>
            <p className="text-body text-text-muted">
              Choisissez une conversation dans la barre latérale ou créez-en une nouvelle.
            </p>
          </div>
        )}
      </div>

      {/* Context menu */}
      <ContextMenu
        items={contextMenuItems}
        position={contextMenuPosition}
        onClose={() => {
          setContextMenuPosition(null)
          setContextMenuConversationId(null)
        }}
      />
    </div>
  )
}

function ConversationItem({
  conversation,
  isSelected,
  isEditing,
  editTitle,
  bulkMode,
  isBulkSelected,
  onSelect,
  onContextMenu,
  onEditTitleChange,
  onSubmitRename,
  onCancelRename,
  onToggleBulkSelect,
}: {
  conversation: Conversation
  isSelected: boolean
  isEditing: boolean
  editTitle: string
  bulkMode: boolean
  isBulkSelected: boolean
  onSelect: () => void
  onContextMenu: (event: React.MouseEvent) => void
  onEditTitleChange: (value: string) => void
  onSubmitRename: () => void
  onCancelRename: () => void
  onToggleBulkSelect: () => void
}) {
  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') {
      onSubmitRename()
    } else if (event.key === 'Escape') {
      onCancelRename()
    }
  }

  return (
    <div
      onClick={bulkMode ? onToggleBulkSelect : onSelect}
      onContextMenu={onContextMenu}
      className={`group flex items-start gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
        isSelected && !bulkMode
          ? 'bg-accent-muted text-accent-strong'
          : isBulkSelected
            ? 'bg-accent-muted/50'
            : 'hover:bg-surface-secondary'
      }`}
    >
      {bulkMode && (
        <div className="shrink-0 mt-0.5">
          {isBulkSelected ? (
            <CheckSquare className="w-4 h-4 text-accent" />
          ) : (
            <Square className="w-4 h-4 text-text-muted" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              value={editTitle}
              onChange={(event) => onEditTitleChange(event.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 min-w-0 px-1.5 py-0.5 text-small rounded border border-accent bg-surface text-text-primary focus:outline-none"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              onClick={(event) => { event.stopPropagation(); onSubmitRename() }}
              className="text-green-500 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(event) => { event.stopPropagation(); onCancelRename() }}
              className="text-text-muted cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-small font-medium text-text-primary truncate">
              {conversation.isPinned && <Pin className="w-3 h-3 text-amber-500 inline mr-1" />}
              {conversation.title}
            </p>
            <p className="text-small text-text-muted truncate mt-0.5">
              {PREVIEW_TEXTS[conversation.id]?.slice(0, 50) ?? 'Pas de contenu'}...
            </p>
          </>
        )}
      </div>

      {!bulkMode && !isEditing && (
        <span className="shrink-0 text-small text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          {formatRelativeDate(conversation.updatedAt)}
        </span>
      )}
    </div>
  )
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Maintenant'
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
