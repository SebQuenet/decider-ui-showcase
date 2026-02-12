import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposedChart, BarChart, Bar, AreaChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from 'recharts'
import {
  Calendar, DollarSign, TrendingUp, ArrowDownCircle, ArrowUpCircle,
  Clock, Flag, Landmark, FileText, AlertTriangle, ChevronRight,
  Banknote, PiggyBank, Activity, CircleDot,
} from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants, smoothTransition } from '../lib/animations'
import { Tabs } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { Chip } from '../components/ui/Chip'
import { formatCurrency, formatPercentage, formatDate } from '../lib/formatters'
import {
  mockFundLifecycles,
  mockCashFlows,
  mockMetricSnapshots,
  mockLifecycleEvents,
  getLatestSnapshot,
  getPhaseLabel,
  getPhaseColor,
  STRATEGY_COLORS,
} from '../mocks/mockFundLifecycle'
import type { FundLifecycle, FundLifecyclePhase, LifecycleEventType } from '../types/finance'

// ─── Types locaux ────────────────────────────────────────────────────────────

interface QuarterlyCashFlow {
  quarter: string
  calls: number
  distributions: number
  net: number
  cumulative: number
}

interface JCurvePoint {
  year: number
  cumulativeNet: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const PHASE_ORDER: FundLifecyclePhase[] = [
  'fundraising', 'investment_period', 'harvest', 'extension', 'liquidation', 'terminated',
]

const DETAIL_TABS = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'cashflows', label: 'Cash Flows' },
  { id: 'jcurve', label: 'J-Curve' },
]

const EVENT_ICONS: Record<LifecycleEventType, React.ElementType> = {
  first_close: Flag,
  final_close: Landmark,
  capital_call: ArrowDownCircle,
  distribution: ArrowUpCircle,
  exit: DollarSign,
  investment_period_end: Clock,
  extension: Calendar,
  key_person_event: AlertTriangle,
  liquidation: FileText,
}

const CASH_FLOW_TYPE_LABELS: Record<string, string> = {
  capital_call: 'Appel de fonds',
  management_fee: 'Frais de gestion',
  fund_expense: 'Frais du fonds',
  return_of_capital: 'Retour de capital',
  capital_gain: 'Plus-value',
  income_distribution: 'Distribution de revenus',
  recallable_distribution: 'Distribution rappelable',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPhaseSegments(fund: FundLifecycle) {
  const firstCloseYear = new Date(fund.firstCloseDate).getFullYear()
  const termYear = fund.actualTermDate
    ? new Date(fund.actualTermDate).getFullYear()
    : new Date(fund.expectedTermDate).getFullYear()
  const totalYears = Math.max(1, termYear - firstCloseYear)

  const segments: { phase: FundLifecyclePhase; startPct: number; widthPct: number }[] = []

  // Fundraising: first close to final close (or +1 year)
  const fundraisingEnd = fund.finalCloseDate
    ? new Date(fund.finalCloseDate).getFullYear()
    : firstCloseYear + 1
  const fundraisingWidth = Math.max(0.5, (fundraisingEnd - firstCloseYear) / totalYears) * 100

  segments.push({ phase: 'fundraising', startPct: 0, widthPct: Math.min(fundraisingWidth, 100) })

  // Investment period
  const investEnd = fund.investmentPeriodEndDate
    ? new Date(fund.investmentPeriodEndDate).getFullYear()
    : firstCloseYear + fund.investmentPeriodYears
  const investStart = fundraisingEnd
  const investWidth = Math.max(0, (investEnd - investStart) / totalYears) * 100
  const investStartPct = ((investStart - firstCloseYear) / totalYears) * 100

  if (investWidth > 0) {
    segments.push({ phase: 'investment_period', startPct: investStartPct, widthPct: investWidth })
  }

  // Harvest: from investment end to term or extension
  const harvestStart = investEnd
  const harvestEnd = termYear
  const harvestWidth = Math.max(0, (harvestEnd - harvestStart) / totalYears) * 100
  const harvestStartPct = ((harvestStart - firstCloseYear) / totalYears) * 100

  if (harvestWidth > 0) {
    if (fund.phase === 'extension' || fund.phase === 'liquidation' || fund.phase === 'terminated') {
      const expTermYear = new Date(fund.expectedTermDate).getFullYear()
      const mainHarvestWidth = Math.max(0, (expTermYear - harvestStart) / totalYears) * 100
      if (mainHarvestWidth > 0) {
        segments.push({ phase: 'harvest', startPct: harvestStartPct, widthPct: mainHarvestWidth })
      }
      const extStartPct = ((expTermYear - firstCloseYear) / totalYears) * 100
      const extWidth = Math.max(0, (termYear - expTermYear) / totalYears) * 100
      if (extWidth > 0) {
        const extPhase = fund.phase === 'liquidation' || fund.phase === 'terminated' ? fund.phase : 'extension'
        segments.push({ phase: extPhase, startPct: extStartPct, widthPct: extWidth })
      }
    } else {
      segments.push({ phase: 'harvest', startPct: harvestStartPct, widthPct: harvestWidth })
    }
  }

  return { segments, totalYears, firstCloseYear, termYear }
}

function getCurrentPositionPct(fund: FundLifecycle): number {
  const firstCloseYear = new Date(fund.firstCloseDate).getFullYear()
  const termYear = fund.actualTermDate
    ? new Date(fund.actualTermDate).getFullYear()
    : new Date(fund.expectedTermDate).getFullYear()
  const totalYears = Math.max(1, termYear - firstCloseYear)
  const currentYear = 2026
  return Math.min(100, Math.max(0, ((currentYear - firstCloseYear) / totalYears) * 100))
}

function aggregateQuarterlyCashFlows(fundId: string): QuarterlyCashFlow[] {
  const fundFlows = mockCashFlows.filter(f => f.fundId === fundId)
  const quarterMap = new Map<string, { calls: number; distributions: number }>()

  for (const flow of fundFlows) {
    const year = flow.date.substring(0, 4)
    const month = parseInt(flow.date.substring(5, 7))
    const q = month <= 3 ? 'T1' : month <= 6 ? 'T2' : month <= 9 ? 'T3' : 'T4'
    const key = `${q} ${year.substring(2)}`
    const entry = quarterMap.get(key) ?? { calls: 0, distributions: 0 }
    if (flow.amount < 0) {
      entry.calls += flow.amount
    } else {
      entry.distributions += flow.amount
    }
    quarterMap.set(key, entry)
  }

  const quarters = Array.from(quarterMap.entries())
    .sort((a, b) => {
      const [qa, ya] = a[0].split(' ')
      const [qb, yb] = b[0].split(' ')
      const yearDiff = parseInt(ya) - parseInt(yb)
      if (yearDiff !== 0) return yearDiff
      return parseInt(qa.replace('T', '')) - parseInt(qb.replace('T', ''))
    })

  let cumulative = 0
  return quarters.map(([quarter, data]) => {
    const net = data.calls + data.distributions
    cumulative += net
    return { quarter, calls: data.calls, distributions: data.distributions, net, cumulative }
  })
}

function computeJCurveData(fundId: string): JCurvePoint[] {
  const fund = mockFundLifecycles.find(f => f.fundId === fundId)
  if (!fund) return []

  const fundFlows = mockCashFlows.filter(f => f.fundId === fundId && !f.isEstimate)
  const vintageYear = fund.vintageYear
  const yearMap = new Map<number, number>()

  let cumulative = 0
  for (const flow of fundFlows.sort((a, b) => a.date.localeCompare(b.date))) {
    const year = parseInt(flow.date.substring(0, 4))
    const yearsSinceVintage = year - vintageYear
    cumulative += flow.amount
    yearMap.set(yearsSinceVintage, cumulative)
  }

  const points: JCurvePoint[] = []
  const maxYear = Math.max(...Array.from(yearMap.keys()), 0)
  let lastValue = 0
  for (let y = 0; y <= maxYear; y++) {
    lastValue = yearMap.get(y) ?? lastValue
    points.push({ year: y, cumulativeNet: lastValue })
  }

  // Ajouter la NAV au dernier point
  const latestSnapshot = getLatestSnapshot(fundId)
  if (latestSnapshot && points.length > 0) {
    points[points.length - 1].cumulativeNet += latestSnapshot.nav
  }

  return points
}

// ─── Tooltips ────────────────────────────────────────────────────────────────

function CashFlowChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  return (
    <div className="bg-surface shadow-lg rounded-lg px-3 py-2 text-small border border-border">
      <div className="font-medium text-text-primary mb-1">{label}</div>
      {data.calls !== 0 && (
        <div className="flex justify-between gap-4">
          <span className="text-danger">Appels</span>
          <span className="font-data font-medium text-danger">{formatCurrency(data.calls, 'EUR', { compact: true })}</span>
        </div>
      )}
      {data.distributions !== 0 && (
        <div className="flex justify-between gap-4">
          <span className="text-success">Distributions</span>
          <span className="font-data font-medium text-success">{formatCurrency(data.distributions, 'EUR', { compact: true })}</span>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t border-border-muted mt-1 pt-1">
        <span className="text-text-secondary">Cumulatif</span>
        <span className="font-data font-medium text-accent">{formatCurrency(data.cumulative, 'EUR', { compact: true })}</span>
      </div>
    </div>
  )
}

function JCurveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  return (
    <div className="bg-surface shadow-lg rounded-lg px-3 py-2 text-small border border-border">
      <div className="font-medium text-text-primary">Annee {label}</div>
      <div className={`font-data font-semibold ${data.cumulativeNet >= 0 ? 'text-success' : 'text-danger'}`}>
        {formatCurrency(data.cumulativeNet, 'EUR', { compact: true })}
      </div>
    </div>
  )
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function PhaseProgressBar({ fund, large = false }: { fund: FundLifecycle; large?: boolean }) {
  const { segments } = getPhaseSegments(fund)
  const positionPct = getCurrentPositionPct(fund)
  const height = large ? 'h-6' : 'h-2'

  return (
    <div className="relative w-full">
      <div className={`relative ${height} rounded-full overflow-hidden bg-surface-tertiary flex`}>
        {segments.map((seg, i) => (
          <div
            key={i}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${seg.widthPct}%`,
              backgroundColor: getPhaseColor(seg.phase),
              opacity: 0.7,
            }}
          />
        ))}
      </div>
      {fund.phase !== 'terminated' && (
        <div
          className="absolute top-0 -translate-x-1/2"
          style={{ left: `${positionPct}%` }}
        >
          <div
            className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-text-primary ${
              large ? '-mt-1' : '-mt-0.5'
            }`}
          />
        </div>
      )}
      {large && (
        <div className="flex justify-between mt-1">
          {segments.map((seg, i) => (
            <span
              key={i}
              className="text-[10px] text-text-muted"
              style={{ width: `${seg.widthPct}%`, textAlign: 'center' }}
            >
              {getPhaseLabel(seg.phase)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function KPICard({ label, value, icon: Icon }: {
  label: string
  value: string
  icon?: React.ElementType
}) {
  return (
    <div className="bg-surface-secondary rounded-xl border border-border-muted px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="w-3 h-3 text-text-muted" />}
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-data text-lg font-semibold text-text-primary">{value}</div>
    </div>
  )
}

// ─── Panneau gauche : liste des fonds ────────────────────────────────────────

function FundListPanel({
  funds,
  selectedFundId,
  onSelect,
  phaseFilter,
  strategyFilter,
  onPhaseFilterChange,
  onStrategyFilterChange,
}: {
  funds: FundLifecycle[]
  selectedFundId: string
  onSelect: (id: string) => void
  phaseFilter: FundLifecyclePhase | null
  strategyFilter: string | null
  onPhaseFilterChange: (phase: FundLifecyclePhase | null) => void
  onStrategyFilterChange: (strategy: string | null) => void
}) {
  const phases: { id: FundLifecyclePhase | null; label: string }[] = [
    { id: null, label: 'Tous' },
    ...PHASE_ORDER.map(p => ({ id: p, label: getPhaseLabel(p) })),
  ]

  const strategies = useMemo(() => {
    const set = new Set(mockFundLifecycles.map(f => f.strategy))
    return [null, ...Array.from(set)]
  }, [])

  return (
    <div className="w-[320px] shrink-0 flex flex-col border-r border-border bg-surface-secondary">
      {/* Filtres */}
      <div className="px-4 py-3 space-y-2 border-b border-border-muted">
        <div className="flex flex-wrap gap-1.5">
          {phases.map(p => (
            <Chip
              key={p.label}
              label={p.label}
              variant={phaseFilter === p.id ? 'active' : 'default'}
              onClick={() => onPhaseFilterChange(p.id)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {strategies.map(s => (
            <Chip
              key={s ?? 'all'}
              label={s ?? 'Toutes'}
              variant={strategyFilter === s ? 'active' : 'default'}
              onClick={() => onStrategyFilterChange(s)}
            />
          ))}
        </div>
      </div>

      {/* Liste des fonds */}
      <motion.div
        className="flex-1 min-h-0 overflow-y-auto"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {funds.map(fund => {
          const snapshot = getLatestSnapshot(fund.fundId)
          const isSelected = fund.fundId === selectedFundId
          return (
            <motion.div
              key={fund.fundId}
              variants={staggerItemVariants}
              onClick={() => onSelect(fund.fundId)}
              className={`px-4 py-3 cursor-pointer border-b border-border-muted transition-colors ${
                isSelected
                  ? 'bg-accent-muted border-l-2 border-l-accent'
                  : 'hover:bg-surface-tertiary'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="min-w-0 flex-1">
                  <div className="text-small font-semibold text-text-primary truncate">{fund.name}</div>
                  <div className="text-caption text-text-muted">{fund.gpName}</div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info" size="sm">
                  <span style={{ color: STRATEGY_COLORS[fund.strategy] }}>{fund.strategy}</span>
                </Badge>
                <span className="text-caption text-text-muted">{fund.vintageYear}</span>
              </div>
              <PhaseProgressBar fund={fund} />
              {snapshot && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-caption text-text-muted">TVPI</span>
                  <span className="font-data text-small font-semibold text-text-primary">{snapshot.tvpiNet.toFixed(2)}x</span>
                </div>
              )}
            </motion.div>
          )
        })}
        {funds.length === 0 && (
          <div className="px-4 py-8 text-center text-text-muted text-small">
            Aucun fonds ne correspond aux filtres.
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Onglet Timeline ─────────────────────────────────────────────────────────

function TimelineTab({ fund }: { fund: FundLifecycle }) {
  const snapshot = getLatestSnapshot(fund.fundId)
  const events = useMemo(
    () => mockLifecycleEvents.filter(e => e.fundId === fund.fundId),
    [fund.fundId],
  )
  const today = '2026-01-01'

  return (
    <motion.div
      className="space-y-4 p-4"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Barre de progression phases */}
      <motion.div variants={staggerItemVariants}>
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-medium text-text-secondary">Progression du fonds</span>
            <Badge
              variant={
                fund.phase === 'harvest' ? 'success'
                : fund.phase === 'investment_period' ? 'accent'
                : fund.phase === 'extension' ? 'warning'
                : fund.phase === 'liquidation' || fund.phase === 'terminated' ? 'danger'
                : 'default'
              }
              size="sm"
            >
              {getPhaseLabel(fund.phase)}
            </Badge>
          </div>
          <PhaseProgressBar fund={fund} large />
          <div className="flex items-center justify-center mt-2 gap-1 text-[10px] text-text-muted">
            <CircleDot className="w-3 h-3" />
            <span>Aujourd&apos;hui</span>
          </div>
        </div>
      </motion.div>

      {/* KPI row */}
      {snapshot && (
        <motion.div variants={staggerItemVariants} className="grid grid-cols-4 gap-2">
          <KPICard label="Engag." value={formatCurrency(fund.committed, fund.currency, { compact: true })} icon={Banknote} />
          <KPICard label="Appele" value={formatCurrency(snapshot.calledAmount, fund.currency, { compact: true })} icon={ArrowDownCircle} />
          <KPICard label="Distribue" value={formatCurrency(snapshot.distributedAmount, fund.currency, { compact: true })} icon={ArrowUpCircle} />
          <KPICard label="NAV" value={formatCurrency(snapshot.nav, fund.currency, { compact: true })} icon={PiggyBank} />
        </motion.div>
      )}
      {snapshot && (
        <motion.div variants={staggerItemVariants} className="grid grid-cols-4 gap-2">
          <KPICard label="Non appele" value={formatCurrency(snapshot.unfundedCommitment, fund.currency, { compact: true })} icon={Clock} />
          <KPICard label="IRR" value={`${snapshot.irrNetInception > 0 ? '+' : ''}${snapshot.irrNetInception.toFixed(1)}%`} icon={TrendingUp} />
          <KPICard label="TVPI" value={`${snapshot.tvpiNet.toFixed(2)}x`} icon={Activity} />
          <KPICard label="DPI" value={`${snapshot.dpiNet.toFixed(2)}x`} icon={DollarSign} />
        </motion.div>
      )}

      {/* Timeline verticale */}
      <motion.div variants={staggerItemVariants}>
        <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Evenements
        </div>
        <div className="relative">
          <div className="absolute left-[88px] top-0 bottom-0 w-px bg-border" />
          <motion.div
            className="space-y-0"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {events.map(event => {
              const isFuture = event.date > today
              const Icon = EVENT_ICONS[event.type] ?? Calendar
              return (
                <motion.div
                  key={event.id}
                  variants={staggerItemVariants}
                  className={`flex items-start gap-3 py-2.5 ${isFuture ? 'opacity-50' : ''}`}
                >
                  <div className="w-[76px] shrink-0 text-right">
                    <span className={`font-data text-caption ${isFuture ? 'text-text-muted italic' : 'text-text-secondary'}`}>
                      {formatDate(event.date, 'MMM yyyy')}
                    </span>
                  </div>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-surface border-2 border-border flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-small font-medium text-text-primary">{event.label}</div>
                    <div className="text-caption text-text-muted">{event.description}</div>
                    {event.amount && (
                      <span className="font-data text-caption font-medium text-accent">
                        {formatCurrency(event.amount, fund.currency, { compact: true })}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Onglet Cash Flows ───────────────────────────────────────────────────────

function CashFlowsTab({ fund }: { fund: FundLifecycle }) {
  const quarterlyData = useMemo(() => aggregateQuarterlyCashFlows(fund.fundId), [fund.fundId])
  const fundFlows = useMemo(
    () => mockCashFlows.filter(f => f.fundId === fund.fundId).sort((a, b) => b.date.localeCompare(a.date)),
    [fund.fundId],
  )

  const totalCalled = useMemo(
    () => fundFlows.filter(f => f.amount < 0 && !f.isEstimate).reduce((s, f) => s + Math.abs(f.amount), 0),
    [fundFlows],
  )
  const totalDistributed = useMemo(
    () => fundFlows.filter(f => f.amount > 0 && !f.isEstimate).reduce((s, f) => s + f.amount, 0),
    [fundFlows],
  )
  const netCashFlow = totalDistributed - totalCalled

  return (
    <motion.div
      className="space-y-4 p-4"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Chart */}
      <motion.div variants={staggerItemVariants} className="bg-surface-secondary rounded-xl border border-border-muted p-4">
        <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Flux trimestriels
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={quarterlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
              <XAxis
                dataKey="quarter"
                tick={{ fontSize: 10, fill: '#91919f' }}
                axisLine={{ stroke: '#dee2e6' }}
                tickLine={false}
                interval={Math.max(0, Math.floor(quarterlyData.length / 12) - 1)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#91919f' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip content={<CashFlowChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <ReferenceLine y={0} stroke="#dee2e6" />
              <Bar dataKey="calls" fill="#dc2626" radius={[2, 2, 0, 0]} name="Appels" />
              <Bar dataKey="distributions" fill="#16a34a" radius={[2, 2, 0, 0]} name="Distributions" />
              <Line
                dataKey="cumulative"
                stroke="#29abb5"
                strokeWidth={2}
                dot={false}
                name="Cumulatif net"
                type="monotone"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Summary row */}
      <motion.div variants={staggerItemVariants} className="grid grid-cols-3 gap-3">
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Total appele</div>
          <div className="font-data text-h4 font-semibold text-danger">
            {formatCurrency(totalCalled, fund.currency, { compact: true })}
          </div>
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Total distribue</div>
          <div className="font-data text-h4 font-semibold text-success">
            {formatCurrency(totalDistributed, fund.currency, { compact: true })}
          </div>
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Flux net</div>
          <div className={`font-data text-h4 font-semibold ${netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(netCashFlow, fund.currency, { compact: true })}
          </div>
        </div>
      </motion.div>

      {/* Table des flux */}
      <motion.div variants={staggerItemVariants} className="bg-surface-secondary rounded-xl border border-border-muted overflow-hidden">
        <div className="px-4 py-2 border-b border-border-muted">
          <span className="text-caption font-semibold text-text-secondary uppercase tracking-wider">
            Detail des flux
          </span>
        </div>
        <div className="overflow-y-auto max-h-[300px]">
          <table className="w-full text-small">
            <thead className="sticky top-0 bg-surface-secondary">
              <tr className="border-b border-border-muted">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Montant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {fundFlows.map(flow => {
                const isCall = flow.amount < 0
                return (
                  <tr
                    key={flow.id}
                    className={`border-b border-border-muted hover:bg-surface-tertiary/50 transition-colors ${flow.isEstimate ? 'italic' : ''}`}
                  >
                    <td className="px-3 py-2 font-data text-text-secondary">
                      {formatDate(flow.date, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={isCall ? 'danger' : 'success'}
                          size="sm"
                        >
                          {CASH_FLOW_TYPE_LABELS[flow.type] ?? flow.type}
                        </Badge>
                        {flow.isEstimate && (
                          <Badge variant="warning" size="sm">Estime</Badge>
                        )}
                      </div>
                    </td>
                    <td className={`px-3 py-2 text-right font-data font-medium ${isCall ? 'text-danger' : 'text-success'}`}>
                      {formatCurrency(Math.abs(flow.amount), fund.currency, { compact: true })}
                    </td>
                    <td className="px-3 py-2 text-text-muted truncate max-w-[200px]">
                      {flow.description}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Onglet J-Curve ──────────────────────────────────────────────────────────

function JCurveTab({ fund }: { fund: FundLifecycle }) {
  const jCurveData = useMemo(() => computeJCurveData(fund.fundId), [fund.fundId])

  const minPoint = useMemo(() => {
    if (jCurveData.length === 0) return { year: 0, value: 0 }
    const min = jCurveData.reduce((m, p) => p.cumulativeNet < m.cumulativeNet ? p : m, jCurveData[0])
    return { year: min.year, value: min.cumulativeNet }
  }, [jCurveData])

  const inflectionYear = useMemo(() => {
    for (let i = 1; i < jCurveData.length; i++) {
      if (jCurveData[i].cumulativeNet >= 0 && jCurveData[i - 1].cumulativeNet < 0) {
        return jCurveData[i].year
      }
    }
    return null
  }, [jCurveData])

  const currentNet = jCurveData.length > 0 ? jCurveData[jCurveData.length - 1].cumulativeNet : 0

  return (
    <motion.div
      className="space-y-4 p-4"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Chart */}
      <motion.div variants={staggerItemVariants} className="bg-surface-secondary rounded-xl border border-border-muted p-4">
        <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Courbe en J - Flux net cumule
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={jCurveData}>
              <defs>
                <linearGradient id="jcurvePositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="jcurveNegative" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: '#91919f' }}
                axisLine={{ stroke: '#dee2e6' }}
                tickLine={false}
                label={{ value: 'Annees depuis vintage', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#91919f' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#91919f' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip content={<JCurveTooltip />} />
              <ReferenceLine y={0} stroke="#91919f" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="cumulativeNet"
                stroke="#29abb5"
                strokeWidth={2.5}
                fill="url(#jcurvePositive)"
                dot={false}
                activeDot={{ r: 4, fill: '#29abb5', stroke: '#fff', strokeWidth: 2 }}
              />
              {/* Colorier la zone negative : on utilise des Cell sur les barres mais pour Area, on ajoute un second Area pour le negatif */}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Metriques */}
      <motion.div variants={staggerItemVariants} className="grid grid-cols-3 gap-3">
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Profondeur max</div>
          <div className="font-data text-h4 font-semibold text-danger">
            {formatCurrency(minPoint.value, fund.currency, { compact: true })}
          </div>
          <div className="text-caption text-text-muted">Annee {minPoint.year}</div>
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Annee d&apos;inflexion</div>
          <div className="font-data text-h4 font-semibold text-accent">
            {inflectionYear !== null ? `Annee ${inflectionYear}` : 'Non atteinte'}
          </div>
          <div className="text-caption text-text-muted">
            {inflectionYear !== null ? 'CF net positif' : 'Encore en J'}
          </div>
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border-muted p-3 text-center">
          <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">CF net actuel</div>
          <div className={`font-data text-h4 font-semibold ${currentNet >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(currentNet, fund.currency, { compact: true })}
          </div>
          <div className="text-caption text-text-muted">Incluant NAV residuelle</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function FundLifecycleExperiment() {
  const [selectedFundId, setSelectedFundId] = useState(mockFundLifecycles[0].fundId)
  const [activeTab, setActiveTab] = useState('timeline')
  const [phaseFilter, setPhaseFilter] = useState<FundLifecyclePhase | null>(null)
  const [strategyFilter, setStrategyFilter] = useState<string | null>(null)

  const filteredFunds = useMemo(() => {
    let funds = mockFundLifecycles
    if (phaseFilter) funds = funds.filter(f => f.phase === phaseFilter)
    if (strategyFilter) funds = funds.filter(f => f.strategy === strategyFilter)
    return funds
  }, [phaseFilter, strategyFilter])

  const selectedFund = mockFundLifecycles.find(f => f.fundId === selectedFundId) ?? mockFundLifecycles[0]

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent-muted rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-h4 font-semibold text-text-primary">Cycle de vie des fonds</h2>
            <p className="text-caption text-text-muted">{mockFundLifecycles.length} fonds en portefeuille</p>
          </div>
        </div>
      </div>

      {/* Content: master-detail */}
      <div className="flex-1 min-h-0 flex">
        {/* Left panel */}
        <FundListPanel
          funds={filteredFunds}
          selectedFundId={selectedFundId}
          onSelect={setSelectedFundId}
          phaseFilter={phaseFilter}
          strategyFilter={strategyFilter}
          onPhaseFilterChange={setPhaseFilter}
          onStrategyFilterChange={setStrategyFilter}
        />

        {/* Right panel */}
        <div className="flex-1 min-w-0 flex flex-col bg-surface">
          {/* Fund header */}
          <div className="shrink-0 px-6 py-3 border-b border-border-muted">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-semibold text-text-primary">{selectedFund.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="accent" size="sm">{selectedFund.strategy}</Badge>
                  <span className="text-caption text-text-muted">{selectedFund.gpName}</span>
                  <span className="text-caption text-text-muted">-</span>
                  <span className="text-caption text-text-muted">{selectedFund.vintageYear}</span>
                  <span className="text-caption text-text-muted">-</span>
                  <span className="text-caption text-text-muted">{selectedFund.legalStructure}</span>
                </div>
              </div>
              <Badge
                variant={
                  selectedFund.phase === 'harvest' ? 'success'
                  : selectedFund.phase === 'investment_period' ? 'accent'
                  : selectedFund.phase === 'extension' ? 'warning'
                  : selectedFund.phase === 'liquidation' || selectedFund.phase === 'terminated' ? 'danger'
                  : 'default'
                }
              >
                {getPhaseLabel(selectedFund.phase)}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={DETAIL_TABS}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            layoutId="lifecycle-tabs"
          />

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={smoothTransition}
                >
                  <TimelineTab fund={selectedFund} />
                </motion.div>
              )}
              {activeTab === 'cashflows' && (
                <motion.div
                  key="cashflows"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={smoothTransition}
                >
                  <CashFlowsTab fund={selectedFund} />
                </motion.div>
              )}
              {activeTab === 'jcurve' && (
                <motion.div
                  key="jcurve"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={smoothTransition}
                >
                  <JCurveTab fund={selectedFund} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
