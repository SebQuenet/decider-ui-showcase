import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Bot,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calculator,
  Lightbulb,
  X,
  Send,
  Sparkles,
  Table2,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge.tsx'
import { Select } from '../components/ui/Select.tsx'

interface Citation {
  id: string
  document: string
  page: number
  excerpt: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  metricsTable?: MetricRow[]
  termSheet?: TermSheetEntry[]
  calculation?: CalculationStep[]
}

interface MetricRow {
  label: string
  value: string
  status: 'good' | 'neutral' | 'bad'
}

interface TermSheetEntry {
  label: string
  value: string
}

interface CalculationStep {
  label: string
  formula: string
  result: string
}

const FUND_OPTIONS = [
  { value: 'alpha', label: 'Alpha Growth Fund' },
  { value: 'beta', label: 'Beta Income Fund' },
  { value: 'gamma', label: 'Gamma Venture Fund' },
]

const MOCK_CITATIONS: Citation[] = [
  { id: 'c1', document: 'Prospectus Alpha Growth 2024', page: 12, excerpt: 'Le fonds vise un taux de rendement interne net cible de 15% sur la duree de vie du fonds, avec une periode d\'investissement de 4 ans. La strategie repose sur des investissements en growth equity dans les entreprises mid-cap europeennes.' },
  { id: 'c2', document: 'Reporting Annuel 2024', page: 8, excerpt: 'La performance nette du fonds s\'etablit a 18.4% pour l\'exercice 2024, surpassant l\'objectif initial de 15% et l\'indice de reference MSCI Europe Mid Cap (+12.1%). Le TVPI s\'eleve a 1.52x.' },
  { id: 'c3', document: 'Factsheet Q4 2024', page: 2, excerpt: 'Repartition sectorielle : Technologie 28%, Sante 22%, Services financiers 18%, Industrie 15%, Consommation 12%, Autres 5%. Le top 5 des positions represente 42% du portefeuille.' },
  { id: 'c4', document: 'LP Agreement v3', page: 15, excerpt: 'Commission de gestion : 2.0% de l\'engagement total pendant la periode d\'investissement, puis 1.5% du capital investi. Carried interest : 20% au-dela d\'un hurdle rate de 8%.' },
]

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Quelle est la performance du fonds Alpha Growth et ses principaux indicateurs ?',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Selon le reporting annuel, le fonds Alpha Growth affiche une performance remarquable sur l\'exercice 2024 :',
    citations: [MOCK_CITATIONS[1], MOCK_CITATIONS[2]],
    metricsTable: [
      { label: 'IRR Net', value: '18.4%', status: 'good' },
      { label: 'TVPI', value: '1.52x', status: 'good' },
      { label: 'DPI', value: '0.45x', status: 'neutral' },
      { label: 'RVPI', value: '1.07x', status: 'good' },
      { label: 'Volatilite', value: '14.2%', status: 'neutral' },
      { label: 'Sharpe Ratio', value: '1.42', status: 'good' },
      { label: 'Max Drawdown', value: '-8.3%', status: 'neutral' },
      { label: 'Alpha vs benchmark', value: '+6.3%', status: 'good' },
    ],
  },
  {
    id: '3',
    role: 'user',
    content: 'Quels sont les termes cles du fonds ?',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Voici les termes cles extraits du LP Agreement et du prospectus :',
    citations: [MOCK_CITATIONS[0], MOCK_CITATIONS[3]],
    termSheet: [
      { label: 'Taille du fonds', value: '€245M' },
      { label: 'Strategie', value: 'Growth Equity - Mid Cap Europe' },
      { label: 'Periode d\'investissement', value: '4 ans' },
      { label: 'Duree de vie', value: '10 ans + 2 extensions' },
      { label: 'Commission de gestion', value: '2.0% / 1.5%' },
      { label: 'Carried interest', value: '20%' },
      { label: 'Hurdle rate', value: '8%' },
      { label: 'IRR cible', value: '15% net' },
    ],
  },
  {
    id: '5',
    role: 'user',
    content: 'Calcule le rendement reel apres frais pour un LP qui a investi €10M.',
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Voici le detail du calcul pour un engagement de €10M :',
    calculation: [
      { label: 'Engagement LP', formula: '-', result: '€10,000,000' },
      { label: 'Frais de gestion (4 ans)', formula: '€10M x 2.0% x 4', result: '-€800,000' },
      { label: 'Frais post-investissement (6 ans)', formula: '€10M x 1.5% x 6', result: '-€900,000' },
      { label: 'Valeur brute (TVPI 1.52x)', formula: '€10M x 1.52', result: '€15,200,000' },
      { label: 'Plus-value brute', formula: '€15.2M - €10M', result: '€5,200,000' },
      { label: 'Hurdle (8% compose, 10 ans)', formula: '€10M x (1.08^10 - 1)', result: '€11,589,250' },
      { label: 'Carry (20% sur excedent)', formula: '(€15.2M - €11.59M) x 20%', result: '-€722,150' },
      { label: 'Rendement net LP', formula: 'Brut - Frais - Carry', result: '€12,777,850' },
      { label: 'Multiple net LP', formula: '€12.78M / €10M', result: '1.28x' },
    ],
  },
]

const QUESTION_SUGGESTIONS = [
  'Quels sont les risques identifies ?',
  'Comparer avec Beta Fund',
  'Extraire les frais detailles',
  'Historique de performance par trimestre',
]

const MISSING_DOCUMENTS = [
  'Reporting Q4 2024 (attendu le 15/02)',
  'Rapport d\'audit annuel 2024',
  'Lettre aux investisseurs Q4',
]

export function InterrogationExperiment() {
  const [selectedFund, setSelectedFund] = useState('alpha')
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null)
  const [citationIndex, setCitationIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')

  const allCitations = MOCK_MESSAGES.flatMap((message) => message.citations ?? [])

  function navigateCitation(direction: 'prev' | 'next'): void {
    if (!activeCitation) return
    const currentIndex = allCitations.findIndex((c) => c.id === activeCitation.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'next'
      ? Math.min(allCitations.length - 1, currentIndex + 1)
      : Math.max(0, currentIndex - 1)

    setActiveCitation(allCitations[newIndex])
    setCitationIndex(newIndex)
  }

  return (
    <div className="w-full h-full flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-body font-semibold text-text-primary">Interrogation documentaire</h2>
              <p className="text-small text-text-muted">Chat avec sources et citations</p>
            </div>
          </div>
          <div className="w-48">
            <Select
              options={FUND_OPTIONS}
              value={selectedFund}
              onChange={(event) => setSelectedFund(event.target.value)}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {MOCK_MESSAGES.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isUser ? 'bg-glacier-600 text-white' : 'bg-surface-tertiary text-text-secondary'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] space-y-3 ${isUser ? 'items-end' : ''}`}>
                  {/* Text content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-glacier-600 text-white rounded-br-md'
                      : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                  }`}>
                    <p className="text-body leading-relaxed">
                      {renderContentWithCitations(message.content, message.citations, setActiveCitation, setCitationIndex, allCitations)}
                    </p>
                  </div>

                  {/* Citation badges */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {message.citations.map((citation) => (
                        <motion.button
                          key={citation.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveCitation(citation)
                            setCitationIndex(allCitations.findIndex((c) => c.id === citation.id))
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-muted text-accent text-small font-medium hover:bg-glacier-200 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          {citation.document}, p.{citation.page}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Metrics table */}
                  {message.metricsTable && (
                    <div className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border-b border-border">
                        <Table2 className="w-4 h-4 text-text-muted" />
                        <span className="text-small font-medium text-text-primary">Metriques cles</span>
                      </div>
                      <div className="divide-y divide-border">
                        {message.metricsTable.map((row) => {
                          const statusColor = row.status === 'good'
                            ? 'text-success'
                            : row.status === 'bad'
                              ? 'text-danger'
                              : 'text-text-primary'
                          return (
                            <div key={row.label} className="flex items-center justify-between px-4 py-2">
                              <span className="text-small text-text-secondary">{row.label}</span>
                              <span className={`text-caption font-semibold font-data ${statusColor}`}>{row.value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Term sheet */}
                  {message.termSheet && (
                    <div className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border-b border-border">
                        <FileText className="w-4 h-4 text-text-muted" />
                        <span className="text-small font-medium text-text-primary">Term Sheet</span>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-border">
                        {message.termSheet.map((entry) => (
                          <div key={entry.label} className="bg-surface px-3 py-2">
                            <p className="text-[11px] text-text-muted">{entry.label}</p>
                            <p className="text-small font-medium text-text-primary">{entry.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculation */}
                  {message.calculation && (
                    <div className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border-b border-border">
                        <Calculator className="w-4 h-4 text-text-muted" />
                        <span className="text-small font-medium text-text-primary">Detail du calcul</span>
                      </div>
                      <div className="divide-y divide-border">
                        {message.calculation.map((step, index) => {
                          const isLast = index === message.calculation!.length - 1
                          return (
                            <div key={step.label} className={`flex items-center gap-3 px-4 py-2 ${isLast ? 'bg-accent-muted' : ''}`}>
                              <span className={`flex-1 text-small ${isLast ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                                {step.label}
                              </span>
                              {step.formula !== '-' && (
                                <span className="text-[11px] text-text-muted font-mono">{step.formula}</span>
                              )}
                              <span className={`text-small font-data font-medium ${
                                isLast ? 'text-accent text-caption font-bold' : step.result.startsWith('-') ? 'text-danger' : 'text-text-primary'
                              }`}>
                                {step.result}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Question suggestions */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-text-muted" />
              <span className="text-small text-text-muted">Questions suggerees</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUESTION_SUGGESTIONS.map((question) => (
                <motion.button
                  key={question}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-1.5 rounded-full bg-surface-secondary border border-border text-small text-text-secondary hover:bg-surface-tertiary transition-colors cursor-pointer"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Missing documents warning */}
          <div className="bg-warning-muted border border-warning/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-caption font-medium text-text-primary">Documents manquants</span>
            </div>
            <ul className="space-y-1">
              {MISSING_DOCUMENTS.map((doc) => (
                <li key={doc} className="flex items-center gap-2 text-small text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-surface p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Posez une question sur les documents..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted"
            />
            <button className="rounded-xl bg-accent p-3 text-text-inverse hover:bg-accent-hover transition-colors cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Source panel */}
      <AnimatePresence>
        {activeCitation && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="border-l border-border bg-surface-secondary flex flex-col overflow-hidden shrink-0"
          >
            <div className="w-[400px] flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-caption font-medium text-text-primary truncate">
                    {activeCitation.document}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateCitation('prev')}
                    disabled={citationIndex === 0}
                    className="p-1 rounded hover:bg-surface-tertiary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-text-muted" />
                  </button>
                  <span className="text-small text-text-muted font-data">
                    {citationIndex + 1}/{allCitations.length}
                  </span>
                  <button
                    onClick={() => navigateCitation('next')}
                    disabled={citationIndex === allCitations.length - 1}
                    className="p-1 rounded hover:bg-surface-tertiary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </button>
                  <button
                    onClick={() => setActiveCitation(null)}
                    className="p-1 rounded hover:bg-surface-tertiary cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Page indicator */}
              <div className="px-4 py-2 bg-surface border-b border-border">
                <Badge variant="accent" size="sm">Page {activeCitation.page}</Badge>
              </div>

              {/* Document content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                <p className="text-small text-text-muted leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="bg-warning-muted/50 border-l-3 border-warning px-3 py-2 rounded-r-lg">
                  <p className="text-small text-text-primary leading-relaxed font-medium">
                    {activeCitation.excerpt}
                  </p>
                </div>
                <p className="text-small text-text-muted leading-relaxed">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-small text-text-muted leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function renderContentWithCitations(
  content: string,
  citations: Citation[] | undefined,
  onCitationClick: (citation: Citation) => void,
  setCitationIndex: (index: number) => void,
  allCitations: Citation[],
): React.ReactNode {
  if (!citations || citations.length === 0) return content

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let citationCounter = 0

  const citationPattern = /\b(prospectus|reporting|factsheet|LP Agreement)\b/gi
  let match: RegExpExecArray | null = null

  while ((match = citationPattern.exec(content)) !== null) {
    if (citationCounter >= citations.length) break

    parts.push(content.slice(lastIndex, match.index + match[0].length))

    const citation = citations[citationCounter]
    const globalIndex = allCitations.findIndex((c) => c.id === citation.id)
    parts.push(
      <button
        key={`cite-${citation.id}`}
        onClick={() => { onCitationClick(citation); setCitationIndex(globalIndex) }}
        className="inline-flex items-center gap-0.5 mx-0.5 px-1.5 py-0.5 rounded bg-accent-muted text-accent text-[11px] font-medium hover:bg-glacier-200 transition-colors cursor-pointer align-baseline"
      >
        <Sparkles className="w-2.5 h-2.5" />
        p.{citation.page}
      </button>
    )

    lastIndex = match.index + match[0].length
    citationCounter++
  }

  parts.push(content.slice(lastIndex))

  return <>{parts}</>
}
