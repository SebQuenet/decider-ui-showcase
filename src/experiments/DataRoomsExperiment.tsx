import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileBarChart,
  FilePlus,
  Upload,
  Filter,
  Grid3X3,
  List,
  Tag,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  Share2,
  Eye,
  LayoutDashboard,
  Plus,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Select } from '../components/ui/Select.tsx'
import { Input } from '../components/ui/Input.tsx'
import { Modal } from '../components/ui/Modal.tsx'
import { ProgressBar } from '../components/ui/ProgressBar.tsx'
import { Chip } from '../components/ui/Chip.tsx'

type FundId = 'all' | 'alpha' | 'beta' | 'gamma'
type DocumentType = 'Prospectus' | 'Factsheet' | 'Reporting' | 'Term Sheet' | 'Audit' | 'LP Agreement'
type IndexingStatus = 'indexed' | 'indexing' | 'pending'

interface FundProject {
  id: string
  name: string
  strategy: string
  aum: string
  documentCount: number
  status: 'ready' | 'in-progress' | 'new'
  lastUpdated: string
}

interface DocumentItem {
  id: string
  name: string
  type: DocumentType
  fund: string
  fundId: FundId
  pages: number
  size: string
  indexingStatus: IndexingStatus
  indexingProgress: number
  tags: string[]
}

const FUND_OPTIONS = [
  { value: 'all', label: 'Tous les fonds' },
  { value: 'alpha', label: 'Alpha Growth Fund' },
  { value: 'beta', label: 'Beta Income Fund' },
  { value: 'gamma', label: 'Gamma Venture Fund' },
]

const FUND_PROJECTS: FundProject[] = [
  { id: 'alpha', name: 'Alpha Growth Fund', strategy: 'Growth Equity', aum: '€245M', documentCount: 18, status: 'ready', lastUpdated: 'Il y a 2h' },
  { id: 'beta', name: 'Beta Income Fund', strategy: 'Fixed Income', aum: '€180M', documentCount: 12, status: 'in-progress', lastUpdated: 'Il y a 1j' },
  { id: 'gamma', name: 'Gamma Venture Fund', strategy: 'Venture Capital', aum: '€95M', documentCount: 7, status: 'new', lastUpdated: 'Il y a 3j' },
]

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: '1', name: 'Prospectus Alpha Growth 2024', type: 'Prospectus', fund: 'Alpha Growth', fundId: 'alpha', pages: 84, size: '2.4 MB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['legal', 'official'] },
  { id: '2', name: 'Factsheet Q4 2024', type: 'Factsheet', fund: 'Alpha Growth', fundId: 'alpha', pages: 4, size: '580 KB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['quarterly', 'performance'] },
  { id: '3', name: 'Reporting Annuel 2024', type: 'Reporting', fund: 'Alpha Growth', fundId: 'alpha', pages: 32, size: '1.8 MB', indexingStatus: 'indexing', indexingProgress: 67, tags: ['annual', 'performance'] },
  { id: '4', name: 'Term Sheet Series B', type: 'Term Sheet', fund: 'Gamma Venture', fundId: 'gamma', pages: 12, size: '340 KB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['investment', 'terms'] },
  { id: '5', name: 'Audit Report 2023', type: 'Audit', fund: 'Beta Income', fundId: 'beta', pages: 56, size: '3.1 MB', indexingStatus: 'pending', indexingProgress: 0, tags: ['audit', 'compliance'] },
  { id: '6', name: 'LP Agreement v3', type: 'LP Agreement', fund: 'Alpha Growth', fundId: 'alpha', pages: 28, size: '920 KB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['legal', 'LP'] },
  { id: '7', name: 'Factsheet Q3 2024', type: 'Factsheet', fund: 'Beta Income', fundId: 'beta', pages: 4, size: '540 KB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['quarterly'] },
  { id: '8', name: 'Prospectus Beta Income', type: 'Prospectus', fund: 'Beta Income', fundId: 'beta', pages: 72, size: '2.1 MB', indexingStatus: 'indexing', indexingProgress: 34, tags: ['legal', 'official'] },
  { id: '9', name: 'Reporting S1 2024', type: 'Reporting', fund: 'Gamma Venture', fundId: 'gamma', pages: 18, size: '1.2 MB', indexingStatus: 'indexed', indexingProgress: 100, tags: ['semi-annual'] },
  { id: '10', name: 'Due Diligence Memo', type: 'Reporting', fund: 'Gamma Venture', fundId: 'gamma', pages: 24, size: '1.5 MB', indexingStatus: 'pending', indexingProgress: 0, tags: ['DD', 'internal'] },
]

const DOCUMENT_TYPES: DocumentType[] = ['Prospectus', 'Factsheet', 'Reporting', 'Term Sheet', 'Audit', 'LP Agreement']

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'info' }> = {
  ready: { label: 'Pret', variant: 'success' },
  'in-progress': { label: 'En cours', variant: 'warning' },
  new: { label: 'Nouveau', variant: 'info' },
}

const TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  Prospectus: FileText,
  Factsheet: FileBarChart,
  Reporting: FileSpreadsheet,
  'Term Sheet': FileText,
  Audit: FileText,
  'LP Agreement': FileText,
}

export function DataRoomsExperiment() {
  const [selectedFund, setSelectedFund] = useState<FundId>('all')
  const [activeMode, setActiveMode] = useState<'projects' | 'documents'>('projects')

  const MODE_TABS = [
    { id: 'projects', label: 'Projets' },
    { id: 'documents', label: 'Documents' },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Data Rooms</h2>
            <p className="text-small text-text-muted">Gestion documentaire</p>
          </div>
        </div>
        <div className="w-56">
          <Select
            options={FUND_OPTIONS}
            value={selectedFund}
            onChange={(event) => setSelectedFund(event.target.value as FundId)}
          />
        </div>
      </div>

      <Tabs
        tabs={MODE_TABS}
        activeTabId={activeMode}
        onTabChange={(id) => setActiveMode(id as 'projects' | 'documents')}
        layoutId="dataroom-tabs"
        className="px-6"
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeMode === 'projects' && <ProjectsView selectedFund={selectedFund} />}
        {activeMode === 'documents' && <DocumentsView selectedFund={selectedFund} />}
      </div>
    </div>
  )
}

interface ViewProps {
  selectedFund: FundId
}

function ProjectsView({ selectedFund }: ViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  const filteredProjects = selectedFund === 'all'
    ? FUND_PROJECTS
    : FUND_PROJECTS.filter((project) => project.id === selectedFund)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-caption font-semibold text-text-primary">
          {filteredProjects.length} projet(s)
        </h3>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid gap-3">
        {filteredProjects.map((project) => {
          const statusConfig = STATUS_CONFIG[project.status]
          const isExpanded = expandedProject === project.id
          return (
            <motion.div
              key={project.id}
              layout
              className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="w-full flex items-center gap-4 p-4 cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-glacier-100 to-glacier-200 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-glacier-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-semibold text-text-primary">{project.name}</span>
                    <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-small text-text-muted">
                    <span>{project.strategy}</span>
                    <span>AUM {project.aum}</span>
                    <span>{project.documentCount} documents</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-small text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {project.lastUpdated}
                </div>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-4 bg-surface-secondary grid grid-cols-4 gap-3">
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-small text-text-muted">Documents indexes</p>
                        <p className="text-h4 font-bold text-text-primary font-data">{project.documentCount - 2}</p>
                      </div>
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-small text-text-muted">En cours</p>
                        <p className="text-h4 font-bold text-warning font-data">2</p>
                      </div>
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-small text-text-muted">Taille totale</p>
                        <p className="text-h4 font-bold text-text-primary font-data">14.2 MB</p>
                      </div>
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-small text-text-muted">Couverture</p>
                        <p className="text-h4 font-bold text-success font-data">87%</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Create project modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouveau projet"
      >
        <div className="space-y-4">
          <Input label="Nom du projet" placeholder="Ex: Due Diligence Fund X" />
          <Select
            label="Fonds associe"
            options={FUND_OPTIONS.filter((f) => f.value !== 'all')}
            placeholder="Selectionner un fonds"
          />
          <Input label="Description" placeholder="Objectif du projet..." />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="md" onClick={() => setShowCreateModal(false)}>Annuler</Button>
            <Button variant="primary" size="md" onClick={() => setShowCreateModal(false)}>Creer</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function DocumentsView({ selectedFund }: ViewProps) {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showImportWizard, setShowImportWizard] = useState(false)
  const [importStep, setImportStep] = useState(0)
  const [importProgress, setImportProgress] = useState<number[]>([])
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null)

  const simulateIndexing = useCallback(() => {
    setDocuments((previous) =>
      previous.map((doc) => {
        if (doc.indexingStatus !== 'indexing') return doc
        const newProgress = Math.min(100, doc.indexingProgress + Math.random() * 8)
        const newStatus: IndexingStatus = newProgress >= 100 ? 'indexed' : 'indexing'
        return { ...doc, indexingProgress: Math.round(newProgress), indexingStatus: newStatus }
      })
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateIndexing, 1500)
    return () => clearInterval(interval)
  }, [simulateIndexing])

  const filteredDocuments = documents.filter((doc) => {
    const matchesFund = selectedFund === 'all' || doc.fundId === selectedFund
    const matchesType = selectedType === 'all' || doc.type === selectedType
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFund && matchesType && matchesSearch
  })

  function startImport(): void {
    setImportStep(1)
    setImportProgress([0, 0, 0])

    const intervals = [0, 1, 2].map((index) =>
      setInterval(() => {
        setImportProgress((previous) => {
          const next = [...previous]
          next[index] = Math.min(100, next[index] + Math.random() * 15)
          return next
        })
      }, 300 + index * 100)
    )

    setTimeout(() => {
      intervals.forEach(clearInterval)
      setImportProgress([100, 100, 100])
      setTimeout(() => setImportStep(2), 500)
    }, 3000)
  }

  const mockImportFiles = ['Reporting_Q4_2024.pdf', 'Factsheet_Dec2024.pdf', 'Audit_Draft.xlsx']

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left filter panel */}
      <div className="w-56 border-r border-border p-4 space-y-4 bg-surface-secondary shrink-0">
        <div>
          <p className="text-small font-medium text-text-muted mb-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtres
          </p>
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher..."
          />
        </div>
        <div>
          <p className="text-small font-medium text-text-muted mb-2">Type de document</p>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`w-full text-left px-3 py-1.5 rounded text-small cursor-pointer transition-colors ${
                selectedType === 'all' ? 'bg-accent-muted text-accent font-medium' : 'text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              Tous les types
            </button>
            {DOCUMENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full text-left px-3 py-1.5 rounded text-small cursor-pointer transition-colors ${
                  selectedType === type ? 'bg-accent-muted text-accent font-medium' : 'text-text-secondary hover:bg-surface-tertiary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <span className="text-small text-text-muted">{filteredDocuments.length} document(s)</span>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => { setShowImportWizard(true); setImportStep(0); }}>
              <Upload className="w-4 h-4" />
              Importer
            </Button>
            <div className="flex border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-accent-muted text-accent' : 'text-text-muted hover:bg-surface-secondary'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-accent-muted text-accent' : 'text-text-muted hover:bg-surface-secondary'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
          {filteredDocuments.map((doc) => {
            const TypeIcon = TYPE_ICONS[doc.type]
            return (
              <motion.div
                key={doc.id}
                layout
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedDocument(doc)}
                className={`bg-surface border border-border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center gap-3 px-4 py-3' : 'p-4'
                }`}
              >
                <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'mb-2' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center shrink-0">
                    <TypeIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-medium text-text-primary truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-small text-text-muted">
                      <span>{doc.fund}</span>
                      <span>{doc.pages}p</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Indexing status */}
                <div className={viewMode === 'grid' ? 'mt-2' : 'shrink-0 w-36'}>
                  {doc.indexingStatus === 'indexed' && (
                    <div className="flex items-center gap-1 text-small text-success">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Indexe
                    </div>
                  )}
                  {doc.indexingStatus === 'indexing' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-small text-accent">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Indexation {doc.indexingProgress}%
                      </div>
                      <ProgressBar value={doc.indexingProgress} />
                    </div>
                  )}
                  {doc.indexingStatus === 'pending' && (
                    <div className="flex items-center gap-1 text-small text-text-muted">
                      <Clock className="w-3.5 h-3.5" />
                      En attente
                    </div>
                  )}
                </div>

                {/* Tags */}
                {viewMode === 'grid' && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-surface-secondary text-text-muted px-1.5 py-0.5 rounded-full">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Document side panel */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-border bg-surface overflow-hidden shrink-0"
          >
            <div className="w-80 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-caption font-semibold text-text-primary truncate pr-2">{selectedDocument.name}</h3>
                <button onClick={() => setSelectedDocument(null)} className="cursor-pointer text-text-muted hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-small">
                  <span className="text-text-muted">Type</span>
                  <Badge variant="default" size="sm">{selectedDocument.type}</Badge>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-text-muted">Fonds</span>
                  <span className="text-text-primary">{selectedDocument.fund}</span>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-text-muted">Pages</span>
                  <span className="text-text-primary font-data">{selectedDocument.pages}</span>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-text-muted">Taille</span>
                  <span className="text-text-primary">{selectedDocument.size}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedDocument.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="default" />
                ))}
              </div>

              <div className="bg-surface-secondary rounded-lg p-3 border border-border h-40 flex items-center justify-center">
                <div className="text-center text-text-muted">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-small">Apercu du document</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Share2 className="w-3.5 h-3.5" />
                  Partager
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  <Eye className="w-3.5 h-3.5" />
                  Ouvrir
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import wizard modal */}
      <Modal
        open={showImportWizard}
        onClose={() => setShowImportWizard(false)}
        title="Importer des documents"
      >
        {importStep === 0 && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer"
              onClick={startImport}
            >
              <Upload className="w-10 h-10 mx-auto text-text-muted mb-3" />
              <p className="text-caption font-medium text-text-primary">Deposez vos fichiers ici</p>
              <p className="text-small text-text-muted mt-1">PDF, XLSX, DOCX - Max 50 MB</p>
            </div>
          </div>
        )}

        {importStep === 1 && (
          <div className="space-y-3">
            <p className="text-caption font-medium text-text-primary">Telechargement en cours...</p>
            {mockImportFiles.map((file, index) => (
              <div key={file} className="flex items-center gap-3">
                <FilePlus className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex-1">
                  <p className="text-small text-text-primary">{file}</p>
                  <ProgressBar value={importProgress[index] ?? 0} showLabel />
                </div>
              </div>
            ))}
          </div>
        )}

        {importStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-caption font-medium">3 fichiers importes avec succes</span>
            </div>
            <div className="space-y-2">
              <p className="text-small font-medium text-text-secondary">Classification automatique</p>
              {mockImportFiles.map((file) => (
                <div key={file} className="flex items-center justify-between bg-surface-secondary rounded-lg px-3 py-2">
                  <span className="text-small text-text-primary">{file}</span>
                  <div className="flex gap-1">
                    <Chip label="Reporting" variant="active" />
                    <Chip label="Q4" variant="default" />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="primary" size="md" className="w-full" onClick={() => setShowImportWizard(false)}>
              Terminer
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
