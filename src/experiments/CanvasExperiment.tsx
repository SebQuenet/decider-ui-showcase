import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scissors,
  Expand,
  RefreshCw,
  Languages,
  SpellCheck,
  Code,
  FileText,
  MessageSquare,
  Loader2,
  Wand2,
  ArrowRightLeft,
  BookOpen,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Toggle } from '../components/ui/Toggle.tsx'
import { Select } from '../components/ui/Select.tsx'

const INITIAL_TEXT = `Le fonds Alpha Growth Fund a démontré une performance remarquable au cours du dernier exercice fiscal. Avec un rendement net de 18,4%, il surpasse significativement son indice de référence, le MSCI Europe Mid Cap, qui n'a progressé que de 12,1% sur la même période. Cette surperformance de 630 points de base s'explique principalement par une allocation sectorielle judicieuse et une sélection de titres rigoureuse.

L'analyse détaillée du portefeuille révèle une concentration notable dans les secteurs de la technologie (28%) et de la santé (22%), qui ont été les principaux moteurs de performance. La stratégie d'investissement privilégie les entreprises à forte croissance organique, avec un chiffre d'affaires récurrent supérieur à 60%. Le ratio de Sharpe du fonds s'établit à 1,42, témoignant d'un excellent rapport rendement-risque.

En termes de gestion des risques, le fonds maintient une volatilité annualisée de 14,2%, inférieure à celle de son indice de référence (15,8%). Le drawdown maximum observé sur la période est de -8,3%, ce qui reste contenu par rapport aux standards du marché. La diversification géographique couvre principalement la France (35%), l'Allemagne (25%) et les pays nordiques (20%), avec une exposition résiduelle au Royaume-Uni post-Brexit.`

const CODE_SNIPPET = `interface PortfolioAnalysis {
  fundId: string
  period: [Date, Date]
  metrics: {
    irr: number
    tvpiMultiple: number
    dpiMultiple: number
    volatility: number
    sharpeRatio: number
  }
}

export function analyzePortfolio(
  holdings: Holding[],
  benchmark: string,
): PortfolioAnalysis {
  const metrics = computeMetrics(holdings)
  const benchmarkData = fetchBenchmark(benchmark)

  const alpha = metrics.returns - benchmarkData.returns
  const trackingError = computeTrackingError(
    holdings, benchmarkData
  )

  return {
    fundId: holdings[0].fundId,
    period: [holdings[0].date, holdings[holdings.length - 1].date],
    metrics: {
      irr: metrics.irr,
      tvpiMultiple: metrics.tvpi,
      dpiMultiple: metrics.dpi,
      volatility: metrics.vol,
      sharpeRatio: alpha / trackingError,
    },
  }
}`

const MOCK_REPLACEMENTS: Record<string, string> = {
  Raccourcir: 'Le fonds Alpha Growth Fund affiche un rendement net de 18,4%, surpassant son indice de 630 pb.',
  Développer: 'Le fonds Alpha Growth Fund, géré par l\'équipe de gestion actions européennes depuis 2018, a démontré une performance remarquable et constante au cours du dernier exercice fiscal, confirmant ainsi la pertinence de sa stratégie d\'investissement centrée sur les entreprises de croissance à capitalisation moyenne.',
  Reformuler: 'Au cours de l\'exercice écoulé, le fonds Alpha Growth Fund s\'est distingué par des résultats particulièrement solides, enregistrant une progression nette de 18,4%.',
  'Traduire (EN)': 'The Alpha Growth Fund demonstrated remarkable performance over the last fiscal year. With a net return of 18.4%, it significantly outperformed its benchmark.',
  Corriger: 'Le fonds Alpha Growth Fund a démontré une performance remarquable au cours du dernier exercice fiscal.',
}

const CODE_REPLACEMENTS: Record<string, string> = {
  Refactorer: `// Refactorisé avec séparation des responsabilités
interface PortfolioMetrics {
  irr: number
  tvpi: number
  dpi: number
  volatility: number
  sharpe: number
}

function extractMetrics(holdings: Holding[]): PortfolioMetrics {
  const raw = computeMetrics(holdings)
  return { irr: raw.irr, tvpi: raw.tvpi, dpi: raw.dpi, volatility: raw.vol, sharpe: 0 }
}`,
  'Convertir (Python)': `from dataclasses import dataclass
from typing import Tuple
from datetime import date

@dataclass
class PortfolioAnalysis:
    fund_id: str
    period: Tuple[date, date]
    irr: float
    tvpi_multiple: float
    dpi_multiple: float
    volatility: float
    sharpe_ratio: float

def analyze_portfolio(holdings: list, benchmark: str) -> PortfolioAnalysis:
    metrics = compute_metrics(holdings)
    benchmark_data = fetch_benchmark(benchmark)
    alpha = metrics.returns - benchmark_data.returns
    tracking_error = compute_tracking_error(holdings, benchmark_data)
    return PortfolioAnalysis(...)`,
  Documenter: `/**
 * Analyse un portefeuille d'investissement par rapport à un indice de référence.
 * Calcule les métriques de performance (IRR, TVPI, DPI) et de risque
 * (volatilité, ratio de Sharpe) sur la période couverte par les positions.
 * @param holdings - Positions du portefeuille triées par date
 * @param benchmark - Identifiant de l'indice de référence (ex: "MSCI World")
 * @returns Analyse complète incluant les métriques clés
 */
export function analyzePortfolio(...)`,
  Optimiser: `// Optimisé : mise en cache et calculs parallèles
const metricsCache = new Map<string, PortfolioAnalysis>()

export async function analyzePortfolio(
  holdings: Holding[],
  benchmark: string,
): Promise<PortfolioAnalysis> {
  const cacheKey = \`\${holdings[0].fundId}_\${benchmark}\`
  if (metricsCache.has(cacheKey)) return metricsCache.get(cacheKey)!

  const [metrics, benchmarkData] = await Promise.all([
    computeMetricsAsync(holdings),
    fetchBenchmark(benchmark),
  ])
  const result = buildAnalysis(metrics, benchmarkData, holdings)
  metricsCache.set(cacheKey, result)
  return result
}`,
}

const AI_COMMENTS = [
  { paragraph: 0, comment: 'Ce paragraphe pourrait être plus concis. Les chiffres clés pourraient être présentés sous forme de tableau.' },
  { paragraph: 1, comment: 'Bonne analyse sectorielle. Suggestion : ajouter la performance relative de chaque secteur.' },
  { paragraph: 2, comment: 'La section risque manque d\'une analyse de corrélation avec les marchés émergents.' },
]

const GHOST_SUGGESTIONS = [
  ' En conséquence, les perspectives pour le prochain trimestre restent favorables.',
  ' Cette dynamique devrait se poursuivre au regard des fondamentaux actuels.',
  ' Les analystes anticipent une continuation de cette tendance haussière.',
]

const TONE_OPTIONS = ['Professionnel', 'Décontracté', 'Académique', 'Technique'] as const
const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

interface DiffOverlay {
  oldText: string
  newText: string
}

interface FloatingToolbarPosition {
  top: number
  left: number
}

export function CanvasExperiment() {
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [textContent, setTextContent] = useState(INITIAL_TEXT)
  const [codeContent, setCodeContent] = useState(CODE_SNIPPET)
  const [selectedText, setSelectedText] = useState('')
  const [toolbarPosition, setToolbarPosition] = useState<FloatingToolbarPosition | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [tone, setTone] = useState<string>('Professionnel')
  const [language, setLanguage] = useState('fr')
  const [ghostText, setGhostText] = useState('')
  const [hoveredComment, setHoveredComment] = useState<number | null>(null)
  const [diffOverlay, setDiffOverlay] = useState<DiffOverlay | null>(null)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !containerRef.current) {
      setToolbarPosition(null)
      setSelectedText('')
      return
    }

    const text = selection.toString().trim()
    if (!text) {
      setToolbarPosition(null)
      setSelectedText('')
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    setSelectedText(text)
    setToolbarPosition({
      top: rect.top - containerRect.top - 50,
      left: rect.left - containerRect.left + rect.width / 2,
    })
  }, [])

  function handleToolbarAction(action: string): void {
    if (!selectedText) return
    setLoadingAction(action)

    setTimeout(() => {
      const replacements = isCodeMode ? CODE_REPLACEMENTS : MOCK_REPLACEMENTS
      const newText = replacements[action] ?? selectedText

      setDiffOverlay({ oldText: selectedText, newText })
      setLoadingAction(null)
      setToolbarPosition(null)

      setTimeout(() => {
        if (isCodeMode) {
          setCodeContent((previous) => previous.replace(selectedText, newText))
        } else {
          setTextContent((previous) => previous.replace(selectedText, newText))
        }
        setDiffOverlay(null)
        setSelectedText('')
      }, 2000)
    }, 1200)
  }

  function handleEditorInput(value: string): void {
    setTextContent(value)
    if (value.endsWith(' ') && value.length > textContent.length) {
      const suggestion = GHOST_SUGGESTIONS[Math.floor(Math.random() * GHOST_SUGGESTIONS.length)]
      setGhostText(suggestion)
    } else {
      setGhostText('')
    }
  }

  function handleEditorKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Tab' && ghostText) {
      event.preventDefault()
      setTextContent((previous) => previous + ghostText)
      setGhostText('')
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection)
    return () => document.removeEventListener('mouseup', handleTextSelection)
  }, [handleTextSelection])

  const textToolbarActions = [
    { id: 'Raccourcir', icon: Scissors, label: 'Raccourcir' },
    { id: 'Développer', icon: Expand, label: 'Développer' },
    { id: 'Reformuler', icon: RefreshCw, label: 'Reformuler' },
    { id: 'Traduire (EN)', icon: Languages, label: 'Traduire' },
    { id: 'Corriger', icon: SpellCheck, label: 'Corriger' },
  ]

  const codeToolbarActions = [
    { id: 'Refactorer', icon: Wand2, label: 'Refactorer' },
    { id: 'Convertir (Python)', icon: ArrowRightLeft, label: 'Convertir' },
    { id: 'Documenter', icon: BookOpen, label: 'Documenter' },
    { id: 'Optimiser', icon: Zap, label: 'Optimiser' },
  ]

  const toolbarActions = isCodeMode ? codeToolbarActions : textToolbarActions
  const paragraphs = textContent.split('\n\n')

  return (
    <div className="w-full h-full flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div ref={containerRef} className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-body font-semibold text-text-primary">Canvas IA</h2>
              <p className="text-small text-text-muted">Edition assistee par intelligence artificielle</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Toggle
              checked={isCodeMode}
              onChange={setIsCodeMode}
              label={isCodeMode ? 'Code' : 'Texte'}
            />
            <Code className="w-4 h-4 text-text-muted" />
          </div>
        </div>

        {/* Floating toolbar */}
        <AnimatePresence>
          {toolbarPosition && selectedText && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="absolute z-30 bg-surface-inverse text-text-inverse rounded-lg shadow-xl px-1 py-1 flex gap-0.5"
              style={{
                top: Math.max(0, toolbarPosition.top),
                left: toolbarPosition.left,
                transform: 'translateX(-50%)',
              }}
            >
              {toolbarActions.map((action) => {
                const Icon = action.icon
                const isLoading = loadingAction === action.id
                return (
                  <button
                    key={action.id}
                    onClick={() => handleToolbarAction(action.id)}
                    disabled={!!loadingAction}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-small font-medium hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    {action.label}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diff overlay */}
        <AnimatePresence>
          {diffOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-6 top-20 z-20 bg-surface border border-border rounded-lg shadow-lg p-4"
            >
              <p className="text-small font-medium text-text-muted mb-2">Modification en cours...</p>
              <div className="space-y-2">
                <div className="bg-danger-muted p-2 rounded text-body line-through text-danger">
                  {diffOverlay.oldText.slice(0, 120)}...
                </div>
                <div className="bg-success-muted p-2 rounded text-body text-success">
                  {diffOverlay.newText.slice(0, 120)}...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {isCodeMode ? (
            <pre className="font-mono text-caption bg-carbon-950 text-carbon-100 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {codeContent}
            </pre>
          ) : (
            <div className="relative">
              {paragraphs.map((paragraph, index) => {
                const commentData = AI_COMMENTS.find((c) => c.paragraph === index)
                return (
                  <div key={index} className="relative group mb-4">
                    <p className="text-body leading-relaxed text-text-primary pr-8">
                      {paragraph}
                    </p>
                    {commentData && (
                      <div
                        className="absolute -right-2 top-0"
                        onMouseEnter={() => setHoveredComment(index)}
                        onMouseLeave={() => setHoveredComment(null)}
                      >
                        <div className="w-5 h-5 rounded-full bg-warning-muted border-2 border-warning flex items-center justify-center cursor-pointer">
                          <MessageSquare className="w-3 h-3 text-warning" />
                        </div>
                        <AnimatePresence>
                          {hoveredComment === index && (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              className="absolute right-8 top-0 w-64 bg-warning-muted border border-warning/30 rounded-lg p-3 shadow-lg z-10"
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <Wand2 className="w-3 h-3 text-warning" />
                                <span className="text-small font-medium text-warning">Suggestion IA</span>
                              </div>
                              <p className="text-small text-text-primary">{commentData.comment}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Ghost text input */}
              <div className="relative mt-4">
                <textarea
                  ref={editorRef}
                  value={textContent}
                  onChange={(event) => handleEditorInput(event.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  className="w-full h-40 bg-surface-secondary border border-border rounded-lg p-4 text-body text-text-primary resize-none outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="Continuez a ecrire..."
                />
                {ghostText && (
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <p className="text-body text-text-muted/40 whitespace-pre-wrap">
                      {textContent}
                      <span className="text-accent/40">{ghostText}</span>
                    </p>
                    <Badge variant="info" size="sm" className="mt-1">
                      Tab pour accepter
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 border-l border-border bg-surface-secondary flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-caption font-semibold text-text-primary">Ajustements</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
          {/* Tone selector */}
          <div>
            <p className="text-small font-medium text-text-secondary mb-2">Ton</p>
            <div className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setTone(option)}
                  className={`px-3 py-2 rounded-lg text-small font-medium transition-colors cursor-pointer ${
                    tone === option
                      ? 'bg-accent text-text-inverse'
                      : 'bg-surface border border-border text-text-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Language selector */}
          <Select
            label="Langue"
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          />

          {/* Apply button */}
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => {
              setDiffOverlay({
                oldText: 'Texte original...',
                newText: `Texte adapte au ton ${tone} en ${LANGUAGE_OPTIONS.find((l) => l.value === language)?.label}...`,
              })
              setTimeout(() => setDiffOverlay(null), 2000)
            }}
          >
            <Wand2 className="w-4 h-4" />
            Appliquer au texte
          </Button>

          {/* Stats */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-small font-medium text-text-secondary">Statistiques</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface rounded-lg p-2.5 border border-border">
                <p className="text-small text-text-muted">Mots</p>
                <p className="text-body font-semibold text-text-primary font-data">
                  {textContent.split(/\s+/).filter(Boolean).length}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-2.5 border border-border">
                <p className="text-small text-text-muted">Caracteres</p>
                <p className="text-body font-semibold text-text-primary font-data">
                  {textContent.length}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-2.5 border border-border">
                <p className="text-small text-text-muted">Paragraphes</p>
                <p className="text-body font-semibold text-text-primary font-data">
                  {paragraphs.length}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-2.5 border border-border">
                <p className="text-small text-text-muted">Suggestions</p>
                <p className="text-body font-semibold text-text-primary font-data">
                  {AI_COMMENTS.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
