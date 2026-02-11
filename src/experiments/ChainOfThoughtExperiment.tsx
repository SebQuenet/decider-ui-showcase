import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, Search, BarChart3, GitBranch, Layers, CheckCircle2,
  Play, Pause, RotateCcw, Clock, Brain, User, Bot, Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

type PhaseType = 'understanding' | 'research' | 'analysis' | 'reasoning' | 'synthesis' | 'conclusion'

interface ThinkingPhase {
  id: string
  type: PhaseType
  content: string
  keyInsights: string[]
}

interface PhaseVisualState {
  textPosition: number
  insightsRevealed: number
  status: 'pending' | 'streaming' | 'insights' | 'complete'
}

// ═══════════════════════════════════════════════════════════
// Phase configuration
// ═══════════════════════════════════════════════════════════

interface PhaseConfig {
  label: string
  icon: LucideIcon
  color: string
  colorAlpha: string
  colorDark: string
}

const PHASE_CONFIG: Record<PhaseType, PhaseConfig> = {
  understanding: { label: 'Compréhension', icon: Lightbulb, color: '#29abb5', colorAlpha: 'rgba(41,171,181,0.15)', colorDark: '#12323a' },
  research:      { label: 'Recherche',     icon: Search,     color: '#0ea5e9', colorAlpha: 'rgba(14,165,233,0.15)', colorDark: '#0c4a6e' },
  analysis:      { label: 'Analyse',       icon: BarChart3,  color: '#fe6d11', colorAlpha: 'rgba(254,109,17,0.15)', colorDark: '#441206' },
  reasoning:     { label: 'Raisonnement',  icon: GitBranch,  color: '#8b5cf6', colorAlpha: 'rgba(139,92,246,0.15)', colorDark: '#2e1065' },
  synthesis:     { label: 'Synthèse',      icon: Layers,     color: '#10b981', colorAlpha: 'rgba(16,185,129,0.15)', colorDark: '#064e3b' },
  conclusion:    { label: 'Conclusion',    icon: CheckCircle2, color: '#16a34a', colorAlpha: 'rgba(22,163,74,0.15)', colorDark: '#14532d' },
}

// ═══════════════════════════════════════════════════════════
// Mock data
// ═══════════════════════════════════════════════════════════

const MOCK_QUERY = "Analysez la performance du fonds Alpha Growth par rapport à ses pairs sur les 3 dernières années et recommandez une stratégie d'allocation optimale pour un investisseur institutionnel avec un horizon de 5 ans."

const MOCK_PHASES: ThinkingPhase[] = [
  {
    id: 'p1',
    type: 'understanding',
    content: `L'utilisateur demande une analyse comparative de performance et une recommandation d'allocation.

Éléments clés identifiés :
• Fonds cible : Alpha Growth
• Période : 3 ans historiques
• Univers : pairs même catégorie
• Profil : investisseur institutionnel
• Horizon : 5 ans

Cela nécessite une analyse quantitative (métriques de performance) ET qualitative (stratégie, équipe, processus).`,
    keyInsights: ['Analyse quanti + quali requise', 'Horizon 5 ans → focus stabilité'],
  },
  {
    id: 'p2',
    type: 'research',
    content: `Collecte des données disponibles...

• Fiche fonds Alpha Growth : stratégie equity growth, AUM 450M€, lancé 2018
• Base de données performance : rendements mensuels, NAV quotidienne
• Univers pairs identifié : 12 fonds equity growth européens, AUM > 200M€
• Sources additionnelles : reporting Q4 2024, prospectus, DICI
• Données benchmark : MSCI Europe Growth, STOXX 600`,
    keyInsights: ['12 fonds pairs identifiés', 'AUM 450M€', '5 sources de données'],
  },
  {
    id: 'p3',
    type: 'analysis',
    content: `Performance absolue Alpha Growth (3 ans) :
• Rendement cumulé : +47.2% vs +38.1% médiane pairs
• Rendement annualisé : 13.8% vs 11.4%
• Volatilité : 15.2% vs 14.8% (légèrement supérieure)
• Sharpe Ratio : 0.91 vs 0.77 → Premier quartile ✓
• Maximum Drawdown : -18.3% vs -16.7%
• Sortino : 1.24 vs 0.98 → Premier quartile ✓

Décomposition de la surperformance :
• Sélection de titres : +5.8% (principal moteur)
• Allocation sectorielle : +2.1%
• Effet devises : +1.2%
• Timing : -0.5% (légèrement négatif)`,
    keyInsights: ['Sharpe 0.91 — Premier quartile', 'Stock-picking = moteur principal (+5.8%)', 'Drawdown -18.3% > médiane'],
  },
  {
    id: 'p4',
    type: 'reasoning',
    content: `Points de force :
1. Surperformance constante sur 1Y, 2Y, 3Y → pas d'effet one-shot
2. Sortino nettement supérieur → meilleure gestion du downside risk
3. Alpha porté par le stock-picking → compétence fondamentale, pas de biais macro

Points de vigilance :
1. Drawdown > pairs → risque de perte ponctuelle plus élevé
2. AUM +60% en 2 ans → risque de capacity constraint
3. Concentration top 10 = 52% → risque spécifique élevé

Pour un investisseur institutionnel horizon 5 ans :
→ Le profil rendement/risque est favorable (Sharpe > 0.9)
→ La régularité de la surperformance est rassurante
→ Le risque de capacité doit être monitoré
→ La concentration nécessite une diversification complémentaire`,
    keyInsights: ['Surperformance constante ≠ one-shot', 'Risque capacité : AUM +60%', 'Concentration top 10 = 52%'],
  },
  {
    id: 'p5',
    type: 'synthesis',
    content: `Proposition d'allocation portefeuille institutionnel :

• Alpha Growth : 8-12% de la poche actions
• Complément défensif (value/dividend) : 6-8%
• Diversification géographique (hors Europe) : 5-7%
• Satellite (small caps) : 3-5%

Cette allocation capture l'alpha du fonds tout en limitant le risque de concentration.
Rééquilibrage recommandé : trimestriel, tolérance ±2%.`,
    keyInsights: ['Allocation cible : 8-12%', 'Rééquilibrage trimestriel'],
  },
  {
    id: 'p6',
    type: 'conclusion',
    content: `Alpha Growth est un fonds premier quartile avec un track record solide et une surperformance régulière portée par le stock-picking.

Pour un investisseur institutionnel horizon 5 ans : allocation de 8-12% dans la poche actions, complétée par des positions défensives et diversifiées.

Point de vigilance principal : la croissance rapide des encours (+60% en 2 ans) à surveiller trimestriellement.`,
    keyInsights: ['Recommandation : investir avec diversification complémentaire'],
  },
]

const MOCK_FINAL_ANSWER = `**Alpha Growth** affiche un rendement cumulé de **+47.2%** sur 3 ans (13.8% annualisé), le plaçant dans le **premier quartile** de sa catégorie avec un Sharpe de 0.91.

La surperformance est portée par la **sélection de titres** (+5.8%), démontrant une compétence fondamentale de l'équipe de gestion.

**Allocation recommandée** pour un institutionnel (horizon 5 ans) :

| Composante | Allocation |
|---|---|
| Alpha Growth | 8-12% |
| Défensif (value/dividend) | 6-8% |
| Géographique (hors Europe) | 5-7% |
| Satellite (small caps) | 3-5% |

⚠️ **Point de vigilance** : encours en forte croissance (+60% en 2 ans). Monitoring trimestriel de la capacité recommandé.`

// ═══════════════════════════════════════════════════════════
// Animation constants
// ═══════════════════════════════════════════════════════════

const CHARS_PER_MS = 0.18
const INSIGHT_GAP_MS = 450
const PHASE_GAP_MS = 700
const ANSWER_CHARS_PER_MS = 0.12

// ═══════════════════════════════════════════════════════════
// Pure computation: elapsed time → visual state
// ═══════════════════════════════════════════════════════════

function computePhaseStates(elapsedMs: number, phases: ThinkingPhase[]): PhaseVisualState[] {
  const states: PhaseVisualState[] = []
  let cursor = 0

  for (const phase of phases) {
    const textDuration = phase.content.length / CHARS_PER_MS
    const insightCount = phase.keyInsights.length
    const insightDuration = insightCount * INSIGHT_GAP_MS

    if (elapsedMs <= cursor) {
      states.push({ textPosition: 0, insightsRevealed: 0, status: 'pending' })
    } else if (elapsedMs <= cursor + textDuration) {
      const pos = Math.floor((elapsedMs - cursor) * CHARS_PER_MS)
      states.push({ textPosition: Math.min(pos, phase.content.length), insightsRevealed: 0, status: 'streaming' })
    } else if (elapsedMs <= cursor + textDuration + insightDuration) {
      const insightElapsed = elapsedMs - cursor - textDuration
      const revealed = Math.min(Math.floor(insightElapsed / INSIGHT_GAP_MS) + 1, insightCount)
      states.push({ textPosition: phase.content.length, insightsRevealed: revealed, status: 'insights' })
    } else {
      states.push({ textPosition: phase.content.length, insightsRevealed: insightCount, status: 'complete' })
    }

    cursor += textDuration + insightDuration + PHASE_GAP_MS
  }

  return states
}

function computeTotalDuration(phases: ThinkingPhase[]): number {
  return phases.reduce((acc, phase) => {
    const textDuration = phase.content.length / CHARS_PER_MS
    const insightDuration = phase.keyInsights.length * INSIGHT_GAP_MS
    return acc + textDuration + insightDuration + PHASE_GAP_MS
  }, 0)
}

// ═══════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════

function TimelineNode({ config, status }: { config: PhaseConfig; status: PhaseVisualState['status'] }) {
  const Icon = config.icon
  const isActive = status === 'streaming' || status === 'insights'
  const isDone = status === 'complete'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
      {/* Pulse ring for active node */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0 0px ${config.color}60`,
              `0 0 18px 6px ${config.color}25`,
              `0 0 0 0px ${config.color}60`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Activation burst */}
      {isActive && (
        <motion.div
          key={`burst-${config.label}`}
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ backgroundColor: config.color }}
        />
      )}

      {/* Node circle */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: isActive || isDone ? config.color : '#41414b',
          border: isActive ? `2px solid ${config.color}` : '2px solid transparent',
        }}
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {isDone ? (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        ) : (
          <Icon className="w-5 h-5" style={{ color: isActive || isDone ? '#ffffff' : '#91919f' }} />
        )}
      </motion.div>
    </div>
  )
}

function PhaseCard({
  phase,
  config,
  visualState,
  index,
}: {
  phase: ThinkingPhase
  config: PhaseConfig
  visualState: PhaseVisualState
  index: number
}) {
  const isActive = visualState.status === 'streaming' || visualState.status === 'insights'
  const isPending = visualState.status === 'pending'
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isActive])

  if (isPending) {
    return (
      <div ref={cardRef} className="ml-3 py-2">
        <span className="text-sm font-medium" style={{ color: '#737384' }}>
          {config.label}
        </span>
      </div>
    )
  }

  const displayText = phase.content.slice(0, visualState.textPosition)
  const isStreaming = visualState.status === 'streaming'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="ml-3 mb-2 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isActive ? `${config.color}10` : 'rgba(65,65,75,0.3)',
        borderLeft: `3px solid ${isActive ? config.color : config.color + '60'}`,
        boxShadow: isActive ? `inset 0 0 30px ${config.color}08, -4px 0 20px -8px ${config.color}20` : 'none',
      }}
    >
      {/* Phase header */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span className="text-sm font-semibold" style={{ color: config.color }}>
          {config.label}
        </span>
        {isStreaming && (
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: config.color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Phase content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#d9d9de' }}>
          {displayText}
          {isStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 ml-0.5 align-middle rounded-full"
              style={{ backgroundColor: config.color }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </p>

        {/* Key insights */}
        {visualState.insightsRevealed > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {phase.keyInsights.slice(0, visualState.insightsRevealed).map((insight, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                  delay: i * 0.05,
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: config.colorAlpha,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: config.color }} />
                {insight}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ProgressHeader({
  elapsedMs,
  progress,
  currentPhaseIndex,
  totalPhases,
  activeColor,
  status,
}: {
  elapsedMs: number
  progress: number
  currentPhaseIndex: number
  totalPhases: number
  activeColor: string
  status: 'idle' | 'thinking' | 'answering' | 'done'
}) {
  const isThinking = status === 'thinking'

  return (
    <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Brain icon with glow */}
      <div className="relative">
        {isThinking && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 8px 2px ${activeColor}40`,
                `0 0 16px 4px ${activeColor}20`,
                `0 0 8px 2px ${activeColor}40`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div
          className="relative flex items-center justify-center w-8 h-8 rounded-full"
          style={{ backgroundColor: isThinking ? `${activeColor}20` : 'rgba(65,65,75,0.5)' }}
        >
          <Brain className="w-4 h-4" style={{ color: isThinking ? activeColor : '#737384' }} />
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" style={{ color: '#91919f' }} />
        <span className="text-sm font-mono tabular-nums" style={{ color: '#b8b8c1' }}>
          {(elapsedMs / 1000).toFixed(1)}s
        </span>
      </div>

      {/* Phase counter */}
      <span className="text-xs font-medium" style={{ color: '#91919f' }}>
        Phase {Math.min(currentPhaseIndex + 1, totalPhases)}/{totalPhases}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: activeColor }}
          animate={{ width: `${Math.min(progress * 100, 100)}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        >
          {/* Shimmer effect */}
          {isThinking && (
            <motion.div
              className="absolute inset-y-0 w-1/3"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
              }}
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>

      {status === 'done' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#16a34a20', color: '#16a34a' }}
        >
          Terminé
        </motion.span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════

export function ChainOfThoughtExperiment() {
  const [status, setStatus] = useState<'idle' | 'thinking' | 'answering' | 'done'>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [answerPosition, setAnswerPosition] = useState(0)

  const accumulatedRef = useRef(0)
  const lastTickRef = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const totalDuration = useMemo(() => computeTotalDuration(MOCK_PHASES), [])

  const phaseStates = useMemo(() => {
    if (status === 'idle') return MOCK_PHASES.map(() => ({ textPosition: 0, insightsRevealed: 0, status: 'pending' as const }))
    if (status === 'answering' || status === 'done') {
      return MOCK_PHASES.map((p) => ({
        textPosition: p.content.length,
        insightsRevealed: p.keyInsights.length,
        status: 'complete' as const,
      }))
    }
    return computePhaseStates(elapsedMs, MOCK_PHASES)
  }, [status, elapsedMs])

  const currentPhaseIndex = useMemo(() => {
    const activeIdx = phaseStates.findIndex((s) => s.status === 'streaming' || s.status === 'insights')
    if (activeIdx >= 0) return activeIdx
    const lastComplete = phaseStates.reduce((last, s, i) => (s.status === 'complete' ? i : last), -1)
    return lastComplete >= 0 ? lastComplete : 0
  }, [phaseStates])

  const activeColor = PHASE_CONFIG[MOCK_PHASES[currentPhaseIndex].type].color

  const progress = status === 'idle' ? 0 : status === 'thinking' ? elapsedMs / totalDuration : 1

  // Thinking animation loop
  useEffect(() => {
    if (status !== 'thinking' || paused) return

    lastTickRef.current = performance.now()
    let animFrame: number

    function tick() {
      const now = performance.now()
      const delta = (now - lastTickRef.current) * speed
      lastTickRef.current = now

      accumulatedRef.current += delta
      const current = accumulatedRef.current

      if (current >= totalDuration) {
        setElapsedMs(totalDuration)
        setStatus('answering')
        return
      }

      setElapsedMs(current)
      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [status, paused, speed, totalDuration])

  // Answer streaming loop
  useEffect(() => {
    if (status !== 'answering') return

    let animFrame: number
    let lastTime = performance.now()

    function tick() {
      const now = performance.now()
      const delta = (now - lastTime) * speed
      lastTime = now

      setAnswerPosition((prev) => {
        const next = prev + delta * ANSWER_CHARS_PER_MS
        if (next >= MOCK_FINAL_ANSWER.length) {
          setStatus('done')
          return MOCK_FINAL_ANSWER.length
        }
        return next
      })

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [status, speed])

  function handleStart() {
    accumulatedRef.current = 0
    setElapsedMs(0)
    setAnswerPosition(0)
    setPaused(false)
    setStatus('thinking')
  }

  function handleReset() {
    accumulatedRef.current = 0
    setElapsedMs(0)
    setAnswerPosition(0)
    setPaused(false)
    setStatus('idle')
  }

  function handleTogglePause() {
    setPaused((prev) => !prev)
  }

  const isRunning = status === 'thinking' || status === 'answering'

  return (
    <div className="h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-glacier-500 to-glacier-700">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Chain of Thought</h2>
            <p className="text-xs text-text-muted">Visualisation du raisonnement par phases</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Speed control */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="font-medium tabular-nums w-8 text-right">{speed.toFixed(1)}x</span>
            <input
              type="range"
              min="0.3"
              max="4"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 h-1 accent-glacier-500 cursor-pointer"
            />
          </div>

          {/* Pause/resume */}
          {isRunning && (
            <button
              onClick={handleTogglePause}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-surface-tertiary transition-colors cursor-pointer"
            >
              {paused ? <Play className="w-4 h-4 text-text-secondary" /> : <Pause className="w-4 h-4 text-text-secondary" />}
            </button>
          )}

          {/* Reset */}
          {status !== 'idle' && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-surface-tertiary transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-text-secondary" />
            </button>
          )}

          {/* Start */}
          {status === 'idle' && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-glacier-500 to-glacier-600 text-white text-sm font-medium hover:from-glacier-600 hover:to-glacier-700 transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4" />
              Lancer la démo
            </button>
          )}
        </div>
      </div>

      {/* Main scrollable area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
          {/* User message */}
          <div className="flex gap-3">
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-glacier-600">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-glacier-600 rounded-2xl rounded-tl-md px-4 py-3">
              <p className="text-sm text-white leading-relaxed">{MOCK_QUERY}</p>
            </div>
          </div>

          {/* Thinking container */}
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, #1a1a1f 0%, #12323a 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Progress header */}
                <ProgressHeader
                  elapsedMs={elapsedMs}
                  progress={progress}
                  currentPhaseIndex={currentPhaseIndex}
                  totalPhases={MOCK_PHASES.length}
                  activeColor={activeColor}
                  status={status}
                />

                {/* Timeline + phases */}
                <div className="px-5 py-4">
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div
                      className="absolute top-5 bottom-5 w-px"
                      style={{ left: 19, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    />
                    {/* Colored progress line */}
                    <motion.div
                      className="absolute top-5 w-px origin-top"
                      style={{
                        left: 19,
                        backgroundColor: activeColor,
                        boxShadow: `0 0 8px ${activeColor}40`,
                      }}
                      animate={{
                        height: `${Math.min(progress * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Phase items */}
                    <div className="space-y-4">
                      {MOCK_PHASES.map((phase, index) => {
                        const config = PHASE_CONFIG[phase.type]
                        const visualState = phaseStates[index]

                        return (
                          <div key={phase.id} className="relative flex gap-3">
                            {/* Timeline node */}
                            <div className="shrink-0 relative z-10">
                              <TimelineNode config={config} status={visualState.status} />
                            </div>

                            {/* Phase content */}
                            <div className="flex-1 min-w-0 pt-1.5">
                              <PhaseCard
                                phase={phase}
                                config={config}
                                visualState={visualState}
                                index={index}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final answer */}
          <AnimatePresence>
            {(status === 'answering' || status === 'done') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3"
              >
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-surface-tertiary border border-border">
                  <Bot className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="flex-1 bg-surface-tertiary rounded-2xl rounded-tl-md px-4 py-3 border border-border-muted">
                  <AnswerContent text={MOCK_FINAL_ANSWER} position={Math.floor(answerPosition)} isDone={status === 'done'} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle state prompt */}
          {status === 'idle' && (
            <div className="flex items-center justify-center py-16">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-3"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-surface-tertiary border border-border">
                  <Brain className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">
                  Cliquez sur <span className="font-medium text-text-secondary">"Lancer la démo"</span> pour visualiser le raisonnement
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Simple answer renderer (markdown-like)
// ═══════════════════════════════════════════════════════════

function AnswerContent({ text, position, isDone }: { text: string; position: number; isDone: boolean }) {
  const displayText = text.slice(0, position)

  const rendered = useMemo(() => {
    const lines = displayText.split('\n')
    const elements: React.ReactNode[] = []

    let inTable = false
    let tableRows: string[][] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Table detection
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true
          tableRows = []
        }
        if (!line.match(/^\|[\s-|]+\|$/)) {
          const cells = line.split('|').filter(Boolean).map((c) => c.trim())
          tableRows.push(cells)
        }
        // Flush table if next line isn't a table row
        if (i === lines.length - 1 || !(lines[i + 1]?.startsWith('|') && lines[i + 1]?.endsWith('|'))) {
          elements.push(
            <table key={`table-${i}`} className="w-full text-sm my-2 border-collapse">
              <thead>
                <tr>
                  {tableRows[0]?.map((cell, j) => (
                    <th key={j} className="text-left px-3 py-1.5 font-medium text-text-primary border-b border-border">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 text-text-secondary border-b border-border-muted">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>,
          )
          inTable = false
          tableRows = []
        }
        continue
      }

      if (line === '') {
        elements.push(<div key={i} className="h-2" />)
      } else {
        const formatted = formatInlineMarkdown(line)
        elements.push(
          <p key={i} className="text-sm leading-relaxed text-text-secondary">
            {formatted}
          </p>,
        )
      }
    }

    return elements
  }, [displayText])

  return (
    <div>
      {rendered}
      {!isDone && (
        <motion.span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle rounded-full bg-text-secondary"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </div>
  )
}

function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>)
      }
      parts.push(
        <strong key={key++} className="font-semibold text-text-primary">
          {boldMatch[1]}
        </strong>,
      )
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }

    parts.push(<span key={key++}>{remaining}</span>)
    break
  }

  return parts
}
