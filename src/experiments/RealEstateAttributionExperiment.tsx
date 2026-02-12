import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Legend,
} from 'recharts'
import {
  Building2, BarChart3, Landmark, Filter, X,
  ChevronUp, ChevronDown, TrendingUp, TrendingDown, Activity,
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

interface BrinsonRow {
  sector: string
  weightFund: number
  weightBench: number
  returnFund: number
  returnBench: number
}

interface BrinsonComputed extends BrinsonRow {
  allocation: number
  selection: number
  interaction: number
  total: number
}

interface Asset {
  id: number
  name: string
  address: string
  sector: string
  surface: number
  value: number
  capRate: number
  noi: number
  occupancy: number
  yieldIncome: number
  capitalGrowth: number
  contribution: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const PERIODS = ['1Y', '3Y', '5Y', 'YTD', 'Inception'] as const

const SECTOR_COLORS: Record<string, string> = {
  'Bureaux': '#0ea5e9',
  'Logistique': '#8b5cf6',
  'Résidentiel': '#10b981',
  'Commerce': '#fe6d11',
  'Santé': '#ec4899',
  'Hôtellerie': '#f59e0b',
}

const FACTOR_META = [
  { key: 'income', label: 'Revenus locatifs', color: '#10b981' },
  { key: 'capitalGrowth', label: 'Plus-value', color: '#0ea5e9' },
  { key: 'leverage', label: 'Levier', color: '#8b5cf6' },
  { key: 'currency', label: 'Devises', color: '#f59e0b' },
  { key: 'fees', label: 'Frais', color: '#ef4444' },
] as const

// ─── Mock data ───────────────────────────────────────────────────────────────

const WATERFALL_STEPS: WaterfallStep[] = [
  { name: 'Loyers bruts', value: 5.8 },
  { name: 'Charges', value: -1.2 },
  { name: 'Loyers nets', value: 4.6, isSubtotal: true },
  { name: 'PV réalisée', value: 1.8 },
  { name: 'PV latente', value: 2.1 },
  { name: 'Levier', value: 1.4 },
  { name: 'Frais gestion', value: -1.5 },
  { name: 'Devises', value: -0.3 },
  { name: 'Rendement net', value: 8.1, isTotal: true },
]

const BRINSON_DATA: BrinsonRow[] = [
  { sector: 'Bureaux', weightFund: 35, weightBench: 32, returnFund: 6.2, returnBench: 5.8 },
  { sector: 'Logistique', weightFund: 22, weightBench: 18, returnFund: 11.3, returnBench: 9.1 },
  { sector: 'Résidentiel', weightFund: 18, weightBench: 22, returnFund: 5.1, returnBench: 5.5 },
  { sector: 'Commerce', weightFund: 10, weightBench: 15, returnFund: 2.8, returnBench: 3.2 },
  { sector: 'Santé', weightFund: 10, weightBench: 8, returnFund: 7.5, returnBench: 6.8 },
  { sector: 'Hôtellerie', weightFund: 5, weightBench: 5, returnFund: 4.2, returnBench: 3.9 },
]

const DEBT_MATURITIES = [
  { year: '2025', senior: 45, mezzanine: 0 },
  { year: '2026', senior: 65, mezzanine: 15 },
  { year: '2027', senior: 110, mezzanine: 0 },
  { year: '2028', senior: 45, mezzanine: 20 },
  { year: '2029', senior: 85, mezzanine: 0 },
  { year: '2030', senior: 45, mezzanine: 10 },
  { year: '2031', senior: 40, mezzanine: 0 },
]

const QUARTERLY_DATA = [
  { q: 'T1 22', income: 1.1, capitalGrowth: 0.8, leverage: 0.4, fees: -0.35, currency: 0.1, total: 2.05 },
  { q: 'T2 22', income: 1.2, capitalGrowth: -0.3, leverage: 0.3, fees: -0.35, currency: -0.1, total: 0.75 },
  { q: 'T3 22', income: 1.1, capitalGrowth: -0.8, leverage: 0.1, fees: -0.35, currency: -0.2, total: -0.15 },
  { q: 'T4 22', income: 1.2, capitalGrowth: -1.2, leverage: -0.2, fees: -0.35, currency: 0.0, total: -0.55 },
  { q: 'T1 23', income: 1.1, capitalGrowth: -0.5, leverage: -0.1, fees: -0.35, currency: 0.1, total: 0.25 },
  { q: 'T2 23', income: 1.2, capitalGrowth: 0.2, leverage: 0.2, fees: -0.35, currency: 0.0, total: 1.25 },
  { q: 'T3 23', income: 1.1, capitalGrowth: 0.5, leverage: 0.3, fees: -0.35, currency: -0.1, total: 1.45 },
  { q: 'T4 23', income: 1.3, capitalGrowth: 0.8, leverage: 0.3, fees: -0.35, currency: 0.0, total: 2.05 },
  { q: 'T1 24', income: 1.2, capitalGrowth: 0.6, leverage: 0.4, fees: -0.35, currency: 0.1, total: 1.95 },
  { q: 'T2 24', income: 1.3, capitalGrowth: 0.9, leverage: 0.4, fees: -0.38, currency: -0.1, total: 2.12 },
  { q: 'T3 24', income: 1.2, capitalGrowth: 1.0, leverage: 0.3, fees: -0.38, currency: 0.0, total: 2.12 },
  { q: 'T4 24', income: 1.3, capitalGrowth: 0.7, leverage: 0.4, fees: -0.38, currency: -0.1, total: 1.92 },
]

const ASSETS: Asset[] = [
  { id: 1, name: 'Tour Ariane', address: 'La Défense', sector: 'Bureaux', surface: 45000, value: 280, capRate: 4.2, noi: 11.8, occupancy: 96, yieldIncome: 5.1, capitalGrowth: 3.2, contribution: 1.8 },
  { id: 2, name: 'Le Millénaire', address: 'Aubervilliers', sector: 'Bureaux', surface: 32000, value: 185, capRate: 5.1, noi: 9.4, occupancy: 92, yieldIncome: 5.5, capitalGrowth: 1.2, contribution: 0.9 },
  { id: 3, name: 'Pôle Logistique Lyon', address: 'Saint-Priest', sector: 'Logistique', surface: 55000, value: 95, capRate: 5.8, noi: 5.5, occupancy: 100, yieldIncome: 6.2, capitalGrowth: 5.1, contribution: 1.4 },
  { id: 4, name: 'Entrepôt Seine-Aval', address: 'Gennevilliers', sector: 'Logistique', surface: 42000, value: 78, capRate: 5.5, noi: 4.3, occupancy: 100, yieldIncome: 5.9, capitalGrowth: 4.8, contribution: 1.1 },
  { id: 5, name: 'Résidence Les Jardins', address: 'Lyon 3e', sector: 'Résidentiel', surface: 12000, value: 65, capRate: 3.8, noi: 2.5, occupancy: 97, yieldIncome: 4.2, capitalGrowth: 2.8, contribution: 0.5 },
  { id: 6, name: 'Immeuble Haussmann', address: 'Paris 8e', sector: 'Résidentiel', surface: 8500, value: 92, capRate: 3.2, noi: 2.9, occupancy: 98, yieldIncome: 3.5, capitalGrowth: 3.5, contribution: 0.8 },
  { id: 7, name: 'Rivétoile', address: 'Strasbourg', sector: 'Commerce', surface: 38000, value: 110, capRate: 6.2, noi: 6.8, occupancy: 88, yieldIncome: 4.1, capitalGrowth: -1.2, contribution: -0.2 },
  { id: 8, name: 'Retail Park Atlantis', address: 'Nantes', sector: 'Commerce', surface: 25000, value: 45, capRate: 7.1, noi: 3.2, occupancy: 82, yieldIncome: 3.8, capitalGrowth: -2.5, contribution: -0.4 },
  { id: 9, name: 'Clinique Saint-Martin', address: 'Bordeaux', sector: 'Santé', surface: 15000, value: 58, capRate: 4.8, noi: 2.8, occupancy: 100, yieldIncome: 5.2, capitalGrowth: 2.5, contribution: 0.6 },
  { id: 10, name: 'EHPAD Les Oliviers', address: 'Aix-en-Provence', sector: 'Santé', surface: 8000, value: 35, capRate: 5.2, noi: 1.8, occupancy: 100, yieldIncome: 5.6, capitalGrowth: 1.8, contribution: 0.3 },
  { id: 11, name: 'Hôtel Mercure Gare', address: 'Lille', sector: 'Hôtellerie', surface: 6500, value: 42, capRate: 5.5, noi: 2.3, occupancy: 85, yieldIncome: 4.2, capitalGrowth: 1.5, contribution: 0.2 },
  { id: 12, name: 'Hub Logistique A6', address: 'Mâcon', sector: 'Logistique', surface: 35000, value: 52, capRate: 6.0, noi: 3.1, occupancy: 100, yieldIncome: 6.5, capitalGrowth: 4.2, contribution: 0.7 },
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

function computeBrinson(data: BrinsonRow[]): BrinsonComputed[] {
  const benchTotal = data.reduce((s, r) => s + (r.weightBench / 100) * r.returnBench, 0)
  return data.map(row => {
    const wDiff = (row.weightFund - row.weightBench) / 100
    const rDiff = row.returnFund - row.returnBench
    const allocation = wDiff * (row.returnBench - benchTotal)
    const selection = (row.weightBench / 100) * rDiff
    const interaction = wDiff * rDiff
    return { ...row, allocation, selection, interaction, total: allocation + selection + interaction }
  })
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtPct(v: number, decimals = 1, sign = true): string {
  const s = sign && v > 0 ? '+' : ''
  return `${s}${v.toFixed(decimals)}%`
}

function fmtEur(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} Md€`
  return `${v} M€`
}

function fmtSurface(v: number): string {
  return `${(v / 1000).toFixed(1)}k m²`
}

function effectColor(v: number): string {
  if (v > 0.01) return 'text-emerald-600'
  if (v < -0.01) return 'text-red-500'
  return 'text-gray-400'
}

function effectBg(v: number): string {
  const abs = Math.abs(v)
  if (abs < 0.01) return 'transparent'
  const intensity = Math.min(abs / 0.4, 1)
  if (v > 0) return `rgba(16, 185, 129, ${0.06 + intensity * 0.12})`
  return `rgba(239, 68, 68, ${0.06 + intensity * 0.12})`
}

// ─── Tooltips ────────────────────────────────────────────────────────────────

function WaterfallTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  const val = entry.originalValue
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
      <div className="font-medium text-gray-800">{label}</div>
      <div className={`font-semibold tabular-nums ${val >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {fmtPct(val)}
      </div>
    </div>
  )
}

function QuarterlyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200 min-w-[180px]">
      <div className="font-semibold text-gray-800 mb-1">{label}</div>
      {FACTOR_META.map(f => (
        <div key={f.key} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
          <span className="text-gray-600 text-xs">{f.label}</span>
          <span className="ml-auto font-medium tabular-nums text-xs">
            {fmtPct(data[f.key], 2)}
          </span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-1 pt-1 flex justify-between font-semibold text-xs">
        <span>Total</span>
        <span className={`tabular-nums ${data.total >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {fmtPct(data.total, 2)}
        </span>
      </div>
    </div>
  )
}

function DebtTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const senior = payload.find((p: any) => p.dataKey === 'senior')?.value ?? 0
  const mezz = payload.find((p: any) => p.dataKey === 'mezzanine')?.value ?? 0
  const total = senior + mezz
  if (total === 0) return null
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
      <div className="font-semibold text-gray-800 mb-1">{label}</div>
      <div className="flex justify-between gap-4 text-xs">
        <span className="text-gray-500">Senior</span>
        <span className="font-medium tabular-nums">{senior} M€</span>
      </div>
      {mezz > 0 && (
        <div className="flex justify-between gap-4 text-xs">
          <span className="text-gray-500">Mezzanine</span>
          <span className="font-medium tabular-nums">{mezz} M€</span>
        </div>
      )}
      <div className="border-t border-gray-100 mt-1 pt-1 flex justify-between font-semibold text-xs">
        <span>Total</span>
        <span className="tabular-nums">{total} M€</span>
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
        <Icon className="w-4.5 h-4.5 text-teal-600" />
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

export function RealEstateAttributionExperiment() {
  const [period, setPeriod] = useState<string>('3Y')
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('contribution')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const waterfallData = useMemo(() => computeWaterfall(WATERFALL_STEPS), [])
  const brinsonData = useMemo(() => computeBrinson(BRINSON_DATA), [])
  const brinsonTotals = useMemo(() => {
    return brinsonData.reduce(
      (acc, r) => ({
        allocation: acc.allocation + r.allocation,
        selection: acc.selection + r.selection,
        interaction: acc.interaction + r.interaction,
        total: acc.total + r.total,
      }),
      { allocation: 0, selection: 0, interaction: 0, total: 0 },
    )
  }, [brinsonData])

  const sectorPieData = useMemo(() =>
    BRINSON_DATA.map(r => ({ name: r.sector, value: r.weightFund })),
  [])

  const sortedAssets = useMemo(() => {
    const filtered = selectedSector ? ASSETS.filter(a => a.sector === selectedSector) : ASSETS
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn as keyof Asset] as number
      const bVal = b[sortColumn as keyof Asset] as number
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal
    })
  }, [selectedSector, sortColumn, sortDirection])

  function handleSort(col: string) {
    if (col === sortColumn) {
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortColumn(col)
      setSortDirection('desc')
    }
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
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Decider Patrimoine Core</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-medium text-[10px]">Core</span>
                <span>1.2 Md€</span>
                <span className="text-gray-300">·</span>
                <span>Millésime 2019</span>
                <span className="text-gray-300">·</span>
                <span>14 actifs</span>
                <span className="text-gray-300">·</span>
                <span>France & Europe Ouest</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedSector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 bg-teal-50 rounded-full px-2.5 py-1 text-xs text-teal-700 font-medium"
              >
                <Filter className="w-3 h-3" />
                <span>{selectedSector}</span>
                <button onClick={() => setSelectedSector(null)} className="hover:text-teal-900">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            <div className="flex items-center gap-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    period === p
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Scrollable dashboard */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-6 gap-2"
        >
          <KPICard label="TRI Brut" value="+10.2%" trend="up" sub="vs 8.4% bench" />
          <KPICard label="TRI Net" value="+8.1%" trend="up" sub="vs 6.2% bench" />
          <KPICard label="TVPI" value="1.42x" trend="up" sub="vs 1.31x bench" />
          <KPICard label="Cash Yield" value="4.6%" trend="neutral" sub="stable" />
          <KPICard label="LTV moyen" value="40.0%" trend="neutral" sub="covenant 55%" />
          <KPICard label="NOI" value="52.8 M€" trend="up" sub="+3.2% vs N-1" />
        </motion.div>

        {/* Waterfall */}
        <Section title="Attribution du rendement" icon={BarChart3}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 'auto']}
                />
                <Tooltip content={<WaterfallTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="positive" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="negative" stackId="wf" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="subtotal" stackId="wf" fill="#29abb5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Brinson + Sector Donut */}
        <div className="grid grid-cols-[1fr_320px] gap-3">
          {/* Brinson Table */}
          <Section title="Attribution Brinson par secteur" icon={Activity}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secteur</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pds Fonds</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pds Bench</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rdt Fonds</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rdt Bench</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Allocation</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sélection</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Interaction</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {brinsonData.map(row => (
                    <tr
                      key={row.sector}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${
                        selectedSector === row.sector ? 'bg-teal-50/60' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSectorClick(row.sector)}
                    >
                      <td className="px-2 py-2 font-medium text-gray-800">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[row.sector] }} />
                          {row.sector}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-600">{row.weightFund.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-400">{row.weightBench.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-600">{row.returnFund.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-400">{row.returnBench.toFixed(1)}%</td>
                      <td
                        className={`px-2 py-2 text-right tabular-nums font-medium ${effectColor(row.allocation)}`}
                        style={{ backgroundColor: effectBg(row.allocation) }}
                      >
                        {fmtPct(row.allocation, 2)}
                      </td>
                      <td
                        className={`px-2 py-2 text-right tabular-nums font-medium ${effectColor(row.selection)}`}
                        style={{ backgroundColor: effectBg(row.selection) }}
                      >
                        {fmtPct(row.selection, 2)}
                      </td>
                      <td
                        className={`px-2 py-2 text-right tabular-nums font-medium ${effectColor(row.interaction)}`}
                        style={{ backgroundColor: effectBg(row.interaction) }}
                      >
                        {fmtPct(row.interaction, 2)}
                      </td>
                      <td
                        className={`px-2 py-2 text-right tabular-nums font-semibold ${effectColor(row.total)}`}
                        style={{ backgroundColor: effectBg(row.total) }}
                      >
                        {fmtPct(row.total, 2)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="border-t-2 border-gray-200 font-semibold">
                    <td className="px-2 py-2 text-gray-800">Total</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">100.0%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-400">100.0%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">—</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-400">—</td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(brinsonTotals.allocation)}`}>
                      {fmtPct(brinsonTotals.allocation, 2)}
                    </td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(brinsonTotals.selection)}`}>
                      {fmtPct(brinsonTotals.selection, 2)}
                    </td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(brinsonTotals.interaction)}`}>
                      {fmtPct(brinsonTotals.interaction, 2)}
                    </td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(brinsonTotals.total)}`}>
                      {fmtPct(brinsonTotals.total, 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Sector Donut */}
          <Section title="Répartition sectorielle" icon={Building2}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorPieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    onClick={(entry: any) => handleSectorClick(entry.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {sectorPieData.map(entry => (
                      <Cell
                        key={entry.name}
                        fill={SECTOR_COLORS[entry.name]}
                        opacity={selectedSector && selectedSector !== entry.name ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: '#6b7280' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Debt Section */}
        <div className="grid grid-cols-[260px_1fr] gap-3">
          {/* Debt KPIs */}
          <Section title="Profil de dette" icon={Landmark}>
            <div className="space-y-2">
              {[
                { label: 'LTV moyen', value: '40.0%', status: 'ok' as const },
                { label: 'LTV max (covenant)', value: '55.0%', status: 'ok' as const },
                { label: 'ICR', value: '3.2x', status: 'ok' as const },
                { label: 'DSCR', value: '1.8x', status: 'ok' as const },
                { label: 'Coût moyen dette', value: '2.8%', status: 'ok' as const },
                { label: 'Maturité résid. moy.', value: '3.4 ans', status: 'warn' as const },
                { label: 'Part taux fixe', value: '72%', status: 'ok' as const },
                { label: 'Part taux variable', value: '28%', status: 'warn' as const },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className={`text-xs font-semibold tabular-nums ${
                    item.status === 'ok' ? 'text-gray-800' : 'text-amber-600'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Maturity Wall */}
          <Section title="Mur de maturité de la dette" icon={Landmark} className="min-h-0">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEBT_MATURITIES} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}M€`}
                  />
                  <Tooltip content={<DebtTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                  <Bar dataKey="senior" stackId="debt" fill="#0ea5e9" name="Senior" radius={[0, 0, 0, 0]}>
                    {DEBT_MATURITIES.map((entry, i) => (
                      <Cell key={i} fill={entry.year === '2025' ? '#f97316' : '#0ea5e9'} />
                    ))}
                  </Bar>
                  <Bar dataKey="mezzanine" stackId="debt" fill="#f59e0b" name="Mezzanine" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Quarterly Attribution */}
        <Section title="Attribution trimestrielle" icon={BarChart3}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={QUARTERLY_DATA} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="q"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip content={<QuarterlyTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                {FACTOR_META.map(f => (
                  <Bar
                    key={f.key}
                    dataKey={f.key}
                    stackId="quarterly"
                    fill={f.color}
                    name={f.label}
                    radius={[0, 0, 0, 0]}
                  />
                ))}
                <Line
                  dataKey="total"
                  stroke="#1a1a1f"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1a1a1f' }}
                  name="Total"
                  type="monotone"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Asset Table */}
        <Section title="Détail par actif" icon={Building2}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[180px]">Actif</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[100px]">Secteur</th>
                  <SortHeader label="Valeur" column="value" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Surface" column="surface" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Cap Rate" column="capRate" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="NOI" column="noi" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Occup." column="occupancy" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Rdt Locatif" column="yieldIncome" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Plus-value" column="capitalGrowth" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Contrib." column="contribution" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map(asset => (
                  <tr
                    key={asset.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-2 py-2">
                      <div className="font-medium text-gray-800">{asset.name}</div>
                      <div className="text-[10px] text-gray-400">{asset.address}</div>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          backgroundColor: `${SECTOR_COLORS[asset.sector]}15`,
                          color: SECTOR_COLORS[asset.sector],
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[asset.sector] }} />
                        {asset.sector}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-700 font-medium">{fmtEur(asset.value)}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-500">{fmtSurface(asset.surface)}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{asset.capRate.toFixed(1)}%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{asset.noi.toFixed(1)} M€</td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      <span className={asset.occupancy >= 95 ? 'text-emerald-600' : asset.occupancy >= 85 ? 'text-amber-600' : 'text-red-500'}>
                        {asset.occupancy}%
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{asset.yieldIncome.toFixed(1)}%</td>
                    <td className={`px-2 py-2 text-right tabular-nums font-medium ${asset.capitalGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {fmtPct(asset.capitalGrowth)}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums font-semibold" style={{ backgroundColor: effectBg(asset.contribution) }}>
                      <span className={asset.contribution >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                        {fmtPct(asset.contribution)}
                      </span>
                    </td>
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
