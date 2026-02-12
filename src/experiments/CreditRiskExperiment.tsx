import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend, ReferenceArea,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, Filter, X,
  ChevronUp, ChevronDown, Activity, ShieldAlert, AlertTriangle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface WaterfallStep {
  name: string
  value: number
  isSubtotal?: boolean
  isTotal?: boolean
}

interface WaterfallBar {
  name: string
  invisible: number
  positive: number
  negative: number
  subtotal: number
  originalValue: number
}

interface Exposure {
  id: number
  counterparty: string
  sector: string
  country: string
  rating: string
  pd: number
  lgd: number
  ead: number
  el: number
  maturity: number
  collateral: string
}

interface MigrationCell {
  from: string
  to: string
  count: number
  pct: number
}

interface StressScenario {
  name: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  el: number
  deltaEl: number
  pdAvg: number
  defaultRate: number
  capital: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const HORIZONS = ['1Y', 'Lifetime'] as const

const SECTOR_COLORS: Record<string, string> = {
  'Énergie': '#f59e0b',
  'Finance': '#0ea5e9',
  'Industrie': '#8b5cf6',
  'Télécom': '#ec4899',
  'Santé': '#10b981',
  'Immobilier': '#f97316',
  'Technologie': '#6366f1',
}

const RATING_COLORS: Record<string, string> = {
  'AAA': '#22c55e', 'AA': '#86efac', 'A': '#0ea5e9',
  'BBB': '#f59e0b', 'BB': '#f97316', 'B': '#ef4444',
  'CCC': '#991b1b',
}

const MIGRATION_RATINGS = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'D']

// ─── Mock data ───────────────────────────────────────────────────────────────

const EL_WATERFALL: WaterfallStep[] = [
  { name: 'Énergie', value: 8.2 },
  { name: 'Finance', value: 12.5 },
  { name: 'Industrie', value: 6.8 },
  { name: 'Télécom', value: 4.1 },
  { name: 'Santé', value: 3.2 },
  { name: 'Immobilier', value: 5.5 },
  { name: 'Technologie', value: 2.8 },
  { name: 'Perte attendue', value: 43.1, isTotal: true },
]

const RATING_DONUT = [
  { name: 'Investment Grade', value: 68, color: '#0ea5e9' },
  { name: 'High Yield', value: 25, color: '#f97316' },
  { name: 'Unrated', value: 7, color: '#94a3b8' },
]

const SCATTER_DATA = [
  { counterparty: 'BNP Paribas', sector: 'Finance', pd: 0.8, lgd: 35, ead: 120, el: 0.34 },
  { counterparty: 'Société Générale', sector: 'Finance', pd: 1.2, lgd: 38, ead: 95, el: 0.43 },
  { counterparty: 'TotalEnergies', sector: 'Énergie', pd: 0.5, lgd: 42, ead: 150, el: 0.32 },
  { counterparty: 'Engie', sector: 'Énergie', pd: 1.8, lgd: 45, ead: 85, el: 0.69 },
  { counterparty: 'Airbus', sector: 'Industrie', pd: 0.6, lgd: 40, ead: 110, el: 0.26 },
  { counterparty: 'Schneider', sector: 'Industrie', pd: 0.4, lgd: 35, ead: 75, el: 0.11 },
  { counterparty: 'Orange', sector: 'Télécom', pd: 1.5, lgd: 50, ead: 65, el: 0.49 },
  { counterparty: 'Sanofi', sector: 'Santé', pd: 0.3, lgd: 30, ead: 90, el: 0.08 },
  { counterparty: 'Unibail', sector: 'Immobilier', pd: 3.5, lgd: 55, ead: 70, el: 1.35 },
  { counterparty: 'Atos', sector: 'Technologie', pd: 8.2, lgd: 65, ead: 45, el: 2.40 },
  { counterparty: 'Casino', sector: 'Finance', pd: 12.0, lgd: 70, ead: 30, el: 2.52 },
  { counterparty: 'Renault', sector: 'Industrie', pd: 2.5, lgd: 48, ead: 80, el: 0.96 },
  { counterparty: 'Veolia', sector: 'Industrie', pd: 1.0, lgd: 38, ead: 60, el: 0.23 },
  { counterparty: 'Bouygues', sector: 'Immobilier', pd: 1.8, lgd: 52, ead: 55, el: 0.52 },
  { counterparty: 'Capgemini', sector: 'Technologie', pd: 0.7, lgd: 32, ead: 50, el: 0.11 },
]

const MIGRATION_MATRIX: MigrationCell[] = (() => {
  const data: MigrationCell[] = []
  const matrix = [
    [92, 5, 2, 1, 0, 0, 0],
    [1, 88, 7, 3, 1, 0, 0],
    [0, 2, 86, 8, 3, 1, 0],
    [0, 0, 3, 84, 8, 4, 1],
    [0, 0, 0, 4, 78, 12, 6],
    [0, 0, 0, 1, 5, 72, 22],
    [0, 0, 0, 0, 0, 0, 100],
  ]
  MIGRATION_RATINGS.forEach((from, fi) => {
    MIGRATION_RATINGS.forEach((to, ti) => {
      data.push({ from, to, count: Math.round(matrix[fi][ti] * 0.5), pct: matrix[fi][ti] })
    })
  })
  return data
})()

const TREEMAP_DATA = [
  { sector: 'Finance', ead: 320, pdAvg: 1.5 },
  { sector: 'Énergie', ead: 280, pdAvg: 1.2 },
  { sector: 'Industrie', ead: 250, pdAvg: 1.8 },
  { sector: 'Immobilier', ead: 180, pdAvg: 2.5 },
  { sector: 'Télécom', ead: 120, pdAvg: 1.6 },
  { sector: 'Santé', ead: 100, pdAvg: 0.8 },
  { sector: 'Technologie', ead: 90, pdAvg: 2.2 },
]

const STRESS_SCENARIOS: StressScenario[] = [
  { name: 'Central', severity: 'low', el: 43.1, deltaEl: 0, pdAvg: 1.8, defaultRate: 1.2, capital: 185 },
  { name: 'Récession modérée', severity: 'medium', el: 68.5, deltaEl: 25.4, pdAvg: 3.2, defaultRate: 2.8, capital: 245 },
  { name: 'Récession sévère', severity: 'high', el: 112.8, deltaEl: 69.7, pdAvg: 5.8, defaultRate: 5.5, capital: 380 },
  { name: 'Crise sectorielle', severity: 'extreme', el: 145.2, deltaEl: 102.1, pdAvg: 7.5, defaultRate: 8.2, capital: 485 },
]

const EXPOSURES: Exposure[] = [
  { id: 1, counterparty: 'BNP Paribas', sector: 'Finance', country: 'France', rating: 'AA', pd: 0.8, lgd: 35, ead: 120, el: 0.34, maturity: 4.2, collateral: 'Non garanti' },
  { id: 2, counterparty: 'Société Générale', sector: 'Finance', country: 'France', rating: 'A', pd: 1.2, lgd: 38, ead: 95, el: 0.43, maturity: 3.8, collateral: 'Non garanti' },
  { id: 3, counterparty: 'TotalEnergies', sector: 'Énergie', country: 'France', rating: 'AA', pd: 0.5, lgd: 42, ead: 150, el: 0.32, maturity: 5.5, collateral: 'Non garanti' },
  { id: 4, counterparty: 'Engie', sector: 'Énergie', country: 'France', rating: 'BBB', pd: 1.8, lgd: 45, ead: 85, el: 0.69, maturity: 4.0, collateral: 'Nantissement' },
  { id: 5, counterparty: 'Airbus', sector: 'Industrie', country: 'Pays-Bas', rating: 'A', pd: 0.6, lgd: 40, ead: 110, el: 0.26, maturity: 6.2, collateral: 'Non garanti' },
  { id: 6, counterparty: 'Schneider Electric', sector: 'Industrie', country: 'France', rating: 'A', pd: 0.4, lgd: 35, ead: 75, el: 0.11, maturity: 3.5, collateral: 'Non garanti' },
  { id: 7, counterparty: 'Orange', sector: 'Télécom', country: 'France', rating: 'BBB', pd: 1.5, lgd: 50, ead: 65, el: 0.49, maturity: 4.8, collateral: 'Non garanti' },
  { id: 8, counterparty: 'Sanofi', sector: 'Santé', country: 'France', rating: 'AA', pd: 0.3, lgd: 30, ead: 90, el: 0.08, maturity: 7.0, collateral: 'Non garanti' },
  { id: 9, counterparty: 'Unibail-Rodamco', sector: 'Immobilier', country: 'France', rating: 'BBB', pd: 3.5, lgd: 55, ead: 70, el: 1.35, maturity: 3.2, collateral: 'Hypothèque' },
  { id: 10, counterparty: 'Atos', sector: 'Technologie', country: 'France', rating: 'B', pd: 8.2, lgd: 65, ead: 45, el: 2.40, maturity: 2.5, collateral: 'Non garanti' },
  { id: 11, counterparty: 'Casino Guichard', sector: 'Finance', country: 'France', rating: 'CCC', pd: 12.0, lgd: 70, ead: 30, el: 2.52, maturity: 1.8, collateral: 'Nantissement' },
  { id: 12, counterparty: 'Renault', sector: 'Industrie', country: 'France', rating: 'BB', pd: 2.5, lgd: 48, ead: 80, el: 0.96, maturity: 4.5, collateral: 'Non garanti' },
]

// ─── Computations ────────────────────────────────────────────────────────────

function computeWaterfall(steps: WaterfallStep[]): WaterfallBar[] {
  let running = 0
  return steps.map(step => {
    if (step.isSubtotal || step.isTotal) {
      return { name: step.name, invisible: 0, positive: 0, negative: 0, subtotal: step.value, originalValue: step.value }
    }
    if (step.value >= 0) {
      const bar = { name: step.name, invisible: running, positive: step.value, negative: 0, subtotal: 0, originalValue: step.value }
      running += step.value
      return bar
    }
    running += step.value
    return { name: step.name, invisible: running, positive: 0, negative: -step.value, subtotal: 0, originalValue: step.value }
  })
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtEur(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} Md€`
  return `${v.toFixed(1)} M€`
}

function effectBg(v: number): string {
  const abs = Math.abs(v)
  if (abs < 0.01) return 'transparent'
  const intensity = Math.min(abs / 2, 1)
  if (v > 0) return `rgba(16, 185, 129, ${0.06 + intensity * 0.12})`
  return `rgba(239, 68, 68, ${0.06 + intensity * 0.12})`
}

function migrationColor(from: string, to: string, pct: number): string {
  const fi = MIGRATION_RATINGS.indexOf(from)
  const ti = MIGRATION_RATINGS.indexOf(to)
  if (fi === ti) return pct > 0 ? 'rgba(156, 163, 175, 0.15)' : 'transparent'
  if (to === 'D') return `rgba(153, 27, 27, ${Math.min(pct / 30, 0.5)})`
  if (ti > fi) return `rgba(239, 68, 68, ${Math.min(pct / 20, 0.4)})`
  return `rgba(16, 185, 129, ${Math.min(pct / 10, 0.3)})`
}

function severityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'text-emerald-600 bg-emerald-50'
    case 'medium': return 'text-amber-600 bg-amber-50'
    case 'high': return 'text-orange-600 bg-orange-50'
    case 'extreme': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

// ─── Tooltips ────────────────────────────────────────────────────────────────

function ELWaterfallTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
      <div className="font-medium text-gray-800">{label}</div>
      <div className="font-semibold tabular-nums text-rose-600">{fmtEur(entry.originalValue)}</div>
    </div>
  )
}

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200 min-w-[160px]">
      <div className="font-semibold text-gray-800">{data.counterparty}</div>
      <div className="text-[10px] text-gray-400 mb-1">{data.sector}</div>
      <div className="flex justify-between text-xs"><span className="text-gray-500">PD</span><span className="font-medium tabular-nums">{data.pd}%</span></div>
      <div className="flex justify-between text-xs"><span className="text-gray-500">LGD</span><span className="font-medium tabular-nums">{data.lgd}%</span></div>
      <div className="flex justify-between text-xs"><span className="text-gray-500">EAD</span><span className="font-medium tabular-nums">{fmtEur(data.ead)}</span></div>
      <div className="border-t border-gray-100 mt-1 pt-1 flex justify-between font-semibold text-xs">
        <span>EL</span><span className="tabular-nums text-rose-600">{fmtEur(data.el)}</span>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children, className = '' }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4.5 h-4.5 text-rose-600" />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.section>
  )
}

function KPICard({ label, value, sub, trend }: {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold tabular-nums text-gray-900">{value}</span>
        {trend && (
          trend === 'up'
            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            : trend === 'down'
              ? <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              : null
        )}
      </div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function SortHeader({ label, column, sortColumn, sortDirection, onSort }: {
  label: string
  column: string
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (col: string) => void
}) {
  const active = column === sortColumn
  return (
    <th
      className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
      onClick={() => onSort(column)}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {active && (sortDirection === 'desc'
          ? <ChevronDown className="w-3 h-3" />
          : <ChevronUp className="w-3 h-3" />
        )}
      </span>
    </th>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CreditRiskExperiment() {
  const [horizon, setHorizon] = useState<string>('1Y')
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('el')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const waterfallData = useMemo(() => computeWaterfall(EL_WATERFALL), [])

  const scatterFiltered = useMemo(() =>
    selectedSector ? SCATTER_DATA.filter(d => d.sector === selectedSector) : SCATTER_DATA,
  [selectedSector])

  const sortedExposures = useMemo(() => {
    const filtered = selectedSector ? EXPOSURES.filter(e => e.sector === selectedSector) : EXPOSURES
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn as keyof Exposure] as number
      const bVal = b[sortColumn as keyof Exposure] as number
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal
    })
  }, [selectedSector, sortColumn, sortDirection])

  const hhi = useMemo(() => {
    const totalEad = TREEMAP_DATA.reduce((s, d) => s + d.ead, 0)
    return TREEMAP_DATA.reduce((s, d) => s + Math.pow(d.ead / totalEad * 100, 2), 0)
  }, [])

  function handleSort(col: string) {
    if (col === sortColumn) setSortDirection(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortColumn(col); setSortDirection('desc') }
  }

  function handleSectorClick(sector: string) {
    setSelectedSector(s => s === sector ? null : sector)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 bg-white rounded-xl border border-gray-200 p-4 mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Decider Corporate Credit</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-medium text-[10px]">Corporate</span>
                <span>1.34 Md€</span>
                <span className="text-gray-300">·</span>
                <span>142 expositions</span>
                <span className="text-gray-300">·</span>
                <span>EUR</span>
                <span className="text-gray-300">·</span>
                <span>Analyse : 31/12/2024</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedSector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 bg-rose-50 rounded-full px-2.5 py-1 text-xs text-rose-700 font-medium"
              >
                <Filter className="w-3 h-3" />
                <span>{selectedSector}</span>
                <button onClick={() => setSelectedSector(null)} className="hover:text-rose-900">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            <div className="flex items-center gap-1">
              {HORIZONS.map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    horizon === h ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Scrollable dashboard */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-6 gap-2">
          <KPICard label="Encours total" value="1.34 Md€" trend="neutral" sub="142 expositions" />
          <KPICard label="Perte attendue (EL)" value="43.1 M€" trend="down" sub="3.2% de l'encours" />
          <KPICard label="Perte inattendue (UL)" value="142 M€" trend="down" sub="VaR 99%" />
          <KPICard label="PD moyenne" value="1.8%" trend="neutral" sub="pondérée EAD" />
          <KPICard label="LGD moyenne" value="42.5%" trend="neutral" sub="pondérée EAD" />
          <KPICard label="Rating moyen" value="BBB+" trend="neutral" sub="investment grade" />
        </motion.div>

        {/* EL Waterfall + Donut */}
        <div className="grid grid-cols-[1fr_320px] gap-3">
          <Section title="Perte attendue par secteur" icon={BarChart3}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}M€`} />
                  <Tooltip content={<ELWaterfallTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                  <Bar dataKey="positive" stackId="wf" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="negative" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subtotal" stackId="wf" fill="#e11d48" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Répartition par rating" icon={ShieldAlert}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RATING_DONUT}
                    cx="50%" cy="45%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={2} dataKey="value" stroke="none"
                    style={{ cursor: 'pointer' }}
                  >
                    {RATING_DONUT.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Scatter PD vs LGD */}
        <Section title="Scatter PD vs LGD" icon={Activity}>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number" dataKey="pd" name="PD"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }} tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 15]}
                  label={{ value: 'PD (%)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#9ca3af' }}
                />
                <YAxis
                  type="number" dataKey="lgd" name="LGD"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 80]}
                  label={{ value: 'LGD (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9ca3af' }}
                />
                <ZAxis type="number" dataKey="ead" range={[40, 400]} name="EAD" />
                <ReferenceArea x1={0} x2={3} y1={0} y2={40} fill="#10b981" fillOpacity={0.05} />
                <ReferenceArea x1={3} x2={8} y1={40} y2={60} fill="#f59e0b" fillOpacity={0.05} />
                <ReferenceArea x1={8} x2={15} y1={60} y2={80} fill="#ef4444" fillOpacity={0.05} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatterFiltered} name="Expositions">
                  {scatterFiltered.map((entry, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[entry.sector] || '#6b7280'} fillOpacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-center">
            {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
              <button
                key={sector}
                className={`flex items-center gap-1 text-[10px] transition-opacity ${selectedSector && selectedSector !== sector ? 'opacity-30' : ''}`}
                onClick={() => handleSectorClick(sector)}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-500">{sector}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Migration Matrix */}
        <Section title="Matrice de migration des ratings" icon={Activity}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">De ↓ / Vers →</th>
                  {MIGRATION_RATINGS.map(r => (
                    <th key={r} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MIGRATION_RATINGS.map(from => (
                  <tr key={from} className="border-b border-gray-50">
                    <td className="px-2 py-2 font-medium text-gray-800">{from}</td>
                    {MIGRATION_RATINGS.map(to => {
                      const cell = MIGRATION_MATRIX.find(c => c.from === from && c.to === to)
                      if (!cell) return <td key={to} className="px-2 py-1.5 text-center text-gray-300">—</td>
                      return (
                        <td
                          key={to}
                          className="px-2 py-1.5 text-center"
                          style={{ backgroundColor: migrationColor(from, to, cell.pct) }}
                        >
                          <div className="font-medium tabular-nums text-gray-700">{cell.count}</div>
                          <div className="text-[10px] tabular-nums text-gray-400">{cell.pct}%</div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Treemap Concentration */}
        <Section title="Concentration sectorielle" icon={BarChart3}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Indice HHI :</span>
            <span className={`text-xs font-semibold tabular-nums ${hhi < 1500 ? 'text-emerald-600' : hhi < 2500 ? 'text-amber-600' : 'text-red-500'}`}>
              {hhi.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-400">({hhi < 1500 ? 'Diversifié' : hhi < 2500 ? 'Modéré' : 'Concentré'})</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {TREEMAP_DATA.sort((a, b) => b.ead - a.ead).map(item => {
              const totalEad = TREEMAP_DATA.reduce((s, d) => s + d.ead, 0)
              const pctWidth = (item.ead / totalEad) * 100
              return (
                <button
                  key={item.sector}
                  className={`rounded-lg p-2 text-left transition-all ${selectedSector === item.sector ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-gray-300'}`}
                  style={{
                    backgroundColor: `${SECTOR_COLORS[item.sector]}18`,
                    gridColumn: `span ${Math.max(1, Math.round(pctWidth / 14))}`,
                  }}
                  onClick={() => handleSectorClick(item.sector)}
                >
                  <div className="text-[10px] font-medium" style={{ color: SECTOR_COLORS[item.sector] }}>{item.sector}</div>
                  <div className="text-xs font-semibold text-gray-800 tabular-nums">{fmtEur(item.ead)}</div>
                  <div className="text-[10px] text-gray-400">PD {item.pdAvg}%</div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Stress Tests */}
        <Section title="Stress tests" icon={AlertTriangle}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Scénario</th>
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sévérité</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">EL</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Δ EL</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">PD moy.</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Taux défaut</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Capital</th>
                </tr>
              </thead>
              <tbody>
                {STRESS_SCENARIOS.map(sc => (
                  <tr key={sc.name} className="border-b border-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-800">{sc.name}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${severityColor(sc.severity)}`}>
                        {sc.severity === 'low' ? 'Base' : sc.severity === 'medium' ? 'Modéré' : sc.severity === 'high' ? 'Sévère' : 'Extrême'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium text-gray-700">{fmtEur(sc.el)}</td>
                    <td className={`px-3 py-2.5 text-right tabular-nums font-medium ${sc.deltaEl > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {sc.deltaEl > 0 ? `+${fmtEur(sc.deltaEl)}` : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{sc.pdAvg.toFixed(1)}%</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{sc.defaultRate.toFixed(1)}%</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium text-gray-700">{fmtEur(sc.capital)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Exposure Table */}
        <Section title="Détail des expositions" icon={ShieldAlert}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[140px]">Contrepartie</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secteur</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pays</th>
                  <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  <SortHeader label="PD" column="pd" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="LGD" column="lgd" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="EAD" column="ead" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="EL" column="el" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Maturité" column="maturity" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Collatéral</th>
                </tr>
              </thead>
              <tbody>
                {sortedExposures.map(exp => (
                  <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2 font-medium text-gray-800">{exp.counterparty}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: `${SECTOR_COLORS[exp.sector]}15`, color: SECTOR_COLORS[exp.sector] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[exp.sector] }} />
                        {exp.sector}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-gray-500">{exp.country}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: `${RATING_COLORS[exp.rating] || '#94a3b8'}15`, color: RATING_COLORS[exp.rating] || '#94a3b8' }}>
                        {exp.rating}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-right tabular-nums font-medium ${exp.pd > 5 ? 'text-red-500' : exp.pd > 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                      {exp.pd.toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{exp.lgd}%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-700 font-medium">{fmtEur(exp.ead)}</td>
                    <td className="px-2 py-2 text-right tabular-nums font-semibold" style={{ backgroundColor: effectBg(exp.el) }}>
                      <span className="text-rose-600">{fmtEur(exp.el)}</span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-500">{exp.maturity.toFixed(1)} ans</td>
                    <td className="px-2 py-2 text-gray-500 text-[10px]">{exp.collateral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  )
}
