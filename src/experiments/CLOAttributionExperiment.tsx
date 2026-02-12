import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, Filter, X,
  ChevronUp, ChevronDown, Activity, Layers, ShieldCheck, AlertTriangle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface WaterfallStep {
  name: string
  value: number
  isSubtotal?: boolean
  isTotal?: boolean
  isGate?: boolean
}

interface WaterfallBar {
  name: string
  invisible: number
  positive: number
  negative: number
  subtotal: number
  gate: number
  originalValue: number
  isGate?: boolean
}

interface Tranche {
  name: string
  rating: string
  notional: number
  spread: number
  subordination: number
  color: string
}

interface OCICTest {
  name: string
  ratio: number
  trigger: number
  cushion: number
  status: 'pass' | 'watch' | 'fail'
}

interface DefaultEvent {
  date: string
  borrower: string
  amount: number
  type: string
  recovery: number
  loss: number
}

interface Loan {
  id: number
  borrower: string
  sector: string
  rating: string
  spread: number
  price: number
  maturity: string
  amount: number
  weight: number
  isCCC: boolean
  isDefault: boolean
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const SECTOR_COLORS: Record<string, string> = {
  'Santé': '#10b981',
  'Technologie': '#6366f1',
  'Industrie': '#8b5cf6',
  'Télécom': '#ec4899',
  'Énergie': '#f59e0b',
  'Finance': '#0ea5e9',
  'Médias': '#f97316',
  'Consommation': '#14b8a6',
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const TRANCHES: Tranche[] = [
  { name: 'Classe A (AAA)', rating: 'AAA', notional: 256, spread: 135, subordination: 38.0, color: '#22c55e' },
  { name: 'Classe B (AA)', rating: 'AA', notional: 48, spread: 185, subordination: 26.4, color: '#86efac' },
  { name: 'Classe C (A)', rating: 'A', notional: 28, spread: 245, subordination: 19.6, color: '#0ea5e9' },
  { name: 'Classe D (BBB)', rating: 'BBB', notional: 24, spread: 345, subordination: 13.8, color: '#f59e0b' },
  { name: 'Classe E (BB)', rating: 'BB', notional: 20, spread: 625, subordination: 8.9, color: '#f97316' },
  { name: 'Equity', rating: 'Equity', notional: 37, spread: 0, subordination: 0, color: '#ef4444' },
]

const CASHFLOW_WATERFALL: WaterfallStep[] = [
  { name: 'Revenus intérêts', value: 28.5 },
  { name: 'Frais senior', value: -1.2 },
  { name: 'Intérêts AAA', value: -8.6 },
  { name: 'Intérêts AA', value: -2.2 },
  { name: 'Intérêts A', value: -1.7 },
  { name: 'Test OC Senior', value: 0, isGate: true },
  { name: 'Test IC Senior', value: 0, isGate: true },
  { name: 'Intérêts Mezz', value: -3.8 },
  { name: 'Test OC Junior', value: 0, isGate: true },
  { name: 'Equity résiduel', value: 11.0, isTotal: true },
]

const CARRY_WATERFALL: WaterfallStep[] = [
  { name: 'WAS', value: 3.85 },
  { name: 'SOFR income', value: 1.20 },
  { name: 'Revenu total', value: 5.05, isSubtotal: true },
  { name: 'Coût AAA', value: -1.85 },
  { name: 'Coût AA', value: -0.48 },
  { name: 'Coût A', value: -0.37 },
  { name: 'Coût BBB-BB', value: -0.82 },
  { name: 'Frais', value: -0.28 },
  { name: 'Carry brut', value: 1.25, isSubtotal: true },
  { name: 'Pertes crédit', value: -0.35 },
  { name: 'Carry net', value: 0.90, isTotal: true },
]

const OC_IC_TESTS: OCICTest[] = [
  { name: 'AAA OC', ratio: 148.2, trigger: 128.0, cushion: 20.2, status: 'pass' },
  { name: 'AA OC', ratio: 132.5, trigger: 118.5, cushion: 14.0, status: 'pass' },
  { name: 'BBB OC', ratio: 118.8, trigger: 110.0, cushion: 8.8, status: 'pass' },
  { name: 'BB OC', ratio: 108.5, trigger: 105.0, cushion: 3.5, status: 'watch' },
  { name: 'Senior IC', ratio: 185.2, trigger: 120.0, cushion: 65.2, status: 'pass' },
  { name: 'Junior IC', ratio: 132.8, trigger: 110.0, cushion: 22.8, status: 'pass' },
]

const COLLATERAL_SECTORS = [
  { name: 'Santé', value: 18.5 },
  { name: 'Technologie', value: 16.2 },
  { name: 'Industrie', value: 14.8 },
  { name: 'Télécom', value: 12.5 },
  { name: 'Énergie', value: 11.2 },
  { name: 'Finance', value: 10.8 },
  { name: 'Médias', value: 9.5 },
  { name: 'Consommation', value: 6.5 },
]

const DEFAULT_TRACKING = [
  { period: 'T1 22', cumulLoss: 0.0, marketRate: 0.0 },
  { period: 'T2 22', cumulLoss: 0.0, marketRate: 0.1 },
  { period: 'T3 22', cumulLoss: 0.2, marketRate: 0.3 },
  { period: 'T4 22', cumulLoss: 0.2, marketRate: 0.5 },
  { period: 'T1 23', cumulLoss: 0.5, marketRate: 0.8 },
  { period: 'T2 23', cumulLoss: 0.5, marketRate: 1.0 },
  { period: 'T3 23', cumulLoss: 0.8, marketRate: 1.3 },
  { period: 'T4 23', cumulLoss: 1.2, marketRate: 1.5 },
  { period: 'T1 24', cumulLoss: 1.2, marketRate: 1.7 },
  { period: 'T2 24', cumulLoss: 1.5, marketRate: 1.9 },
  { period: 'T3 24', cumulLoss: 1.8, marketRate: 2.1 },
  { period: 'T4 24', cumulLoss: 1.8, marketRate: 2.3 },
]

const DEFAULT_EVENTS: DefaultEvent[] = [
  { date: '2023-03-15', borrower: 'Envision Healthcare', amount: 4.2, type: 'Bankruptcy', recovery: 35, loss: 2.73 },
  { date: '2023-07-22', borrower: 'Monitronics', amount: 2.8, type: 'Distressed exchange', recovery: 55, loss: 1.26 },
  { date: '2024-01-10', borrower: 'Endo International', amount: 3.5, type: 'Payment default', recovery: 28, loss: 2.52 },
  { date: '2024-06-18', borrower: 'Carestream Health', amount: 2.1, type: 'Bankruptcy', recovery: 42, loss: 1.22 },
]

const LOANS: Loan[] = [
  { id: 1, borrower: 'Medline Industries', sector: 'Santé', rating: 'B2', spread: 325, price: 98.5, maturity: '2028-10-15', amount: 12.5, weight: 3.0, isCCC: false, isDefault: false },
  { id: 2, borrower: 'Athenahealth', sector: 'Technologie', rating: 'B2', spread: 350, price: 97.8, maturity: '2029-02-15', amount: 10.8, weight: 2.6, isCCC: false, isDefault: false },
  { id: 3, borrower: 'Asurion', sector: 'Technologie', rating: 'B1', spread: 310, price: 99.2, maturity: '2027-11-03', amount: 9.5, weight: 2.3, isCCC: false, isDefault: false },
  { id: 4, borrower: 'McAfee', sector: 'Technologie', rating: 'B3', spread: 375, price: 96.5, maturity: '2029-03-01', amount: 8.2, weight: 2.0, isCCC: false, isDefault: false },
  { id: 5, borrower: 'TransDigm', sector: 'Industrie', rating: 'B1', spread: 295, price: 99.8, maturity: '2028-08-22', amount: 11.2, weight: 2.7, isCCC: false, isDefault: false },
  { id: 6, borrower: 'SS&C Technologies', sector: 'Technologie', rating: 'B1', spread: 285, price: 99.5, maturity: '2028-05-10', amount: 7.8, weight: 1.9, isCCC: false, isDefault: false },
  { id: 7, borrower: 'Bausch Health', sector: 'Santé', rating: 'Caa1', spread: 525, price: 88.5, maturity: '2027-06-30', amount: 6.5, weight: 1.6, isCCC: true, isDefault: false },
  { id: 8, borrower: 'Numericable', sector: 'Télécom', rating: 'B2', spread: 340, price: 97.2, maturity: '2028-07-31', amount: 8.8, weight: 2.1, isCCC: false, isDefault: false },
  { id: 9, borrower: 'Citrix Systems', sector: 'Technologie', rating: 'B3', spread: 410, price: 94.8, maturity: '2029-08-15', amount: 5.5, weight: 1.3, isCCC: false, isDefault: false },
  { id: 10, borrower: 'Envision Healthcare', sector: 'Santé', rating: 'D', spread: 0, price: 35.0, maturity: '2027-10-01', amount: 4.2, weight: 1.0, isCCC: false, isDefault: true },
  { id: 11, borrower: 'Intelsat', sector: 'Télécom', rating: 'B3', spread: 450, price: 93.2, maturity: '2029-01-15', amount: 5.8, weight: 1.4, isCCC: false, isDefault: false },
  { id: 12, borrower: 'Mauser Packaging', sector: 'Industrie', rating: 'B2', spread: 365, price: 96.8, maturity: '2028-04-03', amount: 7.2, weight: 1.7, isCCC: false, isDefault: false },
]

// ─── Computations ────────────────────────────────────────────────────────────

function computeWaterfall(steps: WaterfallStep[]): WaterfallBar[] {
  let running = 0
  return steps.map(step => {
    if (step.isGate) {
      return { name: step.name, invisible: 0, positive: 0, negative: 0, subtotal: 0, gate: running, originalValue: 0, isGate: true }
    }
    if (step.isSubtotal || step.isTotal) {
      return { name: step.name, invisible: 0, positive: 0, negative: 0, subtotal: step.value, gate: 0, originalValue: step.value }
    }
    if (step.value >= 0) {
      const bar = { name: step.name, invisible: running, positive: step.value, negative: 0, subtotal: 0, gate: 0, originalValue: step.value }
      running += step.value
      return bar
    }
    running += step.value
    return { name: step.name, invisible: running, positive: 0, negative: -step.value, subtotal: 0, gate: 0, originalValue: step.value }
  })
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtPct(v: number, decimals = 1, sign = true): string {
  const s = sign && v > 0 ? '+' : ''
  return `${s}${v.toFixed(decimals)}%`
}

function fmtEur(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} Md€`
  return `${v.toFixed(1)} M€`
}

function statusColor(status: string): string {
  switch (status) {
    case 'pass': return 'text-emerald-600 bg-emerald-50'
    case 'watch': return 'text-amber-600 bg-amber-50'
    case 'fail': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'pass': return 'Pass'
    case 'watch': return 'Watch'
    case 'fail': return 'Fail'
    default: return '—'
  }
}

// ─── Tooltips ────────────────────────────────────────────────────────────────

function CashflowTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  if (entry.isGate) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
        <div className="font-medium text-amber-600">{label}</div>
        <div className="text-xs text-gray-500">Test de couverture — Pass</div>
      </div>
    )
  }
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
      <div className="font-medium text-gray-800">{label}</div>
      <div className={`font-semibold tabular-nums ${entry.originalValue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {fmtEur(entry.originalValue)}
      </div>
    </div>
  )
}

function CarryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-sm border border-gray-200">
      <div className="font-medium text-gray-800">{label}</div>
      <div className={`font-semibold tabular-nums ${entry.originalValue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {fmtPct(entry.originalValue)}
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
        <Icon className="w-4.5 h-4.5 text-amber-600" />
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

export function CLOAttributionExperiment() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('weight')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const cashflowWaterfall = useMemo(() => computeWaterfall(CASHFLOW_WATERFALL), [])
  const carryWaterfall = useMemo(() => computeWaterfall(CARRY_WATERFALL), [])

  const totalNotional = useMemo(() => TRANCHES.reduce((s, t) => s + t.notional, 0), [])

  const sortedLoans = useMemo(() => {
    const filtered = selectedSector ? LOANS.filter(l => l.sector === selectedSector) : LOANS
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn as keyof Loan]
      const bVal = b[sortColumn as keyof Loan]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal
      }
      return 0
    })
  }, [selectedSector, sortColumn, sortDirection])

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
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Decider CLO 2022-I</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium text-[10px]">CLO 2.0</span>
                <span>Manager : Decider AM</span>
                <span className="text-gray-300">·</span>
                <span>Millésime 2022</span>
                <span className="text-gray-300">·</span>
                <span>413 M€ collatéral</span>
                <span className="text-gray-300">·</span>
                <span>Fin réinvest. : Juil 2027</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedSector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 bg-amber-50 rounded-full px-2.5 py-1 text-xs text-amber-700 font-medium"
              >
                <Filter className="w-3 h-3" />
                <span>{selectedSector}</span>
                <button onClick={() => setSelectedSector(null)} className="hover:text-amber-900">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            <div className="text-xs text-gray-400">
              Reporting : 31/12/2024
            </div>
          </div>
        </div>
      </motion.header>

      {/* Scrollable dashboard */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-6 gap-2">
          <KPICard label="Encours collatéral" value="413 M€" trend="neutral" sub="185 prêts" />
          <KPICard label="WAS" value="385 bps" trend="up" sub="spread moyen pondéré" />
          <KPICard label="WARF" value="2 820" trend="neutral" sub="≈ B2" />
          <KPICard label="OC ratio junior" value="108.5%" trend="down" sub="trigger 105.0%" />
          <KPICard label="Carry net" value="0.90%" trend="up" sub="equity annualisé" />
          <KPICard label="Défaut cumulé" value="1.8%" trend="down" sub="vs 2.3% marché" />
        </motion.div>

        {/* Capital Structure */}
        <Section title="Structure du capital" icon={Layers}>
          <div className="space-y-2">
            {TRANCHES.map(tranche => {
              const pct = (tranche.notional / totalNotional) * 100
              return (
                <div key={tranche.name} className="flex items-center gap-3">
                  <div className="w-[100px] text-xs font-medium text-gray-700 shrink-0">{tranche.name}</div>
                  <div className="flex-1 relative h-7 bg-gray-50 rounded-md overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-md flex items-center px-2"
                      style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: `${tranche.color}30` }}
                    >
                      <span className="text-[10px] font-semibold tabular-nums text-gray-700">{fmtEur(tranche.notional)}</span>
                    </div>
                  </div>
                  <div className="w-[70px] text-right text-[10px] tabular-nums text-gray-500">{pct.toFixed(1)}%</div>
                  <div className="w-[80px] text-right text-[10px] tabular-nums text-gray-500">
                    {tranche.spread > 0 ? `S+${tranche.spread}` : '—'}
                  </div>
                  <div className="w-[70px] text-right text-[10px] tabular-nums text-gray-400">
                    Sub. {tranche.subordination.toFixed(1)}%
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Cashflow Waterfall + Carry Waterfall */}
        <div className="grid grid-cols-2 gap-3">
          <Section title="Cascade de cash-flows" icon={BarChart3}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowWaterfall} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}M€`} />
                  <Tooltip content={<CashflowTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                  <Bar dataKey="positive" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="negative" stackId="wf" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subtotal" stackId="wf" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="gate" stackId="wf" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Décomposition du carry" icon={BarChart3}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carryWaterfall} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip content={<CarryTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="invisible" stackId="wf" fill="transparent" isAnimationActive={false} />
                  <Bar dataKey="positive" stackId="wf" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="negative" stackId="wf" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subtotal" stackId="wf" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* OC/IC Gauges */}
        <Section title="Tests de couverture OC / IC" icon={ShieldCheck}>
          <div className="grid grid-cols-6 gap-3">
            {OC_IC_TESTS.map(test => {
              const pctFilled = Math.min((test.ratio / (test.trigger * 1.5)) * 100, 100)
              const triggerPct = (test.trigger / (test.trigger * 1.5)) * 100
              return (
                <div key={test.name} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">{test.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColor(test.status)}`}>
                      {statusLabel(test.status)}
                    </span>
                  </div>
                  <div className="text-lg font-semibold tabular-nums text-gray-900 mb-1">{test.ratio.toFixed(1)}%</div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all"
                      style={{
                        width: `${pctFilled}%`,
                        backgroundColor: test.status === 'pass' ? '#10b981' : test.status === 'watch' ? '#f59e0b' : '#ef4444',
                      }}
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 bg-gray-600"
                      style={{ left: `${triggerPct}%` }}
                      title={`Trigger: ${test.trigger}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Trigger {test.trigger.toFixed(1)}%</span>
                    <span>Coussin {test.cushion.toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Donut Collateral + Default Tracking */}
        <div className="grid grid-cols-[320px_1fr] gap-3">
          <Section title="Répartition du collatéral" icon={Activity}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COLLATERAL_SECTORS}
                    cx="50%" cy="45%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={2} dataKey="value" stroke="none"
                    onClick={(entry: any) => handleSectorClick(entry.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {COLLATERAL_SECTORS.map(entry => (
                      <Cell
                        key={entry.name}
                        fill={SECTOR_COLORS[entry.name] || '#94a3b8'}
                        opacity={selectedSector && selectedSector !== entry.name ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#6b7280' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Suivi des défauts" icon={AlertTriangle}>
            <div className="h-[200px] mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEFAULT_TRACKING}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value: any, name: any) => [`${value}%`, name === 'cumulLoss' ? 'CLO' : 'Marché']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                  <Area type="stepAfter" dataKey="cumulLoss" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="CLO" strokeWidth={2} />
                  <Area type="monotone" dataKey="marketRate" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.08} name="Marché" strokeWidth={1.5} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Emprunteur</th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Encours</th>
                    <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Recovery</th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Perte</th>
                  </tr>
                </thead>
                <tbody>
                  {DEFAULT_EVENTS.map((evt, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-2 py-1.5 text-gray-500">{evt.date}</td>
                      <td className="px-2 py-1.5 font-medium text-gray-800">{evt.borrower}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-gray-600">{fmtEur(evt.amount)}</td>
                      <td className="px-2 py-1.5 text-gray-500">{evt.type}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-gray-600">{evt.recovery}%</td>
                      <td className="px-2 py-1.5 text-right tabular-nums font-medium text-red-500">{fmtEur(evt.loss)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* Loan Table */}
        <Section title="Portefeuille de collatéral" icon={Layers}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[150px]">Emprunteur</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secteur</th>
                  <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  <SortHeader label="Spread" column="spread" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Prix" column="price" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Maturité</th>
                  <SortHeader label="Encours" column="amount" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                  <SortHeader label="Poids" column="weight" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedLoans.map(loan => (
                  <tr
                    key={loan.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                      loan.isDefault ? 'bg-red-50/40' : loan.isCCC ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="px-2 py-2 font-medium text-gray-800">
                      <div className="flex items-center gap-1.5">
                        {loan.isDefault && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                        {loan.isCCC && !loan.isDefault && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                        {loan.borrower}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: `${SECTOR_COLORS[loan.sector] || '#94a3b8'}15`, color: SECTOR_COLORS[loan.sector] || '#94a3b8' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[loan.sector] || '#94a3b8' }} />
                        {loan.sector}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        loan.isDefault ? 'bg-red-100 text-red-700'
                        : loan.isCCC ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                        {loan.rating}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">
                      {loan.spread > 0 ? `S+${loan.spread}` : '—'}
                    </td>
                    <td className={`px-2 py-2 text-right tabular-nums ${loan.price < 90 ? 'text-red-500 font-medium' : loan.price < 95 ? 'text-amber-600' : 'text-gray-600'}`}>
                      {loan.price.toFixed(1)}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-500">{loan.maturity}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-700 font-medium">{fmtEur(loan.amount)}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-gray-600">{loan.weight.toFixed(1)}%</td>
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
