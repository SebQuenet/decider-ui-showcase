import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine,
} from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '../lib/animations'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Chip } from '../components/ui/Chip.tsx'
import { formatCurrency, formatPercentage } from '../lib/formatters'
import {
  mockFundLifecycles,
  mockAllocationTargets,
  getLatestSnapshot,
  STRATEGY_COLORS,
} from '../mocks/mockFundLifecycle'

// ─── Constantes ──────────────────────────────────────────────────────────────

const DATAVIZ_COLORS = [
  '#29abb5', '#fe6d11', '#6366f1', '#16a34a', '#dc2626',
  '#8b5cf6', '#0891b2', '#ca8a04', '#be185d', '#059669',
]

const DIMENSION_LABELS: Record<string, string> = {
  strategy: 'Strategie',
  geography: 'Geographie',
  vintage: 'Millesime',
}

const TABS = [
  { id: 'engagements', label: 'Engagements' },
  { id: 'exposition', label: 'Exposition' },
  { id: 'pacing', label: 'Pacing' },
]

const VINTAGE_GROUPS = [
  { label: '2010-2013', min: 2010, max: 2013 },
  { label: '2014-2017', min: 2014, max: 2017 },
  { label: '2018-2021', min: 2018, max: 2021 },
  { label: '2022-2025', min: 2022, max: 2025 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildEngagementData() {
  const funds = mockFundLifecycles.map((fund) => {
    const snapshot = getLatestSnapshot(fund.fundId)
    return {
      fundId: fund.fundId,
      name: fund.name,
      shortName: fund.shortName,
      phase: fund.phase,
      strategy: fund.strategy,
      vintageYear: fund.vintageYear,
      investmentPeriodYears: fund.investmentPeriodYears,
      fundTermYears: fund.fundTermYears,
      committed: fund.committed,
      called: snapshot?.calledAmount ?? 0,
      distributed: snapshot?.distributedAmount ?? 0,
      nav: snapshot?.nav ?? 0,
      unfunded: snapshot?.unfundedCommitment ?? fund.committed,
    }
  })

  const totals = funds.reduce(
    (acc, f) => ({
      committed: acc.committed + f.committed,
      called: acc.called + f.called,
      distributed: acc.distributed + f.distributed,
      nav: acc.nav + f.nav,
      unfunded: acc.unfunded + f.unfunded,
    }),
    { committed: 0, called: 0, distributed: 0, nav: 0, unfunded: 0 },
  )

  const barData = [...funds]
    .sort((a, b) => b.unfunded - a.unfunded)
    .map((f) => ({
      name: f.shortName,
      distributed: f.distributed,
      nav: f.nav,
      unfunded: f.unfunded,
    }))

  return { funds, totals, barData }
}

function buildPacingData() {
  const years = Array.from({ length: 16 }, (_, i) => 2010 + i)

  const cumulativeData = years.map((year) => {
    const row: Record<string, number | string> = { year: String(year) }
    for (const group of VINTAGE_GROUPS) {
      const groupCommitted = mockFundLifecycles
        .filter((f) => f.vintageYear >= group.min && f.vintageYear <= group.max && f.vintageYear <= year)
        .reduce((sum, f) => sum + f.committed, 0)
      row[group.label] = groupCommitted
    }
    return row
  })

  const annualCommitments = years.map((year) => {
    const totalForYear = mockFundLifecycles
      .filter((f) => f.vintageYear === year)
      .reduce((sum, f) => sum + f.committed, 0)
    return { year: String(year), amount: totalForYear }
  })

  const totalCommitted = mockFundLifecycles.reduce((sum, f) => sum + f.committed, 0)
  const activeVintages = new Set(mockFundLifecycles.map((f) => f.vintageYear))
  const averageAnnualTarget = totalCommitted / activeVintages.size

  const activeFunds = mockFundLifecycles.filter(
    (f) => f.phase !== 'terminated' && f.phase !== 'liquidation',
  )
  const projections = activeFunds.map((fund) => {
    const snapshot = getLatestSnapshot(fund.fundId)
    const unfunded = snapshot?.unfundedCommitment ?? fund.committed
    let est2026 = 0
    let est2027 = 0
    let est2028 = 0

    if (fund.phase === 'investment_period' || fund.phase === 'fundraising') {
      const currentAge = 2026 - fund.vintageYear
      const remainingYears = Math.max(1, fund.investmentPeriodYears - currentAge + 1)
      const annualCall = unfunded / Math.min(remainingYears, 3)
      est2026 = remainingYears >= 1 ? annualCall : 0
      est2027 = remainingYears >= 2 ? annualCall : 0
      est2028 = remainingYears >= 3 ? annualCall : 0
    } else {
      est2026 = unfunded * 0.05
      est2027 = unfunded * 0.03
      est2028 = unfunded * 0.02
    }

    return {
      fundId: fund.fundId,
      shortName: fund.shortName,
      phase: fund.phase,
      unfunded,
      est2026,
      est2027,
      est2028,
    }
  })

  return { cumulativeData, annualCommitments, averageAnnualTarget, projections }
}

// ─── Tooltip personnalise ────────────────────────────────────────────────────

function EngagementBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-lg text-small">
      <p className="font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-muted">{entry.name} :</span>
          <span className="font-data text-text-primary">{formatCurrency(entry.value, 'EUR', { compact: true })}</span>
        </div>
      ))}
    </div>
  )
}

function PacingBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-lg text-small">
      <p className="font-medium text-text-primary mb-1">{label}</p>
      <span className="font-data text-text-primary">{formatCurrency(payload[0].value, 'EUR', { compact: true })}</span>
    </div>
  )
}

function AllocationPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { actualPct: number } }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-lg text-small">
      <p className="font-medium text-text-primary mb-1">{entry.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-text-muted">NAV :</span>
        <span className="font-data text-text-primary">{formatCurrency(entry.value, 'EUR', { compact: true })}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-muted">Part :</span>
        <span className="font-data text-text-primary">{entry.payload.actualPct.toFixed(1)}%</span>
      </div>
    </div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function FundAllocationExperiment() {
  const [activeTab, setActiveTab] = useState('engagements')
  const [selectedDimension, setSelectedDimension] = useState<'strategy' | 'geography' | 'vintage'>('strategy')

  const engagement = useMemo(() => buildEngagementData(), [])
  const pacing = useMemo(() => buildPacingData(), [])

  const dimensionTargets = useMemo(
    () => mockAllocationTargets.filter((t) => t.dimension === selectedDimension),
    [selectedDimension],
  )

  const dimensionPieData = useMemo(
    () => dimensionTargets.map((t) => ({
      name: t.category,
      value: t.navAmount,
      actualPct: t.actualPct,
    })),
    [dimensionTargets],
  )

  const totalNavExposition = useMemo(
    () => dimensionTargets.reduce((sum, t) => sum + t.navAmount, 0),
    [dimensionTargets],
  )

  // ─── KPI cards ─────────────────────────────────────────────────────────────

  const kpis = [
    { label: 'Total Committed', value: engagement.totals.committed },
    { label: 'Total Appele', value: engagement.totals.called },
    { label: 'Total Distribue', value: engagement.totals.distributed },
    { label: 'NAV Totale', value: engagement.totals.nav },
    { label: 'Unfunded Total', value: engagement.totals.unfunded },
  ]

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-muted flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-h3 text-text-primary">Allocation & Engagements</h3>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        layoutId="fund-allocation-tabs"
        className="px-6"
      />

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'engagements' && (
          <EngagementsTab kpis={kpis} engagement={engagement} />
        )}
        {activeTab === 'exposition' && (
          <ExpositionTab
            selectedDimension={selectedDimension}
            onDimensionChange={setSelectedDimension}
            dimensionTargets={dimensionTargets}
            dimensionPieData={dimensionPieData}
            totalNav={totalNavExposition}
          />
        )}
        {activeTab === 'pacing' && (
          <PacingTab pacing={pacing} />
        )}
      </div>
    </div>
  )
}

// ─── Tab Engagements ─────────────────────────────────────────────────────────

function EngagementsTab({
  kpis,
  engagement,
}: {
  kpis: Array<{ label: string; value: number }>
  engagement: ReturnType<typeof buildEngagementData>
}) {
  return (
    <div className="p-6 space-y-6">
      {/* KPI cards */}
      <motion.div
        className="grid grid-cols-5 gap-4"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={staggerItemVariants}
            className="rounded-xl border border-border bg-surface-secondary p-4"
          >
            <p className="text-small text-text-muted">{kpi.label}</p>
            <p className="text-h4 font-data mt-1">{formatCurrency(kpi.value, 'EUR', { compact: true })}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Stacked horizontal bar chart */}
      <div className="rounded-xl border border-border bg-surface-secondary p-4">
        <h4 className="text-h4 text-text-primary mb-4">Decomposition par fonds</h4>
        <ResponsiveContainer width="100%" height={engagement.barData.length * 36 + 40}>
          <BarChart
            data={engagement.barData}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatCurrency(v, 'EUR', { compact: true })}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            />
            <Tooltip content={<EngagementBarTooltip />} />
            <Legend
              verticalAlign="top"
              height={30}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="distributed" name="Distribue" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="nav" name="NAV" stackId="a" fill="#29abb5" />
            <Bar dataKey="unfunded" name="Unfunded" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface-secondary overflow-hidden">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b border-border bg-surface-tertiary">
              <th className="text-left px-4 py-3 text-text-muted font-medium">Fonds</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Committed</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Appele (%)</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Distribue</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">NAV</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Unfunded</th>
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {engagement.funds
              .sort((a, b) => b.committed - a.committed)
              .map((fund) => {
                const callPct = fund.committed > 0 ? (fund.called / fund.committed) * 100 : 0
                return (
                  <motion.tr
                    key={fund.fundId}
                    variants={staggerItemVariants}
                    className="border-b border-border-muted hover:bg-surface-tertiary/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-text-primary font-medium">{fund.name}</td>
                    <td className="px-4 py-2.5 text-right font-data text-text-primary">
                      {formatCurrency(fund.committed, 'EUR', { compact: true })}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 rounded-full bg-surface-tertiary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${Math.min(callPct, 100)}%` }}
                          />
                        </div>
                        <span className="font-data text-text-secondary w-10 text-right">{callPct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-data text-text-primary">
                      {formatCurrency(fund.distributed, 'EUR', { compact: true })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-data text-text-primary">
                      {formatCurrency(fund.nav, 'EUR', { compact: true })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-data text-text-muted">
                      {formatCurrency(fund.unfunded, 'EUR', { compact: true })}
                    </td>
                  </motion.tr>
                )
              })}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab Exposition ──────────────────────────────────────────────────────────

function ExpositionTab({
  selectedDimension,
  onDimensionChange,
  dimensionTargets,
  dimensionPieData,
  totalNav,
}: {
  selectedDimension: 'strategy' | 'geography' | 'vintage'
  onDimensionChange: (d: 'strategy' | 'geography' | 'vintage') => void
  dimensionTargets: ReturnType<typeof mockAllocationTargets.filter>
  dimensionPieData: Array<{ name: string; value: number; actualPct: number }>
  totalNav: number
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Dimension selector */}
      <div className="flex items-center gap-2">
        {(['strategy', 'geography', 'vintage'] as const).map((dim) => (
          <Chip
            key={dim}
            label={DIMENSION_LABELS[dim]}
            variant={selectedDimension === dim ? 'active' : 'default'}
            onClick={() => onDimensionChange(dim)}
          />
        ))}
      </div>

      {/* Pie chart + allocation bars side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="rounded-xl border border-border bg-surface-secondary p-4">
          <h4 className="text-h4 text-text-primary mb-2">Repartition NAV</h4>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dimensionPieData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, actualPct }: { name: string; actualPct: number }) => `${name} ${actualPct.toFixed(1)}%`}
                labelLine={{ stroke: 'var(--color-text-muted)', strokeWidth: 1 }}
              >
                {dimensionPieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={selectedDimension === 'strategy'
                      ? (STRATEGY_COLORS[dimensionPieData[index].name] ?? DATAVIZ_COLORS[index % DATAVIZ_COLORS.length])
                      : DATAVIZ_COLORS[index % DATAVIZ_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<AllocationPieTooltip />} />
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text-muted text-caption"
              >
                NAV Totale
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text-primary text-h4"
                style={{ fontFamily: 'var(--font-data)', fontWeight: 600 }}
              >
                {formatCurrency(totalNav, 'EUR', { compact: true })}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation target bars */}
        <div className="rounded-xl border border-border bg-surface-secondary p-4">
          <h4 className="text-h4 text-text-primary mb-4">Cibles vs Reel</h4>
          <motion.div
            className="space-y-4"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            key={selectedDimension}
          >
            {dimensionTargets.map((target, index) => {
              const delta = target.actualPct - target.targetPct
              const isWithinRange = Math.abs(delta) <= 3
              return (
                <motion.div key={target.category} variants={staggerItemVariants}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-small text-text-primary font-medium">{target.category}</span>
                    <div className="flex items-center gap-2 text-small font-data">
                      <span className="text-text-secondary">{target.actualPct.toFixed(1)}%</span>
                      <span className="text-text-muted">/</span>
                      <span className="text-text-muted">{target.targetPct.toFixed(1)}%</span>
                      <span className={isWithinRange ? 'text-success' : 'text-danger'}>
                        ({delta > 0 ? '+' : ''}{delta.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-5 rounded-full bg-surface-tertiary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(target.actualPct, 100)}%`,
                        backgroundColor: selectedDimension === 'strategy'
                          ? (STRATEGY_COLORS[target.category] ?? DATAVIZ_COLORS[index % DATAVIZ_COLORS.length])
                          : DATAVIZ_COLORS[index % DATAVIZ_COLORS.length],
                      }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-text-primary"
                      style={{ left: `${Math.min(target.targetPct, 100)}%` }}
                      title={`Cible : ${target.targetPct}%`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Summary table */}
      <div className="rounded-xl border border-border bg-surface-secondary overflow-hidden">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b border-border bg-surface-tertiary">
              <th className="text-left px-4 py-3 text-text-muted font-medium">Categorie</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">NAV</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Commitment</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">% Portefeuille</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Cible</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Ecart</th>
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            key={selectedDimension}
          >
            {dimensionTargets.map((target) => {
              const delta = target.actualPct - target.targetPct
              const isWithinRange = Math.abs(delta) <= 3
              return (
                <motion.tr
                  key={target.category}
                  variants={staggerItemVariants}
                  className="border-b border-border-muted hover:bg-surface-tertiary/50 transition-colors"
                >
                  <td className="px-4 py-2.5 text-text-primary font-medium">{target.category}</td>
                  <td className="px-4 py-2.5 text-right font-data text-text-primary">
                    {formatCurrency(target.navAmount, 'EUR', { compact: true })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-primary">
                    {formatCurrency(target.commitmentAmount, 'EUR', { compact: true })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-secondary">
                    {target.actualPct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-muted">
                    {target.targetPct.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-data ${isWithinRange ? 'text-success' : 'text-danger'}`}>
                    {formatPercentage(delta, 1)}
                  </td>
                </motion.tr>
              )
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab Pacing ──────────────────────────────────────────────────────────────

function PacingTab({
  pacing,
}: {
  pacing: ReturnType<typeof buildPacingData>
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Stacked area chart: cumulative commitments by vintage cohort */}
      <div className="rounded-xl border border-border bg-surface-secondary p-4">
        <h4 className="text-h4 text-text-primary mb-4">Engagements cumules par cohorte</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pacing.cumulativeData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v, 'EUR', { compact: true })}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value, 'EUR', { compact: true }), name]}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {VINTAGE_GROUPS.map((group, index) => (
              <Area
                key={group.label}
                type="monotone"
                dataKey={group.label}
                stackId="1"
                fill={DATAVIZ_COLORS[index]}
                stroke={DATAVIZ_COLORS[index]}
                fillOpacity={0.7}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Annual new commitments bar chart */}
      <div className="rounded-xl border border-border bg-surface-secondary p-4">
        <h4 className="text-h4 text-text-primary mb-4">Nouveaux engagements annuels</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pacing.annualCommitments} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v, 'EUR', { compact: true })}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            />
            <Tooltip content={<PacingBarTooltip />} />
            <ReferenceLine
              y={pacing.averageAnnualTarget}
              stroke="#fe6d11"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: `Moy. ${formatCurrency(pacing.averageAnnualTarget, 'EUR', { compact: true })}`,
                position: 'right',
                fill: '#fe6d11',
                fontSize: 11,
              }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {pacing.annualCommitments.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.amount >= pacing.averageAnnualTarget ? '#29abb5' : '#94a3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Projections table */}
      <div className="rounded-xl border border-border bg-surface-secondary overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="text-h4 text-text-primary">Projection des appels futurs</h4>
          <p className="text-caption text-text-muted mt-0.5">Estimation simplifiee des appels sur fonds actifs</p>
        </div>
        <table className="w-full text-small">
          <thead>
            <tr className="border-b border-border bg-surface-tertiary">
              <th className="text-left px-4 py-3 text-text-muted font-medium">Fonds</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Unfunded</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Est. 2026</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Est. 2027</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Est. 2028</th>
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {pacing.projections
              .sort((a, b) => b.unfunded - a.unfunded)
              .map((proj) => (
                <motion.tr
                  key={proj.fundId}
                  variants={staggerItemVariants}
                  className="border-b border-border-muted hover:bg-surface-tertiary/50 transition-colors"
                >
                  <td className="px-4 py-2.5 text-text-primary font-medium">{proj.shortName}</td>
                  <td className="px-4 py-2.5 text-right font-data text-text-primary">
                    {formatCurrency(proj.unfunded, 'EUR', { compact: true })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-secondary">
                    {proj.est2026 > 0 ? formatCurrency(proj.est2026, 'EUR', { compact: true }) : '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-secondary">
                    {proj.est2027 > 0 ? formatCurrency(proj.est2027, 'EUR', { compact: true }) : '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-data text-text-secondary">
                    {proj.est2028 > 0 ? formatCurrency(proj.est2028, 'EUR', { compact: true }) : '-'}
                  </td>
                </motion.tr>
              ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}
