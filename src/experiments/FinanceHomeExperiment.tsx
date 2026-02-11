import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, TrendingUp, Bell, Search, FileText,
  BarChart3, Upload, Plus, MessageSquare,
  X, Minus, Maximize2, GripVertical, BookOpen, ChevronRight,
  Sparkles, CheckCircle2, Circle, ArrowUpRight, ArrowDownRight,
  Info,
} from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants, smoothTransition } from '../lib/animations'

// --- Types ---

type ExpertiseLevel = 'beginner' | 'intermediate' | 'expert'

interface PortfolioFund {
  name: string
  aum: number
  performance: number
  status: 'active' | 'closed'
}

interface AlertItem {
  id: string
  title: string
  severity: 'critical' | 'major' | 'minor' | 'info'
  timestamp: string
}

interface MarketIndex {
  name: string
  value: number
  change: number
}

interface RecentAnalysis {
  id: string
  title: string
  timestamp: string
  type: string
}

interface GlossaryTerm {
  term: string
  definition: string
  example: string
}

interface PromptCard {
  category: string
  prompts: string[]
}

interface WidgetState {
  visible: boolean
  minimized: boolean
}

// --- Donnees mock ---

const PORTFOLIO_FUNDS: PortfolioFund[] = [
  { name: 'Alpha Capital', aum: 342, performance: 14.2, status: 'active' },
  { name: 'Beta Growth', aum: 285, performance: 11.8, status: 'active' },
  { name: 'Gamma Income', aum: 215, performance: -2.3, status: 'active' },
]

const ALERTS: AlertItem[] = [
  { id: '1', title: 'NAV Alpha Capital depasse le seuil de 350 M', severity: 'info', timestamp: 'Il y a 2h' },
  { id: '2', title: 'Ecart de performance Beta Growth vs benchmark', severity: 'major', timestamp: 'Il y a 5h' },
  { id: '3', title: 'Data room Gamma Income : document manquant', severity: 'minor', timestamp: 'Hier' },
  { id: '4', title: 'Alerte presse : restructuration equipe Delta', severity: 'critical', timestamp: 'Il y a 30min' },
]

const MARKET_INDICES: MarketIndex[] = [
  { name: 'CAC 40', value: 7892.45, change: 0.82 },
  { name: 'S&P 500', value: 5234.18, change: -0.34 },
  { name: 'MSCI Europe', value: 1945.67, change: 0.15 },
]

const RECENT_ANALYSES: RecentAnalysis[] = [
  { id: '1', title: 'Due Diligence Alpha Capital', timestamp: 'Aujourd\'hui 14:30', type: 'DD' },
  { id: '2', title: 'Scoring Beta Growth Q4', timestamp: 'Hier 16:45', type: 'Scoring' },
  { id: '3', title: 'Analyse contradictions Gamma', timestamp: 'Avant-hier', type: 'Contradictions' },
  { id: '4', title: 'Reporting trimestriel Q4 2024', timestamp: '3 jan. 2025', type: 'Reporting' },
]

const GLOSSARY: GlossaryTerm[] = [
  { term: 'IRR', definition: 'Internal Rate of Return - Taux de rendement interne. Mesure de rentabilite annualisee d\'un investissement.', example: 'Un fonds avec un IRR de 15% a genere 15% de rendement annualise.' },
  { term: 'TVPI', definition: 'Total Value to Paid-In - Ratio valeur totale sur capital investi. Mesure le multiple global du fonds.', example: 'Un TVPI de 1.5x signifie que pour 1 EUR investi, la valeur totale est de 1.5 EUR.' },
  { term: 'DPI', definition: 'Distributions to Paid-In - Ratio distributions sur capital investi. Mesure les retours effectivement distribues.', example: 'Un DPI de 0.8x indique que 80% du capital investi a ete redistribue.' },
  { term: 'NAV', definition: 'Net Asset Value - Valeur liquidative nette. Valeur totale des actifs moins les passifs.', example: 'La NAV du fonds est de 150 M EUR au 31 decembre.' },
  { term: 'Carried Interest', definition: 'Part des profits reversee aux gestionnaires du fonds, generalement 20% au-dela du hurdle rate.', example: 'Avec un carry de 20% et un hurdle de 8%, le GP recoit 20% des profits au-dela de 8%.' },
  { term: 'Hurdle Rate', definition: 'Taux de rendement minimum que le fonds doit atteindre avant que le carried interest ne soit applicable.', example: 'Avec un hurdle de 8%, les LPs recoivent 8% de rendement avant tout partage de profits.' },
  { term: 'J-Curve', definition: 'Courbe en J typique des fonds de PE ou les rendements sont negatifs en debut de vie avant de devenir positifs.', example: 'Les 3 premieres annees montrent des rendements negatifs avant un retournement positif.' },
  { term: 'Drawdown', definition: 'Appel de fonds - Capital appele aux investisseurs par le fonds pour realiser des investissements.', example: 'Le fonds a procede a un drawdown de 25 M EUR pour financer l\'acquisition.' },
]

const BUSINESS_PROMPTS: PromptCard[] = [
  {
    category: 'Due Diligence',
    prompts: [
      'Analyser la data room du fonds Alpha Capital',
      'Evaluer les risques operationnels de Beta Growth',
      'Verifier les contradictions dans les documents DD',
    ],
  },
  {
    category: 'Performance',
    prompts: [
      'Comparer la performance de mes 3 fonds sur 5 ans',
      'Calculer l\'IRR net de Alpha Capital depuis inception',
      'Analyser le drawdown maximal du portefeuille',
    ],
  },
  {
    category: 'Reporting',
    prompts: [
      'Generer un factsheet pour Alpha Capital',
      'Preparer le reporting Q4 2024 pour les investisseurs',
      'Creer une synthese ESG du portefeuille',
    ],
  },
]

const ONBOARDING_STEPS = [
  { label: 'Configurer profil', done: true },
  { label: 'Explorer les donnees demo', done: false, current: true },
  { label: 'Lancer une analyse', done: false },
  { label: 'Personnaliser le dashboard', done: false },
]

const SEVERITY_BADGE_CLASSES: Record<string, string> = {
  critical: 'bg-danger text-white',
  major: 'bg-warning text-white',
  minor: 'bg-glacier-500 text-white',
  info: 'bg-info-muted text-info',
}

const EXPERTISE_DESCRIPTIONS: Record<ExpertiseLevel, string> = {
  beginner: 'Explications detaillees, termes simplifies, guides pas-a-pas',
  intermediate: 'Equilibre entre detail et concision, metriques standards',
  expert: 'Donnees brutes, analyses avancees, jargon professionnel',
}

// --- Composants ---

interface WidgetHeaderProps {
  title: string
  icon: React.ReactNode
  widgetKey: string
  widgetStates: Record<string, WidgetState>
  onToggleMinimize: (key: string) => void
  onClose: (key: string) => void
}

function WidgetHeader({ title, icon, widgetKey, widgetStates, onToggleMinimize, onClose }: WidgetHeaderProps): React.ReactNode {
  const isMinimized = widgetStates[widgetKey]?.minimized ?? false

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-muted bg-surface-secondary/50">
      <div className="flex items-center gap-2">
        <GripVertical className="w-3.5 h-3.5 text-text-muted/40 cursor-grab" />
        {icon}
        <span className="text-caption font-semibold text-text-primary">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggleMinimize(widgetKey)}
          className="p-1 rounded hover:bg-surface-tertiary text-text-muted cursor-pointer"
        >
          {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        </button>
        <button
          onClick={() => onClose(widgetKey)}
          className="p-1 rounded hover:bg-surface-tertiary text-text-muted cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function GlossaryTooltip({ term, definition }: { term: string; definition: string }): React.ReactNode {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="border-b border-dotted border-text-muted cursor-help text-accent">
        {term}
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-surface-inverse text-text-inverse p-3 rounded-xl shadow-xl z-50"
          >
            <div className="text-small font-medium mb-1">{term}</div>
            <div className="text-[0.625rem] leading-relaxed opacity-80">{definition}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

// --- Composant principal ---

export function FinanceHomeExperiment(): React.ReactNode {
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [expertiseLevel, setExpertiseLevel] = useState<ExpertiseLevel>('intermediate')
  const [showGlossary, setShowGlossary] = useState(false)
  const [glossarySearch, setGlossarySearch] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [widgetStates, setWidgetStates] = useState<Record<string, WidgetState>>({
    portfolio: { visible: true, minimized: false },
    alerts: { visible: true, minimized: false },
    market: { visible: true, minimized: false },
    quickActions: { visible: true, minimized: false },
    recent: { visible: true, minimized: false },
  })

  function toggleWidgetMinimize(key: string): void {
    setWidgetStates((previous) => ({
      ...previous,
      [key]: { ...previous[key], minimized: !previous[key]?.minimized },
    }))
  }

  function closeWidget(key: string): void {
    setWidgetStates((previous) => ({
      ...previous,
      [key]: { ...previous[key], visible: false },
    }))
  }

  const filteredGlossary = useMemo(() => {
    if (!glossarySearch.trim()) return GLOSSARY
    const search = glossarySearch.toLowerCase()
    return GLOSSARY.filter(
      (term) =>
        term.term.toLowerCase().includes(search) ||
        term.definition.toLowerCase().includes(search),
    )
  }, [glossarySearch])

  const totalAum = PORTFOLIO_FUNDS.reduce((sum, fund) => sum + fund.aum, 0)
  const overallPerformance = PORTFOLIO_FUNDS.reduce(
    (sum, fund) => sum + fund.performance * (fund.aum / totalAum),
    0,
  )

  const widgetHeaderProps = { widgetStates, onToggleMinimize: toggleWidgetMinimize, onClose: closeWidget }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-accent" />
          <h1 className="text-h4 text-text-primary">Decider Finance</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-small text-text-secondary">Expertise :</span>
            {(['beginner', 'intermediate', 'expert'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setExpertiseLevel(level)}
                className={`px-3 py-1 rounded-full text-small transition-colors cursor-pointer ${
                  expertiseLevel === level
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                {level === 'beginner' ? 'Debutant' : level === 'intermediate' ? 'Intermediaire' : 'Expert'}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border" />
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-small text-text-secondary">Mode Demo</span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                isDemoMode ? 'bg-accent' : 'bg-surface-tertiary'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ left: isDemoMode ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </label>
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-small transition-colors cursor-pointer ${
              showGlossary
                ? 'bg-accent-muted text-accent'
                : 'bg-surface text-text-secondary border border-border hover:text-text-primary'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Glossaire
          </button>
        </div>
      </div>

      {/* Mode demo banner */}
      {isDemoMode && (
        <div className="px-6 py-2 bg-accent-muted border-b border-accent/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-small text-accent font-medium">Mode demonstration actif</span>
            <span className="text-small text-text-muted ml-2">{EXPERTISE_DESCRIPTIONS[expertiseLevel]}</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Zone principale */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Onboarding */}
          <AnimatePresence>
            {showOnboarding && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={smoothTransition}
                className="overflow-hidden"
              >
                <div className="mx-6 mt-6 p-4 bg-glacier-50 rounded-xl border border-glacier-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-caption font-semibold text-glacier-800">Bienvenue sur Decider Finance</h3>
                    <button
                      onClick={() => setShowOnboarding(false)}
                      className="text-small text-glacier-500 hover:text-glacier-700 cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    {ONBOARDING_STEPS.map((step, index) => (
                      <div key={step.label} className="flex items-center gap-2">
                        {step.done ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : step.current ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Circle className="w-5 h-5 text-accent fill-accent/20" />
                          </motion.div>
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted/30" />
                        )}
                        <span className={`text-small ${
                          step.done ? 'text-success line-through' : step.current ? 'text-accent font-medium' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </span>
                        {index < ONBOARDING_STEPS.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-text-muted/30 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome */}
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-h3 text-text-primary">
              Bienvenue sur Decider Finance
            </h2>
            <p className="text-body text-text-secondary mt-1">
              Votre portefeuille comprend {PORTFOLIO_FUNDS.length} fonds actifs pour un{' '}
              <GlossaryTooltip term="AUM" definition="Assets Under Management - Actifs sous gestion. Valeur totale des actifs geres." />{' '}
              total de <span className="font-data font-medium text-text-primary">{totalAum} M EUR</span>
            </p>
          </div>

          {/* Dashboard widgets */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {/* Widget 1: Portfolio */}
            {widgetStates.portfolio?.visible && (
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <WidgetHeader title="Portefeuille" icon={<TrendingUp className="w-3.5 h-3.5 text-accent" />} widgetKey="portfolio" {...widgetHeaderProps} />
                {!widgetStates.portfolio.minimized && (
                  <div className="p-4">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-h3 font-bold font-data text-text-primary">{totalAum} M</span>
                      <span className={`text-caption font-medium font-data flex items-center gap-0.5 ${
                        overallPerformance >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {overallPerformance >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      {PORTFOLIO_FUNDS.map((fund) => (
                        <div key={fund.name} className="flex items-center justify-between py-1.5">
                          <span className="text-small text-text-primary">{fund.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-small font-data text-text-muted">{fund.aum} M</span>
                            <span className={`text-small font-data font-medium ${
                              fund.performance >= 0 ? 'text-success' : 'text-danger'
                            }`}>
                              {fund.performance >= 0 ? '+' : ''}{fund.performance}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Widget 2: Alertes */}
            {widgetStates.alerts?.visible && (
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <WidgetHeader title="Alertes" icon={<Bell className="w-3.5 h-3.5 text-warning" />} widgetKey="alerts" {...widgetHeaderProps} />
                {!widgetStates.alerts.minimized && (
                  <div className="p-4 space-y-2">
                    {ALERTS.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-2.5 py-1.5">
                        <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[0.5rem] font-bold shrink-0 ${SEVERITY_BADGE_CLASSES[alert.severity]}`}>
                          {alert.severity === 'critical' ? 'CRIT' : alert.severity === 'major' ? 'MAJ' : alert.severity === 'minor' ? 'MIN' : 'INFO'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-small text-text-primary truncate">{alert.title}</p>
                          <p className="text-[0.625rem] text-text-muted">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Widget 3: Market Pulse */}
            {widgetStates.market?.visible && (
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <WidgetHeader title="Market Pulse" icon={<BarChart3 className="w-3.5 h-3.5 text-dataviz-3" />} widgetKey="market" {...widgetHeaderProps} />
                {!widgetStates.market.minimized && (
                  <div className="p-4 space-y-3">
                    {MARKET_INDICES.map((index) => (
                      <div key={index.name} className="flex items-center justify-between">
                        <span className="text-caption text-text-primary font-medium">{index.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-small font-data text-text-primary">{index.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                          <span className={`flex items-center gap-0.5 text-small font-data font-medium ${
                            index.change >= 0 ? 'text-success' : 'text-danger'
                          }`}>
                            {index.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {index.change >= 0 ? '+' : ''}{index.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Widget 4: Actions rapides */}
            {widgetStates.quickActions?.visible && (
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <WidgetHeader title="Actions Rapides" icon={<Sparkles className="w-3.5 h-3.5 text-peach-500" />} widgetKey="quickActions" {...widgetHeaderProps} />
                {!widgetStates.quickActions.minimized && (
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {[
                      { icon: Plus, label: 'Nouvelle analyse', color: 'text-accent' },
                      { icon: Upload, label: 'Import data room', color: 'text-peach-500' },
                      { icon: FileText, label: 'Generer rapport', color: 'text-dataviz-3' },
                      { icon: Bell, label: 'Alertes', color: 'text-warning' },
                    ].map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors cursor-pointer"
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="text-small text-text-secondary text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Widget 5: Analyses recentes */}
            {widgetStates.recent?.visible && (
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <WidgetHeader title="Analyses Recentes" icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />} widgetKey="recent" {...widgetHeaderProps} />
                {!widgetStates.recent.minimized && (
                  <div className="p-4 space-y-2">
                    {RECENT_ANALYSES.map((analysis) => (
                      <button key={analysis.id} className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer text-left">
                        <div className="w-7 h-7 rounded-lg bg-accent-muted flex items-center justify-center shrink-0">
                          <MessageSquare className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-small text-text-primary truncate">{analysis.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[0.625rem] text-text-muted">{analysis.timestamp}</span>
                            <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-surface-tertiary text-text-muted">{analysis.type}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-text-muted/40 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Business Prompts */}
          <div className="px-6 pb-6">
            <h3 className="text-caption font-semibold text-text-primary mb-3">Suggestions d'analyse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUSINESS_PROMPTS.map((card) => (
                <div key={card.category} className="bg-surface rounded-xl border border-border p-4">
                  <h4 className="text-small font-semibold text-accent mb-3">{card.category}</h4>
                  <div className="space-y-2">
                    {card.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-text-muted/40 mt-0.5 shrink-0 group-hover:text-accent transition-colors" />
                        <span className="text-small text-text-secondary group-hover:text-text-primary transition-colors">
                          {prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glossary panel */}
        <AnimatePresence>
          {showGlossary && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={smoothTransition}
              className="border-l border-border bg-surface-secondary shrink-0 overflow-hidden"
            >
              <div className="w-80 flex flex-col h-full">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <h3 className="text-caption font-semibold text-text-primary">Glossaire Financier</h3>
                  </div>
                  <button
                    onClick={() => setShowGlossary(false)}
                    className="p-1 rounded hover:bg-surface-tertiary text-text-muted cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-border">
                    <Search className="w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(event) => setGlossarySearch(event.target.value)}
                      placeholder="Rechercher un terme..."
                      className="flex-1 text-small bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
                  {filteredGlossary.map((term) => (
                    <div key={term.term} className="bg-surface rounded-xl border border-border-muted p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-caption font-semibold text-accent">{term.term}</span>
                      </div>
                      <p className="text-small text-text-secondary leading-relaxed mb-2">{term.definition}</p>
                      <div className="flex items-start gap-1.5 px-2 py-1.5 bg-surface-secondary rounded-lg">
                        <Info className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
                        <p className="text-[0.625rem] text-text-muted leading-relaxed">{term.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
