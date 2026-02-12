import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, Filter, X,
  ChevronUp, ChevronDown, Activity, Landmark, DollarSign,
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

interface RatingAttributionRow {
  rating: string
  weightFund: number
  weightBench: number
  returnFund: number
  returnBench: number
}

interface RatingAttributionComputed extends RatingAttributionRow {
  allocation: number
  selection: number
  total: number
}

interface HeatmapCell {
  duration: string
  rating: string
  weight: number
  overUnder: number
  activeReturn: number
}

interface Bond {
  id: number
  issuer: string
  isin: string
  coupon: number
  maturity: string
  rating: string
  oas: number
  duration: number
  dts: number
  weight: number
  contribution: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const PERIODS = ['MTD', 'QTD', 'YTD', '1Y', '3Y'] as const

const RATING_COLORS: Record<string, string> = {
  'AAA': '#22c55e',
  'AA': '#86efac',
  'A': '#0ea5e9',
  'BBB': '#f59e0b',
  'BB': '#f97316',
  'B': '#ef4444',
  'CCC': '#991b1b',
}

const FACTOR_META = [
  { key: 'income', label: 'Income', color: '#10b981' },
  { key: 'treasury', label: 'Taux', color: '#6366f1' },
  { key: 'spread', label: 'Spread', color: '#f59e0b' },
  { key: 'currency', label: 'Devises', color: '#8b5cf6' },
  { key: 'residual', label: 'Résiduel', color: '#94a3b8' },
] as const

const DURATION_BUCKETS = ['0-1Y', '1-3Y', '3-5Y', '5-7Y', '7-10Y', '10Y+']
const RATINGS = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC']

// ─── Mock data ───────────────────────────────────────────────────────────────

const CAMPISI_WATERFALL: WaterfallStep[] = [
  { name: 'Coupon', value: 3.42 },
  { name: 'Roll-down', value: 0.28 },
  { name: 'Convergence', value: 0.15 },
  { name: 'Income', value: 3.85, isSubtotal: true },
  { name: 'Shift', value: -1.82 },
  { name: 'Twist', value: 0.34 },
  { name: 'Curvature', value: -0.08 },
  { name: 'Treasury', value: -1.56, isSubtotal: true },
  { name: 'Sprd Sector.', value: 0.45 },
  { name: 'Sprd Spéci.', value: -0.22 },
  { name: 'Spread', value: 0.23, isSubtotal: true },
  { name: 'Devises', value: -0.18 },
  { name: 'Résiduel', value: 0.06 },
  { name: 'Rdt Total', value: 2.40, isTotal: true },
]

const RATING_ATTRIBUTION_DATA: RatingAttributionRow[] = [
  { rating: 'AAA', weightFund: 5, weightBench: 8, returnFund: 1.8, returnBench: 1.6 },
  { rating: 'AA', weightFund: 12, weightBench: 15, returnFund: 2.1, returnBench: 2.0 },
  { rating: 'A', weightFund: 30, weightBench: 32, returnFund: 2.8, returnBench: 2.5 },
  { rating: 'BBB', weightFund: 35, weightBench: 30, returnFund: 3.5, returnBench: 3.1 },
  { rating: 'BB', weightFund: 12, weightBench: 10, returnFund: 5.2, returnBench: 4.8 },
  { rating: 'B', weightFund: 5, weightBench: 4, returnFund: 6.8, returnBench: 6.2 },
  { rating: 'CCC', weightFund: 1, weightBench: 1, returnFund: -2.5, returnBench: -3.1 },
]

const SPREAD_WATERFALL: WaterfallStep[] = [
  { name: 'Spread carry', value: 1.85 },
  { name: 'Sprd sectoriel', value: 0.45 },
  { name: 'Sprd spécifique', value: -0.22 },
  { name: 'Total spread', value: 2.08, isTotal: true },
]

const SPREAD_TOP_BOTTOM = [
  { name: 'TotalEnergies 2.8% 28', contribution: 0.12, rating: 'A' },
  { name: 'Schneider 3.1% 29', contribution: 0.09, rating: 'A' },
  { name: 'BNP 4.2% 30', contribution: 0.08, rating: 'AA' },
  { name: 'LVMH 2.5% 27', contribution: 0.07, rating: 'AA' },
  { name: 'Sanofi 3.0% 31', contribution: 0.05, rating: 'A' },
  { name: 'Casino 6.5% 26', contribution: -0.18, rating: 'CCC' },
  { name: 'Rallye 5.8% 25', contribution: -0.12, rating: 'B' },
  { name: 'Orpea 4.5% 28', contribution: -0.09, rating: 'B' },
  { name: 'Atos 5.2% 27', contribution: -0.08, rating: 'BB' },
  { name: 'EDF 3.8% 32', contribution: -0.05, rating: 'BBB' },
]

const HEATMAP_DATA: HeatmapCell[] = (() => {
  const data: HeatmapCell[] = []
  const weights = [
    [0.5, 1.2, 0.8, 0.3, 0.1, 0.0],
    [1.0, 2.5, 3.2, 1.8, 0.8, 0.2],
    [1.5, 4.2, 8.5, 6.3, 3.8, 1.2],
    [2.0, 5.8, 9.2, 7.5, 5.2, 2.1],
    [0.8, 2.2, 3.5, 2.8, 1.5, 0.5],
    [0.2, 0.8, 1.5, 1.2, 0.8, 0.3],
    [0.0, 0.1, 0.3, 0.2, 0.1, 0.0],
  ]
  const overUnders = [
    [-0.3, -0.5, 0.2, 0.1, 0.0, 0.0],
    [-0.5, -0.8, 0.5, 0.3, 0.1, 0.0],
    [0.2, 0.8, -0.5, 0.3, -0.2, 0.1],
    [0.5, 1.2, 1.5, -0.8, 0.5, 0.3],
    [0.3, 0.5, 0.8, -0.3, 0.2, 0.1],
    [0.1, 0.2, 0.3, 0.1, -0.1, 0.0],
    [0.0, 0.0, 0.1, 0.0, 0.0, 0.0],
  ]
  RATINGS.forEach((rating, ri) => {
    DURATION_BUCKETS.forEach((dur, di) => {
      data.push({
        duration: dur,
        rating,
        weight: weights[ri][di],
        overUnder: overUnders[ri][di],
        activeReturn: overUnders[ri][di] * (0.3 + Math.random() * 0.2),
      })
    })
  })
  return data
})()

const MONTHLY_DATA = [
  { month: 'Jan', income: 0.32, treasury: -0.45, spread: 0.12, currency: -0.05, residual: 0.02, total: -0.04 },
  { month: 'Fév', income: 0.31, treasury: 0.18, spread: -0.08, currency: 0.03, residual: -0.01, total: 0.43 },
  { month: 'Mar', income: 0.33, treasury: -0.22, spread: 0.15, currency: -0.02, residual: 0.01, total: 0.25 },
  { month: 'Avr', income: 0.32, treasury: 0.05, spread: 0.08, currency: 0.01, residual: 0.00, total: 0.46 },
  { month: 'Mai', income: 0.31, treasury: -0.35, spread: -0.12, currency: -0.08, residual: 0.02, total: -0.22 },
  { month: 'Jun', income: 0.33, treasury: -0.28, spread: 0.22, currency: 0.05, residual: -0.01, total: 0.31 },
  { month: 'Jul', income: 0.32, treasury: 0.15, spread: 0.05, currency: -0.03, residual: 0.01, total: 0.50 },
  { month: 'Aoû', income: 0.31, treasury: -0.12, spread: -0.05, currency: 0.02, residual: 0.00, total: 0.16 },
  { month: 'Sep', income: 0.33, treasury: -0.52, spread: -0.18, currency: -0.06, residual: 0.03, total: -0.40 },
  { month: 'Oct', income: 0.32, treasury: 0.38, spread: 0.25, currency: 0.04, residual: -0.02, total: 0.97 },
  { month: 'Nov', income: 0.31, treasury: 0.22, spread: 0.10, currency: -0.01, residual: 0.01, total: 0.63 },
  { month: 'Déc', income: 0.34, treasury: -0.15, spread: 0.08, currency: -0.03, residual: 0.00, total: 0.24 },
]

const BONDS: Bond[] = [
  { id: 1, issuer: 'République Française', isin: 'FR0013508470', coupon: 0.75, maturity: '2028-11-25', rating: 'AA', oas: 32, duration: 4.2, dts: 134, weight: 8.5, contribution: 0.18 },
  { id: 2, issuer: 'BNP Paribas', isin: 'FR0014003N97', coupon: 4.25, maturity: '2030-03-15', rating: 'AA', oas: 85, duration: 5.1, dts: 434, weight: 4.2, contribution: 0.15 },
  { id: 3, issuer: 'TotalEnergies', isin: 'XS2388876528', coupon: 2.80, maturity: '2028-06-12', rating: 'A', oas: 72, duration: 3.8, dts: 274, weight: 3.8, contribution: 0.12 },
  { id: 4, issuer: 'Schneider Electric', isin: 'FR0014005OJ0', coupon: 3.10, maturity: '2029-09-20', rating: 'A', oas: 68, duration: 4.5, dts: 306, weight: 3.5, contribution: 0.11 },
  { id: 5, issuer: 'LVMH', isin: 'FR0014006W45', coupon: 2.50, maturity: '2027-04-10', rating: 'AA', oas: 45, duration: 2.8, dts: 126, weight: 3.2, contribution: 0.09 },
  { id: 6, issuer: 'Sanofi', isin: 'FR0014007X32', coupon: 3.00, maturity: '2031-01-18', rating: 'A', oas: 62, duration: 6.2, dts: 384, weight: 3.0, contribution: 0.08 },
  { id: 7, issuer: 'Société Générale', isin: 'FR0013534062', coupon: 4.80, maturity: '2029-05-22', rating: 'A', oas: 112, duration: 4.0, dts: 448, weight: 2.8, contribution: 0.07 },
  { id: 8, issuer: 'Danone', isin: 'FR0014008Y21', coupon: 2.60, maturity: '2028-07-30', rating: 'BBB', oas: 95, duration: 3.5, dts: 333, weight: 2.5, contribution: 0.06 },
  { id: 9, issuer: 'Engie', isin: 'FR0014004P88', coupon: 3.40, maturity: '2032-11-08', rating: 'BBB', oas: 102, duration: 7.1, dts: 724, weight: 2.2, contribution: 0.05 },
  { id: 10, issuer: 'Renault', isin: 'FR0014009Z10', coupon: 5.20, maturity: '2027-08-14', rating: 'BB', oas: 245, duration: 2.5, dts: 613, weight: 2.0, contribution: 0.04 },
  { id: 11, issuer: 'Casino', isin: 'FR0013018389', coupon: 6.50, maturity: '2026-03-11', rating: 'CCC', oas: 850, duration: 1.2, dts: 1020, weight: 0.5, contribution: -0.18 },
  { id: 12, issuer: 'Atos', isin: 'FR0013019ABC', coupon: 5.20, maturity: '2027-06-15', rating: 'BB', oas: 380, duration: 2.8, dts: 1064, weight: 0.8, contribution: -0.08 },
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

function computeRatingAttribution(data: RatingAttributionRow[]): RatingAttributionComputed[] {
  const benchTotal = data.reduce((s, r) => s + (r.weightBench / 100) * r.returnBench, 0)
  return data.map(row => {
    const wDiff = (row.weightFund - row.weightBench) / 100
    const rDiff = row.returnFund - row.returnBench
    const allocation = wDiff * (row.returnBench - benchTotal)
    const selection = (row.weightBench / 100) * rDiff
    const total = allocation + selection
    return { ...row, allocation, selection, total }
  })
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtPct(v: number, decimals = 1, sign = true): string {
  const s = sign && v > 0 ? '+' : ''
  return `${s}${v.toFixed(decimals)}%`
}

function fmtBps(v: number): string {
  return `${v.toFixed(0)} bps`
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

function heatmapBg(v: number): string {
  const abs = Math.abs(v)
  if (abs < 0.01) return 'transparent'
  const intensity = Math.min(abs / 0.5, 1)
  if (v > 0) return `rgba(99, 102, 241, ${0.08 + intensity * 0.25})`
  return `rgba(239, 68, 68, ${0.08 + intensity * 0.25})`
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
        {fmtPct(val)} ({fmtBps(val * 100)})
      </div>
    </div>
  )
}

function MonthlyTooltip({ active, payload, label }: any) {
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
          <span className="ml-auto font-medium tabular-nums text-xs">{fmtPct(data[f.key], 2)}</span>
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
        <Icon className="w-4.5 h-4.5 text-indigo-600" />
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

export function FixedIncomeAttributionExperiment() {
  const [period, setPeriod] = useState<string>('1Y')
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('contribution')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const waterfallData = useMemo(() => computeWaterfall(CAMPISI_WATERFALL), [])
  const spreadWaterfallData = useMemo(() => computeWaterfall(SPREAD_WATERFALL), [])
  const ratingData = useMemo(() => computeRatingAttribution(RATING_ATTRIBUTION_DATA), [])
  const ratingTotals = useMemo(() =>
    ratingData.reduce(
      (acc, r) => ({ allocation: acc.allocation + r.allocation, selection: acc.selection + r.selection, total: acc.total + r.total }),
      { allocation: 0, selection: 0, total: 0 },
    ),
  [ratingData])

  const ratingPieData = useMemo(() =>
    RATING_ATTRIBUTION_DATA.map(r => ({ name: r.rating, value: r.weightFund })),
  [])

  const sortedBonds = useMemo(() => {
    const filtered = selectedRating ? BONDS.filter(b => b.rating === selectedRating) : BONDS
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn as keyof Bond] as number
      const bVal = b[sortColumn as keyof Bond] as number
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal
    })
  }, [selectedRating, sortColumn, sortDirection])

  function handleSort(col: string) {
    if (col === sortColumn) setSortDirection(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortColumn(col); setSortDirection('desc') }
  }

  function handleRatingClick(rating: string) {
    setSelectedRating(r => r === rating ? null : rating)
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
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Decider Investment Grade</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium text-[10px]">IG</span>
                <span>850 M€</span>
                <span className="text-gray-300">·</span>
                <span>Duration 4.8</span>
                <span className="text-gray-300">·</span>
                <span>OAS 112 bps</span>
                <span className="text-gray-300">·</span>
                <span>YTW 3.85%</span>
                <span className="text-gray-300">·</span>
                <span>EUR</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 bg-indigo-50 rounded-full px-2.5 py-1 text-xs text-indigo-700 font-medium"
              >
                <Filter className="w-3 h-3" />
                <span>{selectedRating}</span>
                <button onClick={() => setSelectedRating(null)} className="hover:text-indigo-900">
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
                    period === p ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-6 gap-2">
          <KPICard label="Rendement total" value="+2.40%" trend="up" sub="vs +1.95% bench" />
          <KPICard label="Excès vs bench" value="+45 bps" trend="up" sub="alpha positif" />
          <KPICard label="Duration effective" value="4.8" trend="neutral" sub="bench 4.5" />
          <KPICard label="OAS moyen" value="112 bps" trend="down" sub="resserrement -8 bps" />
          <KPICard label="Yield-to-Worst" value="3.85%" trend="neutral" sub="stable" />
          <KPICard label="DTS moyen" value="538" trend="up" sub="bench 485" />
        </motion.div>

        {/* Campisi Waterfall */}
        <Section title="Décomposition Campisi" icon={BarChart3}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} domain={['auto', 'auto']} />
                <Tooltip content={<WaterfallTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="positive" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="negative" stackId="wf" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="subtotal" stackId="wf" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Heatmap Duration × Rating */}
        <Section title="Heatmap Duration × Rating" icon={Activity}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  {DURATION_BUCKETS.map(d => (
                    <th key={d} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATINGS.map(rating => (
                  <tr
                    key={rating}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedRating === rating ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                    onClick={() => handleRatingClick(rating)}
                  >
                    <td className="px-2 py-2 font-medium text-gray-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RATING_COLORS[rating] }} />
                        {rating}
                      </span>
                    </td>
                    {DURATION_BUCKETS.map(dur => {
                      const cell = HEATMAP_DATA.find(c => c.rating === rating && c.duration === dur)
                      if (!cell) return <td key={dur} className="px-2 py-2 text-center text-gray-300">—</td>
                      return (
                        <td
                          key={dur}
                          className="px-2 py-1.5 text-center"
                          style={{ backgroundColor: heatmapBg(cell.activeReturn) }}
                        >
                          <div className="font-medium tabular-nums text-gray-700">{cell.weight.toFixed(1)}%</div>
                          <div className={`text-[10px] tabular-nums ${cell.overUnder >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                            {cell.overUnder >= 0 ? '+' : ''}{cell.overUnder.toFixed(1)}%
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Attribution par Rating + Donut */}
        <div className="grid grid-cols-[1fr_320px] gap-3">
          <Section title="Attribution par rating" icon={Activity}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pds Fonds</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pds Bench</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rdt Fonds</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rdt Bench</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Allocation</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sélection</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingData.map(row => (
                    <tr
                      key={row.rating}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedRating === row.rating ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                      onClick={() => handleRatingClick(row.rating)}
                    >
                      <td className="px-2 py-2 font-medium text-gray-800">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RATING_COLORS[row.rating] }} />
                          {row.rating}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-600">{row.weightFund.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-400">{row.weightBench.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-600">{row.returnFund.toFixed(1)}%</td>
                      <td className="px-2 py-2 text-right tabular-nums text-gray-400">{row.returnBench.toFixed(1)}%</td>
                      <td className={`px-2 py-2 text-right tabular-nums font-medium ${effectColor(row.allocation)}`} style={{ backgroundColor: effectBg(row.allocation) }}>
                        {fmtPct(row.allocation, 2)}
                      </td>
                      <td className={`px-2 py-2 text-right tabular-nums font-medium ${effectColor(row.selection)}`} style={{ backgroundColor: effectBg(row.selection) }}>
                        {fmtPct(row.selection, 2)}
                      </td>
                      <td className={`px-2 py-2 text-right tabular-nums font-semibold ${effectColor(row.total)}`} style={{ backgroundColor: effectBg(row.total) }}>
                        {fmtPct(row.total, 2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-200 font-semibold">
                    <td className="px-2 py-2 text-gray-800">Total</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">100.0%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-400">100.0%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">—</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-400">—</td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(ratingTotals.allocation)}`}>{fmtPct(ratingTotals.allocation, 2)}</td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(ratingTotals.selection)}`}>{fmtPct(ratingTotals.selection, 2)}</td>
                    <td className={`px-2 py-2 text-right tabular-nums ${effectColor(ratingTotals.total)}`}>{fmtPct(ratingTotals.total, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Répartition par rating" icon={DollarSign}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingPieData}
                    cx="50%" cy="45%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={2} dataKey="value" stroke="none"
                    onClick={(entry: any) => handleRatingClick(entry.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {ratingPieData.map(entry => (
                      <Cell key={entry.name} fill={RATING_COLORS[entry.name]} opacity={selectedRating && selectedRating !== entry.name ? 0.3 : 1} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Spread Decomposition + Top/Bottom */}
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <Section title="Décomposition du spread" icon={BarChart3}>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spreadWaterfallData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip content={<WaterfallTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                  <Bar dataKey="positive" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="negative" stackId="wf" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subtotal" stackId="wf" fill="#6366f1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Top / Bottom contributeurs spread" icon={Activity}>
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Top 5</div>
              {SPREAD_TOP_BOTTOM.slice(0, 5).map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RATING_COLORS[item.rating] }} />
                  <span className="text-gray-700 flex-1 truncate">{item.name}</span>
                  <span className="text-[10px] text-gray-400">{item.rating}</span>
                  <span className="tabular-nums font-medium text-emerald-600">{fmtPct(item.contribution, 2)}</span>
                </div>
              ))}
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Bottom 5</div>
              {SPREAD_TOP_BOTTOM.slice(5).map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RATING_COLORS[item.rating] }} />
                  <span className="text-gray-700 flex-1 truncate">{item.name}</span>
                  <span className="text-[10px] text-gray-400">{item.rating}</span>
                  <span className="tabular-nums font-medium text-red-500">{fmtPct(item.contribution, 2)}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Multi-period Attribution */}
        <Section title="Attribution multi-périodes" icon={BarChart3}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_DATA} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<MonthlyTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                {FACTOR_META.map(f => (
                  <Bar key={f.key} dataKey={f.key} stackId="monthly" fill={f.color} name={f.label} />
                ))}
                <Line dataKey="total" stroke="#1a1a1f" strokeWidth={2} dot={{ r: 3, fill: '#1a1a1f' }} name="Total" type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Bond Table */}
        <Section title="Détail par position" icon={Landmark}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[150px]">Émetteur</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[120px]">ISIN</th>
                  <SortHeader label="Coupon" column="coupon" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Maturité</th>
                  <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  <SortHeader label="OAS" column="oas" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Duration" column="duration" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="DTS" column="dts" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Poids" column="weight" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Contrib." column="contribution" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedBonds.map(bond => (
                  <tr key={bond.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2 font-medium text-gray-800">{bond.issuer}</td>
                    <td className="px-2 py-2 text-gray-400 font-mono text-[10px]">{bond.isin}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{bond.coupon.toFixed(2)}%</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-500">{bond.maturity}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: `${RATING_COLORS[bond.rating]}15`, color: RATING_COLORS[bond.rating] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RATING_COLORS[bond.rating] }} />
                        {bond.rating}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{bond.oas}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{bond.duration.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{bond.dts}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{bond.weight.toFixed(1)}%</td>
                    <td className="px-2 py-2 text-right tabular-nums font-semibold" style={{ backgroundColor: effectBg(bond.contribution) }}>
                      <span className={bond.contribution >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                        {fmtPct(bond.contribution)}
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
