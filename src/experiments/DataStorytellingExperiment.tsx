import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, RefreshCw, TrendingUp, BarChart3, ArrowDownToLine,
  Wallet, Clipboard, Check, Lightbulb, AlertTriangle, CheckCircle,
  ChevronDown,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

// --- Couleurs dataviz ---

const COLORS = {
  glacier500: '#29abb5',
  peach500: '#fe6d11',
  dataviz3: '#6366f1',
  dataviz4: '#16a34a',
  dataviz5: '#dc2626',
}

const SECTOR_COLORS = [
  COLORS.glacier500,
  COLORS.dataviz3,
  COLORS.peach500,
  COLORS.dataviz4,
  COLORS.dataviz5,
]

// --- Types ---

type DetailLevel = 'synthetic' | 'standard' | 'detailed'

interface FundConfig {
  name: string
  navData: Array<{ month: string; nav: number }>
  irr: string
  irrDelta: string
  tvpi: string
  tvpiDelta: string
  dpi: string
  dpiDelta: string
  navTotal: string
  navDelta: string
}

// --- Donnees mock ---

const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

function generateNavData(start: number, end: number): Array<{ month: string; nav: number }> {
  const step = (end - start) / 11
  return MONTHS.map((month, index) => ({
    month,
    nav: Math.round(start + step * index + Math.sin(index * 0.7) * 12 + Math.random() * 8),
  }))
}

const FUNDS: Record<string, FundConfig> = {
  'Alpha Growth Fund': {
    name: 'Alpha Growth Fund',
    navData: generateNavData(500, 612),
    irr: '18,5%',
    irrDelta: '↑ +2,3 pts vs Q3',
    tvpi: '1,65x',
    tvpiDelta: '↑ +0,12x vs Q3',
    dpi: '0,42x',
    dpiDelta: '↑ +0,15x vs Q3',
    navTotal: '612 M€',
    navDelta: '↑ +8,2% vs Q3',
  },
  'Beta Income Fund': {
    name: 'Beta Income Fund',
    navData: generateNavData(320, 385),
    irr: '12,1%',
    irrDelta: '↑ +1,1 pts vs Q3',
    tvpi: '1,38x',
    tvpiDelta: '↑ +0,06x vs Q3',
    dpi: '0,55x',
    dpiDelta: '↑ +0,08x vs Q3',
    navTotal: '385 M€',
    navDelta: '↑ +5,4% vs Q3',
  },
  'Gamma Venture Fund': {
    name: 'Gamma Venture Fund',
    navData: generateNavData(180, 245),
    irr: '24,2%',
    irrDelta: '↑ +4,1 pts vs Q3',
    tvpi: '1,92x',
    tvpiDelta: '↑ +0,18x vs Q3',
    dpi: '0,28x',
    dpiDelta: '↑ +0,10x vs Q3',
    navTotal: '245 M€',
    navDelta: '↑ +12,1% vs Q3',
  },
}

const FUND_NAMES = Object.keys(FUNDS)

const SECTOR_DATA = [
  { name: 'Tech', value: 42 },
  { name: 'Santé', value: 28 },
  { name: 'Industrie', value: 15 },
  { name: 'Services', value: 10 },
  { name: 'Autre', value: 5 },
]

const CASHFLOW_DATA = [
  { quarter: 'Q1', appels: -55, distributions: 12 },
  { quarter: 'Q2', appels: -48, distributions: 35 },
  { quarter: 'Q3', appels: -52, distributions: 18 },
  { quarter: 'Q4', appels: -45, distributions: 92 },
]

const TIMELINE_EVENTS = [
  { date: 'Jan', label: 'Closing additionnel 50M€', color: COLORS.dataviz3 },
  { date: 'Mar', label: 'Investissement LogiPrime 35M€', color: '#91919f' },
  { date: 'Jun', label: 'Exit partiel MedTech Phase 1', color: COLORS.dataviz4 },
  { date: 'Sep', label: 'Correction marchés Tech -4,2%', color: COLORS.peach500 },
  { date: 'Nov', label: 'Marquage CE MedTech Solutions', color: COLORS.dataviz4 },
  { date: 'Dec', label: 'Exit DataScale (3,2x)', color: COLORS.dataviz4 },
]

const DETAIL_LEVELS: Array<{ value: DetailLevel; label: string }> = [
  { value: 'synthetic', label: 'Synthétique' },
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Détaillé' },
]

// --- Variants d'animation ---

const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const sectionItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

const kpiStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const kpiItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

// --- Tooltip personnalise ---

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  suffix?: string
}

function ChartTooltip({ active, payload, label, suffix = '' }: ChartTooltipProps): React.ReactNode {
  if (!active || !payload) return null

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
      <p className="text-small font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-small" style={{ color: entry.color }}>
          {entry.name} : <span className="font-medium font-data">{entry.value}{suffix}</span>
        </p>
      ))}
    </div>
  )
}

// --- Composants de section ---

function SectionWrapper({ children, sectionKey }: { children: React.ReactNode; sectionKey: string }): React.ReactNode {
  return (
    <motion.div
      key={sectionKey}
      variants={sectionItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      {children}
    </motion.div>
  )
}

function ExecutiveSummary(): React.ReactNode {
  const [copied, setCopied] = useState(false)

  function handleCopy(): void {
    const text = 'Alpha Growth Fund affiche une performance solide au Q4 2024 avec un IRR net de 18,5% et un TVPI de 1,65x, positionnant le fonds dans le premier quartile de sa catégorie. Trois exits réussis portent le DPI à 0,42x. Vigilance recommandée sur la concentration sectorielle Tech (42%).'
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative border-l-4 border-accent bg-accent/5 rounded-r-xl p-5">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer"
        title="Copier le résumé"
      >
        {copied ? <Check className="w-4 h-4 text-accent" /> : <Clipboard className="w-4 h-4" />}
      </button>
      <h2 className="text-caption font-semibold text-text-primary mb-2">Résumé exécutif</h2>
      <p className="text-small text-text-secondary leading-relaxed pr-10">
        <strong className="text-text-primary">Alpha Growth Fund</strong> affiche une performance solide au Q4 2024 avec un{' '}
        <strong className="text-text-primary">IRR net de 18,5%</strong> et un{' '}
        <strong className="text-text-primary">TVPI de 1,65x</strong>, positionnant le fonds dans le{' '}
        <strong className="text-text-primary">premier quartile</strong> de sa catégorie. Trois exits réussis portent le DPI à 0,42x. Vigilance recommandée sur la concentration sectorielle Tech (42%).
      </p>
    </div>
  )
}

function KpiCards({ fund }: { fund: FundConfig }): React.ReactNode {
  const kpis = [
    { label: 'IRR Net', value: fund.irr, delta: fund.irrDelta, icon: TrendingUp },
    { label: 'TVPI', value: fund.tvpi, delta: fund.tvpiDelta, icon: BarChart3 },
    { label: 'DPI', value: fund.dpi, delta: fund.dpiDelta, icon: ArrowDownToLine },
    { label: 'NAV', value: fund.navTotal, delta: fund.navDelta, icon: Wallet },
  ]

  return (
    <motion.div
      variants={kpiStaggerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {kpis.map((kpi) => (
        <motion.div
          key={kpi.label}
          variants={kpiItemVariants}
          className="bg-surface rounded-xl border border-border shadow-sm p-4 flex items-start gap-3"
        >
          <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <kpi.icon className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-small text-text-muted mb-0.5">{kpi.label}</p>
            <p className="text-h4 font-bold text-text-primary font-data">{kpi.value}</p>
            <p className="text-small text-success font-medium font-data mt-0.5">{kpi.delta}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function NarrativeParagraph({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <p className="text-small text-text-secondary leading-relaxed">
      {children}
    </p>
  )
}

function NavChart({ fund }: { fund: FundConfig }): React.ReactNode {
  return (
    <div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fund.navData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#91919f' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#91919f' }}
              domain={['auto', 'auto']}
              tickFormatter={(value: number) => `${value} M€`}
            />
            <RechartsTooltip content={<ChartTooltip suffix=" M€" />} />
            <Line
              type="monotone"
              dataKey="nav"
              name="NAV"
              stroke={COLORS.glacier500}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: COLORS.glacier500 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-small text-text-muted text-center mt-2 italic">
        Évolution de la NAV — {fund.name} (Jan — Déc 2024)
      </p>
    </div>
  )
}

function InsightCallout(): React.ReactNode {
  return (
    <div className="border-l-4 border-accent bg-accent/5 rounded-r-xl p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
      <p className="text-small text-text-secondary leading-relaxed">
        <strong className="text-text-primary">Insight</strong> : Le rythme de création de valeur s'accélère — la NAV a progressé de +5,1% sur les 3 derniers mois contre +3,1% sur les 3 mois précédents, suggérant une inflexion positive dans la maturation du portefeuille.
      </p>
    </div>
  )
}

function SectorChart(): React.ReactNode {
  return (
    <div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SECTOR_DATA}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="45%"
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: '#91919f', strokeWidth: 1 }}
            >
              {SECTOR_DATA.map((_, index) => (
                <Cell key={index} fill={SECTOR_COLORS[index]} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value?: number) => [`${value ?? 0}%`, 'Part']}
              contentStyle={{
                background: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-small text-text-muted text-center mt-2 italic">
        Répartition sectorielle au 31/12/2024
      </p>
    </div>
  )
}

function AlertCallout(): React.ReactNode {
  return (
    <div className="border-l-4 border-[#fe6d11] bg-[#fe6d11]/5 rounded-r-xl p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-[#fe6d11] shrink-0 mt-0.5" />
      <p className="text-small text-text-secondary leading-relaxed">
        <strong className="text-text-primary">Point d'attention</strong> : La concentration sur le secteur Tech (42%) dépasse le seuil de 40% défini dans la politique d'investissement. Une revue de l'allocation est recommandée lors du prochain comité.
      </p>
    </div>
  )
}

function CashFlowChart(): React.ReactNode {
  return (
    <div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#91919f' }} />
            <YAxis tick={{ fontSize: 11, fill: '#91919f' }} tickFormatter={(value: number) => `${value}`} />
            <RechartsTooltip content={<ChartTooltip suffix=" M€" />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="appels" name="Appels" fill={COLORS.peach500} radius={[2, 2, 0, 0]} />
            <Bar dataKey="distributions" name="Distributions" fill={COLORS.glacier500} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-small text-text-muted text-center mt-2 italic">
        Flux de trésorerie trimestriels 2024 (M€)
      </p>
    </div>
  )
}

function Timeline(): React.ReactNode {
  return (
    <div>
      <h3 className="text-caption font-semibold text-text-primary mb-4">Événements clés 2024</h3>
      <div className="relative">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-border-muted" />
        <div className="flex justify-between relative">
          {TIMELINE_EVENTS.map((event, index) => (
            <motion.div
              key={event.date}
              className="flex flex-col items-center text-center w-[15%]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-surface flex items-center justify-center z-10 shadow-sm"
                style={{ backgroundColor: event.color }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="text-small font-semibold text-text-primary mt-2">{event.date}</span>
              <span className="text-small text-text-muted leading-tight mt-1">{event.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuartileComparison(): React.ReactNode {
  return (
    <div>
      <h3 className="text-caption font-semibold text-text-primary mb-3">Positionnement vs. pairs</h3>
      <div className="relative mb-3">
        <div className="flex h-10 rounded-lg overflow-hidden">
          <div className="flex-1 bg-[#16a34a]/20 flex items-center justify-center text-small font-medium text-[#16a34a]">
            Q1
          </div>
          <div className="flex-1 bg-[#16a34a]/10 flex items-center justify-center text-small font-medium text-[#16a34a]/70">
            Q2
          </div>
          <div className="flex-1 bg-[#fe6d11]/10 flex items-center justify-center text-small font-medium text-[#fe6d11]/70">
            Q3
          </div>
          <div className="flex-1 bg-[#dc2626]/10 flex items-center justify-center text-small font-medium text-[#dc2626]/70">
            Q4
          </div>
        </div>
        <motion.div
          className="absolute top-0 h-full flex flex-col items-center justify-end"
          style={{ left: '20%' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        >
          <div className="flex flex-col items-center -mb-1">
            <div className="px-2 py-0.5 bg-accent text-white text-small font-medium rounded-md shadow-sm whitespace-nowrap -translate-x-1/2 relative left-1/2 mb-1">
              Alpha Growth
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-accent -translate-x-1/2 relative left-1/2" />
          </div>
        </motion.div>
      </div>
      <p className="text-small text-text-secondary leading-relaxed">
        IRR de 18,5% vs. médiane du marché à 12,3% — <strong className="text-text-primary">1er quartile</strong> sur un univers de 47 fonds buyout Europe vintage 2020.
      </p>
    </div>
  )
}

function RecommendationBox(): React.ReactNode {
  return (
    <div className="border-l-4 border-[#16a34a] bg-[#16a34a]/5 rounded-r-xl p-4 flex gap-3">
      <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
      <p className="text-small text-text-secondary leading-relaxed">
        <strong className="text-text-primary">Recommandation</strong> : Maintenir la stratégie actuelle. La trajectoire de performance et le pipeline de sorties (2 exits prévus en H1 2025) soutiennent un objectif de TVPI final de{' '}
        <strong className="text-text-primary">1,8-2,0x</strong>. Surveiller l'exposition Tech et préparer un rééquilibrage si la pondération dépasse 45%.
      </p>
    </div>
  )
}

// --- Composant principal ---

export function DataStorytellingExperiment(): React.ReactNode {
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard')
  const [selectedFundName, setSelectedFundName] = useState(FUND_NAMES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [reportKey, setReportKey] = useState(0)

  const fund = FUNDS[selectedFundName]

  const showStandard = detailLevel === 'standard' || detailLevel === 'detailed'
  const showDetailed = detailLevel === 'detailed'

  function handleRegenerate(): void {
    setReportKey((k) => k + 1)
  }

  function handleSelectFund(name: string): void {
    setSelectedFundName(name)
    setDropdownOpen(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header toolbar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-accent" />
          <h1 className="text-h4 text-text-primary">Alpha Growth Fund — Analyse Narrative Q4 2024</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Detail level toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {DETAIL_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => setDetailLevel(level.value)}
                className={`px-3 py-1.5 text-small font-medium transition-colors cursor-pointer ${
                  detailLevel === level.value
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Fund selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg border border-border text-small text-text-primary cursor-pointer hover:bg-surface-secondary transition-colors"
            >
              {selectedFundName}
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 min-w-[200px]">
                  {FUND_NAMES.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSelectFund(name)}
                      className={`block w-full text-left px-4 py-2 text-small transition-colors cursor-pointer ${
                        name === selectedFundName
                          ? 'bg-accent/10 text-accent font-medium'
                          : 'text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export button */}
          <button className="px-3 py-1.5 text-small text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg border border-border transition-colors cursor-pointer">
            Exporter PDF
          </button>

          {/* Regenerate button */}
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-small font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Regénérer
          </button>
        </div>
      </div>

      {/* Content - Narrative report */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${detailLevel}-${reportKey}`}
              variants={sectionContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* 1. Executive Summary — ALL */}
              <SectionWrapper sectionKey="executive-summary">
                <ExecutiveSummary />
              </SectionWrapper>

              {/* 2. KPI Cards — ALL */}
              <SectionWrapper sectionKey="kpi-cards">
                <KpiCards fund={fund} />
              </SectionWrapper>

              {/* 3. Performance narrative — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="perf-narrative">
                  <NarrativeParagraph>
                    Le fonds poursuit sa trajectoire ascendante avec une appréciation de{' '}
                    <strong className="text-text-primary">8,2%</strong> de la NAV sur le trimestre, portée par la revalorisation de{' '}
                    <strong className="text-text-primary">MedTech Solutions</strong> (+23%) suite à l'obtention de son marquage CE, et la croissance organique de{' '}
                    <strong className="text-text-primary">DataFlow</strong> (+15%, CA annualisé passé de 45 M€ à 52 M€).
                  </NarrativeParagraph>
                </SectionWrapper>
              )}

              {/* 4. NAV Chart — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="nav-chart">
                  <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
                    <NavChart fund={fund} />
                  </div>
                </SectionWrapper>
              )}

              {/* 5. Insight callout — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="insight-callout">
                  <InsightCallout />
                </SectionWrapper>
              )}

              {/* 6. Sector analysis — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="sector-analysis">
                  <NarrativeParagraph>
                    L'exposition sectorielle reste concentrée sur la{' '}
                    <strong className="text-text-primary">technologie (42%)</strong> et la{' '}
                    <strong className="text-text-primary">santé (28%)</strong>, conformément à la thèse d'investissement. Cependant, la pondération Tech a augmenté de 5 points sur le trimestre en raison de l'appréciation de DataFlow.
                  </NarrativeParagraph>
                </SectionWrapper>
              )}

              {/* 7. Sector PieChart — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="sector-chart">
                  <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
                    <SectorChart />
                  </div>
                </SectionWrapper>
              )}

              {/* 8. Alert callout — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="alert-callout">
                  <AlertCallout />
                </SectionWrapper>
              )}

              {/* 9. Cash flows paragraph — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="cashflow-narrative">
                  <NarrativeParagraph>
                    Le rythme de déploiement reste soutenu avec{' '}
                    <strong className="text-text-primary">45 M€</strong> appelés au Q4, portant le total appelé à{' '}
                    <strong className="text-text-primary">680 M€</strong> (80% du committed). Les distributions de{' '}
                    <strong className="text-text-primary">92 M€</strong> au Q4 (exit MedTech Phase 1) marquent une accélération significative du retour aux investisseurs.
                  </NarrativeParagraph>
                </SectionWrapper>
              )}

              {/* 10. Cash flow BarChart — STANDARD + DETAILED */}
              {showStandard && (
                <SectionWrapper sectionKey="cashflow-chart">
                  <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
                    <CashFlowChart />
                  </div>
                </SectionWrapper>
              )}

              {/* 11. Timeline — DETAILED only */}
              {showDetailed && (
                <SectionWrapper sectionKey="timeline">
                  <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
                    <Timeline />
                  </div>
                </SectionWrapper>
              )}

              {/* 12. Quartile comparison — ALL */}
              <SectionWrapper sectionKey="quartile-comparison">
                <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
                  <QuartileComparison />
                </div>
              </SectionWrapper>

              {/* 13. Recommendation — ALL */}
              <SectionWrapper sectionKey="recommendation">
                <RecommendationBox />
              </SectionWrapper>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
