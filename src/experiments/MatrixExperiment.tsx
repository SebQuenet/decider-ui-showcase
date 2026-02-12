import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid3x3,
  Play,
  Quote,
  Download,
  Plus,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react'

// --- Types ---

type Confidence = 'high' | 'medium' | 'unavailable'

type ExtractionStatus = 'idle' | 'running' | 'done'

interface CellData {
  value: string
  confidence: Confidence
  citation: {
    document: string
    page: number
    quote: string
  }
}

interface QuestionRow {
  question: string
  cells: CellData[]
  hasDivergence: boolean
  divergentColumns: number[]
}

interface Template {
  id: string
  label: string
}

// --- Donnees mock ---

const TEMPLATES: Template[] = [
  { id: 'due-diligence', label: 'Due Diligence' },
  { id: 'term-sheet', label: 'Term Sheet' },
  { id: 'performance-review', label: 'Performance Review' },
]

const DOCUMENTS = [
  'Prospectus Alpha Growth',
  'Reporting Q4 2024',
  'Term Sheet Alpha',
  'Factsheet Mars 2025',
]

const GRID_DATA: QuestionRow[] = [
  {
    question: 'IRR net',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: '18,5%', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 12, quote: 'Le taux de rendement interne net (IRR) s\'etablit a 18,5% au 31/12/2024, en ligne avec les objectifs initiaux du fonds.' } },
      { value: '18,2%', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 3, quote: 'Performance nette : IRR de 18,2% depuis inception, en progression de 120 bps sur le trimestre.' } },
      { value: '18,5%', confidence: 'high', citation: { document: 'Term Sheet Alpha', page: 8, quote: 'IRR net cible : 18,5% (gross IRR 22,0% avant frais de gestion et carried interest).' } },
      { value: '18,5%', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 1, quote: 'IRR net : 18,5% | Quartile : Q1 | Benchmark : 14,2%' } },
    ],
  },
  {
    question: 'TVPI',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: '1,65x', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 14, quote: 'Le multiple total (TVPI) atteint 1,65x, refletant une creation de valeur soutenue sur l\'ensemble du portefeuille.' } },
      { value: '1,62x', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 4, quote: 'TVPI : 1,62x (vs. 1,58x au Q3). DPI : 0,45x. RVPI : 1,17x.' } },
      { value: '\u2014', confidence: 'unavailable', citation: { document: 'Term Sheet Alpha', page: 0, quote: 'Information non disponible dans ce document.' } },
      { value: '1,65x', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 1, quote: 'TVPI : 1,65x | DPI : 0,48x | RVPI : 1,17x' } },
    ],
  },
  {
    question: 'Management fees',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: '2,0%', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 22, quote: 'Commission de gestion annuelle : 2,0% de l\'engagement total pendant la periode d\'investissement.' } },
      { value: '2,0%', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 8, quote: 'Frais de gestion preleves sur la periode : 2,0% p.a. conformement aux termes du fonds.' } },
      { value: '2,0% + 20% carried', confidence: 'high', citation: { document: 'Term Sheet Alpha', page: 3, quote: 'Management Fee : 2,0% p.a. | Carried Interest : 20% au-dela du hurdle rate de 8%.' } },
      { value: '2,0%', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 2, quote: 'Commission de gestion : 2,0% | TER : 2,35%' } },
    ],
  },
  {
    question: 'Taille du fonds',
    hasDivergence: true,
    divergentColumns: [2],
    cells: [
      { value: '850 M\u20ac', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 5, quote: 'Taille finale du fonds : 850 millions d\'euros, depassant l\'objectif initial de 750 M\u20ac (hard cap : 900 M\u20ac).' } },
      { value: '850 M\u20ac', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 2, quote: 'Engagements totaux : 850 M\u20ac | Capital appele : 72% | Capital distribue : 28%' } },
      { value: '800\u2013900 M\u20ac', confidence: 'medium', citation: { document: 'Term Sheet Alpha', page: 2, quote: 'Taille cible : 800-900 M\u20ac. Hard cap a determiner par le GP en consultation avec l\'Advisory Committee.' } },
      { value: '850 M\u20ac', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 1, quote: 'AUM : 850 M\u20ac | Vintage : 2020 | Devise : EUR' } },
    ],
  },
  {
    question: 'Strategie',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: 'Buyout mid-cap Europe', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 7, quote: 'Strategie : acquisitions majoritaires (buyout) cibleant des entreprises mid-cap europeennes (EV 100-500 M\u20ac).' } },
      { value: 'Buyout mid-cap Europe', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 1, quote: 'Alpha Growth Fund \u2014 Strategie Buyout mid-cap Europe. Focus : DACH, France, Benelux, Nordiques.' } },
      { value: 'Buyout mid-cap', confidence: 'high', citation: { document: 'Term Sheet Alpha', page: 1, quote: 'Strategie d\'investissement : Buyout mid-cap, avec focus sur les leaders de niche en Europe.' } },
      { value: 'Buyout Europe', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 1, quote: 'Classe d\'actifs : Private Equity \u2014 Buyout Europe' } },
    ],
  },
  {
    question: 'Periode d\'investissement',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: '5 ans', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 18, quote: 'Periode d\'investissement : 5 ans a compter du closing final, extensible d\'un an avec accord de l\'Advisory Committee.' } },
      { value: '\u2014', confidence: 'unavailable', citation: { document: 'Reporting Q4 2024', page: 0, quote: 'Information non mentionnee dans le reporting trimestriel.' } },
      { value: '5 ans (extensible 1 an)', confidence: 'high', citation: { document: 'Term Sheet Alpha', page: 4, quote: 'Investment Period : 5 ans, extensible d\'1 an sur decision du GP avec accord du LPAC.' } },
      { value: '5 ans', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 2, quote: 'Periode d\'investissement : 5 ans (2020-2025) | Duree du fonds : 10 ans + 2 extensions d\'1 an' } },
    ],
  },
  {
    question: 'Date de closing',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: 'Mars 2020', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 3, quote: 'Closing final : 15 mars 2020. Premier closing : decembre 2019 (420 M\u20ac).' } },
      { value: '\u2014', confidence: 'unavailable', citation: { document: 'Reporting Q4 2024', page: 0, quote: 'Non mentionne dans le reporting trimestriel.' } },
      { value: 'Mars 2020', confidence: 'high', citation: { document: 'Term Sheet Alpha', page: 2, quote: 'Date de closing final prevue : Q1 2020 (mars 2020).' } },
      { value: '\u2014', confidence: 'unavailable', citation: { document: 'Factsheet Mars 2025', page: 0, quote: 'Non mentionne dans la factsheet.' } },
    ],
  },
  {
    question: 'Nombre d\'investissements',
    hasDivergence: false,
    divergentColumns: [],
    cells: [
      { value: '12', confidence: 'high', citation: { document: 'Prospectus Alpha Growth', page: 25, quote: 'Portefeuille compose de 12 investissements realises a ce jour, en ligne avec l\'objectif de 12-15 participations.' } },
      { value: '12 (dont 3 exits)', confidence: 'high', citation: { document: 'Reporting Q4 2024', page: 5, quote: '12 investissements realises : 9 en portefeuille, 3 cessions (MOIC moyen sorties : 2,8x).' } },
      { value: '\u2014', confidence: 'unavailable', citation: { document: 'Term Sheet Alpha', page: 0, quote: 'Non applicable \u2014 document pre-investissement.' } },
      { value: '12', confidence: 'high', citation: { document: 'Factsheet Mars 2025', page: 1, quote: 'Nombre de participations : 12 | Exits : 3 | Pipeline : 2 deals en closing' } },
    ],
  },
]

const SUGGESTION_CHIPS = ['Distribution policy', 'ESG rating', 'Key person clause']

// --- Helpers ---

function confidenceColor(confidence: Confidence): string {
  if (confidence === 'high') return 'bg-green-500'
  if (confidence === 'medium') return 'bg-orange-400'
  return 'bg-gray-300'
}

function confidenceLabel(confidence: Confidence): string {
  if (confidence === 'high') return 'Confiance elevee'
  if (confidence === 'medium') return 'Confiance moyenne'
  return 'Non disponible'
}

// --- Composant principal ---

export function MatrixExperiment() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id)
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false)
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>('idle')
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set())
  const [showDivergences, setShowDivergences] = useState(false)
  const [elapsedTime, setElapsedTime] = useState<number | null>(null)
  const [activeCitation, setActiveCitation] = useState<{ rowIndex: number; colIndex: number } | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const totalExtractions = GRID_DATA.length * DOCUMENTS.length

  const handleStartExtraction = useCallback(() => {
    setExtractionStatus('running')
    setVisibleCells(new Set())
    setShowDivergences(false)
    setElapsedTime(null)
    setActiveCitation(null)

    const startTime = Date.now()
    let cellIndex = 0
    const totalCells = GRID_DATA.length * DOCUMENTS.length

    const fillNextCell = () => {
      if (cellIndex >= totalCells) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        setElapsedTime(parseFloat(elapsed))
        setExtractionStatus('done')
        setTimeout(() => setShowDivergences(true), 300)
        return
      }

      const rowIndex = Math.floor(cellIndex / DOCUMENTS.length)
      const colIndex = cellIndex % DOCUMENTS.length
      const cellKey = `${rowIndex}-${colIndex}`

      setVisibleCells((previous) => new Set([...previous, cellKey]))
      cellIndex++

      const baseDelay = 80
      const columnDelay = colIndex * 20
      timerRef.current = setTimeout(fillNextCell, baseDelay + columnDelay)
    }

    setTimeout(fillNextCell, 400)
  }, [])

  const handleAddQuestion = useCallback((questionText: string) => {
    if (!questionText.trim()) return
    setNewQuestion('')
  }, [])

  const selectedTemplateLabel = TEMPLATES.find((t) => t.id === selectedTemplate)?.label ?? ''

  const completedCount = visibleCells.size
  const progressPercentage = totalExtractions > 0 ? (completedCount / totalExtractions) * 100 : 0

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Grid3x3 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Matrix Multi-Documents</h2>
            <p className="text-small text-text-muted">
              Extraction parallele sur {DOCUMENTS.length} documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Template selector */}
          <div className="relative">
            <button
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg border border-border text-small text-text-primary hover:bg-surface-secondary/80 transition-colors cursor-pointer"
            >
              {selectedTemplateLabel}
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${templateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {templateDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-surface rounded-lg border border-border shadow-xl z-50"
                >
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setTemplateDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-small transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                        selectedTemplate === template.id
                          ? 'bg-accent/10 text-accent font-medium'
                          : 'text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lancer button */}
          <button
            onClick={handleStartExtraction}
            disabled={extractionStatus === 'running'}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {extractionStatus === 'running' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Lancer l'extraction
          </button>

          {/* Status */}
          <div className="flex items-center gap-2 min-w-[200px]">
            {extractionStatus === 'idle' && (
              <span className="text-small text-text-muted">Pret a extraire</span>
            )}
            {extractionStatus === 'running' && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-small text-text-secondary font-medium">
                    {completedCount}/{totalExtractions} extractions
                  </span>
                  <span className="text-small text-text-muted font-data">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}
            {extractionStatus === 'done' && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-small text-text-secondary">
                  Termine en {elapsedTime}s
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compteur d'extractions */}
      {extractionStatus !== 'idle' && (
        <div className="shrink-0 px-6 py-2 bg-surface-secondary/50 border-b border-border-muted">
          <p className="text-small text-text-muted">
            {GRID_DATA.length} questions &times; {DOCUMENTS.length} documents = {totalExtractions} extractions
            {extractionStatus === 'done' && elapsedTime !== null && (
              <span className="ml-2 text-accent font-medium">&mdash; Termine en {elapsedTime}s</span>
            )}
            {showDivergences && (
              <span className="ml-3 inline-flex items-center gap-1 text-orange-500">
                <AlertTriangle className="w-3 h-3" />
                1 divergence detectee
              </span>
            )}
          </p>
        </div>
      )}

      {/* Grille */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-secondary">
              <th className="sticky left-0 z-20 bg-surface-secondary text-left px-4 py-3 text-small font-semibold text-text-secondary border-b border-r border-border min-w-[200px]">
                Question
              </th>
              {DOCUMENTS.map((doc, index) => (
                <th
                  key={index}
                  className="text-left px-4 py-3 text-small font-semibold text-text-secondary border-b border-border min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent/60" />
                    <span className="truncate">{doc}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRID_DATA.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="group/row hover:bg-surface-secondary/30 transition-colors"
              >
                {/* En-tete de ligne (question) */}
                <td className="sticky left-0 z-10 bg-surface px-4 py-3 border-b border-r border-border group-hover/row:bg-surface-secondary/30 transition-colors">
                  <span className="text-caption font-medium text-text-primary">
                    {row.question}
                  </span>
                  {row.hasDivergence && showDivergences && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 inline-flex items-center gap-1 text-orange-500"
                      title="Divergence detectee entre documents"
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </motion.span>
                  )}
                </td>

                {/* Cellules */}
                {row.cells.map((cell, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`
                  const isVisible = visibleCells.has(cellKey)
                  const isDivergent = row.hasDivergence && row.divergentColumns.includes(colIndex)
                  const isCitationOpen = activeCitation?.rowIndex === rowIndex && activeCitation?.colIndex === colIndex

                  return (
                    <td
                      key={colIndex}
                      className={`relative px-4 py-3 border-b border-border transition-colors ${
                        isDivergent && showDivergences ? 'border-l-2 border-l-orange-400' : ''
                      }`}
                    >
                      {extractionStatus === 'idle' ? (
                        // Etat initial : cellule vide
                        <div className="h-8 flex items-center">
                          <span className="text-small text-text-muted/40">&mdash;</span>
                        </div>
                      ) : !isVisible ? (
                        // Shimmer loading
                        <div className="h-8 flex items-center gap-2">
                          <div className="flex-1 h-5 rounded bg-surface-secondary animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-surface-secondary animate-pulse" />
                        </div>
                      ) : (
                        // Cellule remplie
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="group/cell relative"
                        >
                          <div className="flex items-center gap-2 h-8">
                            {/* Indicateur de confiance */}
                            <span
                              className={`shrink-0 w-2 h-2 rounded-full ${confidenceColor(cell.confidence)}`}
                              title={confidenceLabel(cell.confidence)}
                            />

                            {/* Valeur */}
                            <span
                              className={`text-caption font-data ${
                                cell.confidence === 'unavailable'
                                  ? 'text-text-muted'
                                  : 'text-text-primary font-medium'
                              }`}
                            >
                              {cell.value}
                            </span>

                            {/* Divergence flash */}
                            {isDivergent && showDivergences && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="shrink-0"
                              >
                                <AlertTriangle className="w-3 h-3 text-orange-400" />
                              </motion.span>
                            )}

                            {/* Bouton citation */}
                            <button
                              onClick={() => {
                                if (isCitationOpen) {
                                  setActiveCitation(null)
                                } else {
                                  setActiveCitation({ rowIndex, colIndex })
                                }
                              }}
                              className="shrink-0 opacity-0 group-hover/cell:opacity-100 transition-opacity p-0.5 rounded hover:bg-surface-secondary cursor-pointer"
                              title="Voir la source"
                            >
                              <Quote className="w-3 h-3 text-text-muted" />
                            </button>
                          </div>

                          {/* Popover citation */}
                          <AnimatePresence>
                            {isCitationOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 top-full mt-1 w-72 bg-surface rounded-xl border border-border shadow-xl z-30 p-3"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="text-small font-semibold text-text-primary">
                                      {cell.citation.document}
                                    </p>
                                    {cell.citation.page > 0 && (
                                      <p className="text-small text-text-muted">
                                        Page {cell.citation.page}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setActiveCitation(null)}
                                    className="p-0.5 rounded hover:bg-surface-secondary cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5 text-text-muted" />
                                  </button>
                                </div>
                                <div className="border-l-2 border-accent pl-2.5">
                                  <p className="text-small text-text-secondary italic leading-relaxed">
                                    &laquo; {cell.citation.quote} &raquo;
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${confidenceColor(cell.confidence)}`} />
                                  <span className="text-small text-text-muted">
                                    {confidenceLabel(cell.confidence)}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barre inferieure */}
      <div className="shrink-0 px-6 py-3 border-t border-border bg-surface flex items-center gap-3">
        {/* Champ ajout question */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddQuestion(newQuestion)
              }}
              placeholder="Ajouter une question..."
              className="w-full pl-9 pr-3 py-2 bg-surface-secondary rounded-lg border border-border-muted text-small text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Suggestions */}
          <div className="flex items-center gap-1.5">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleAddQuestion(chip)}
                className="px-2.5 py-1.5 bg-surface-secondary rounded-md border border-border-muted text-small text-text-secondary hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Export */}
        <button className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg border border-border text-small text-text-secondary hover:bg-surface-secondary/80 transition-colors cursor-pointer">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  )
}
