import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, ScatterChart, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, ZAxis, Legend,
} from 'recharts'
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '../lib/animations'
import { Tabs } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { Chip } from '../components/ui/Chip'
import { formatCurrency, formatPercentage } from '../lib/formatters'
import {
  mockFundLifecycles,
  mockMetricSnapshots,
  getLatestSnapshot,
  STRATEGY_COLORS,
} from '../mocks/mockFundLifecycle'

// ─── Types ────────────────────────────────────────────────────────────────────

type MetricKey = 'tvpi' | 'dpi' | 'irr'

interface EvolutionDataPoint {
  date: string
  [fundKey: string]: number | string
}

interface ScatterDataPoint {
  fundId: string
  name: string
  gpName: string
  strategy: string
  tvpi: number
  irr: number
  committed: number
}

interface VintageBarEntry {
  vintage: number
  [fundKey: string]: number
}

interface BenchmarkRow {
  fundId: string
  name: string
  gpName: string
  strategy: string
  vintage: number
  irr: number
  tvpi: number
  quartile: number
  vsMedian: number
}

interface PmeEntry {
  name: string
  shortName: string
  pme: number
}

// ─── Mock PME / Quartile data ─────────────────────────────────────────────────

function generateMockPme(): PmeEntry[] {
  let seed = 7919
  function nextRng(): number {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed & 0x7fffffff) / 0x7fffffff
  }

  return mockFundLifecycles.map(fund => ({
    name: fund.name,
    shortName: fund.shortName,
    pme: +(0.7 + nextRng() * 0.8).toFixed(2),
  }))
}

const MOCK_PME_DATA = generateMockPme()

function computeQuartiles(): BenchmarkRow[] {
  const funds = mockFundLifecycles.map(fund => {
    const snapshot = getLatestSnapshot(fund.fundId)
    return {
      fundId: fund.fundId,
      name: fund.name,
      gpName: fund.gpName,
      strategy: fund.strategy,
      vintage: fund.vintageYear,
      irr: snapshot?.irrNetInception ?? 0,
      tvpi: snapshot?.tvpiNet ?? 0,
    }
  })

  const groups = new Map<string, typeof funds>()
  for (const fund of funds) {
    const key = `${fund.strategy}-${fund.vintage}`
    const existing = groups.get(key) ?? []
    existing.push(fund)
    groups.set(key, existing)
  }

  return funds.map(fund => {
    const key = `${fund.strategy}-${fund.vintage}`
    const group = groups.get(key) ?? [fund]
    const sortedByIrr = [...group].sort((a, b) => b.irr - a.irr)
    const rank = sortedByIrr.findIndex(f => f.fundId === fund.fundId)
    const percentile = group.length > 1
      ? rank / (group.length - 1)
      : 0
    const quartile = percentile < 0.25 ? 1 : percentile < 0.5 ? 2 : percentile < 0.75 ? 3 : 4

    const irrValues = group.map(f => f.irr).sort((a, b) => a - b)
    const medianIrr = irrValues.length % 2 === 0
      ? (irrValues[irrValues.length / 2 - 1] + irrValues[irrValues.length / 2]) / 2
      : irrValues[Math.floor(irrValues.length / 2)]
    const vsMedian = medianIrr !== 0 ? ((fund.irr - medianIrr) / Math.abs(medianIrr)) * 100 : 0

    return { ...fund, quartile, vsMedian }
  })
}

const BENCHMARK_DATA = computeQuartiles()

// ─── Constantes ───────────────────────────────────────────────────────────────

const TABS_LIST = [
  { id: 'evolution', label: 'Evolution' },
  { id: 'scatter', label: 'Scatter' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'benchmark', label: 'Benchmark' },
]

const METRIC_CHIPS: { key: MetricKey; label: string }[] = [
  { key: 'tvpi', label: 'TVPI' },
  { key: 'dpi', label: 'DPI' },
  { key: 'irr', label: 'IRR' },
]

const ALL_STRATEGIES = [...new Set(mockFundLifecycles.map(f => f.strategy))]

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function EvolutionTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 max-w-xs">
      <p className="text-small font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-small">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-text-secondary truncate">{entry.name}</span>
          <span className="ml-auto font-data font-medium text-text-primary">
            {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload as ScatterDataPoint | undefined
  if (!data) return null
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      <p className="text-small font-medium text-text-primary">{data.name}</p>
      <p className="text-caption text-text-muted mb-2">{data.gpName}</p>
      <div className="space-y-1 text-small">
        <div className="flex justify-between">
          <span className="text-text-secondary">TVPI</span>
          <span className="font-data font-medium text-text-primary">{data.tvpi.toFixed(2)}x</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">IRR net</span>
          <span className="font-data font-medium text-text-primary">{formatPercentage(data.irr, 1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Engagement</span>
          <span className="font-data font-medium text-text-primary">{formatCurrency(data.committed, 'EUR', { compact: true })}</span>
        </div>
      </div>
    </div>
  )
}

function VintageTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 max-w-xs">
      <p className="text-small font-medium text-text-primary mb-1">Vintage {label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-small">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
          <span className="text-text-secondary truncate">{entry.name}</span>
          <span className="ml-auto font-data font-medium text-text-primary">
            {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function PmeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value as number
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
      <p className="text-small font-medium text-text-primary">{label}</p>
      <p className={`font-data font-medium text-small ${value >= 1 ? 'text-success' : 'text-danger'}`}>
        PME: {value.toFixed(2)}
      </p>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function FundPerformanceExperiment() {
  const [activeTab, setActiveTab] = useState('evolution')
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('tvpi')
  const [activeStrategies, setActiveStrategies] = useState<Set<string>>(new Set(ALL_STRATEGIES))
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null)

  function toggleStrategy(strategy: string) {
    setActiveStrategies(prev => {
      const next = new Set(prev)
      if (next.has(strategy)) {
        if (next.size > 1) next.delete(strategy)
      } else {
        next.add(strategy)
      }
      return next
    })
  }

  const filteredFunds = useMemo(
    () => mockFundLifecycles.filter(f => activeStrategies.has(f.strategy)),
    [activeStrategies],
  )

  // --- Evolution tab data ---

  const evolutionData = useMemo(() => {
    const activeFunds = filteredFunds.filter(f => f.phase !== 'terminated')
    const allDates = new Set<string>()
    const snapshotsByFund = new Map<string, Map<string, number>>()

    for (const fund of activeFunds) {
      const fundSnapshots = mockMetricSnapshots.filter(s => s.fundId === fund.fundId)
      const dateMap = new Map<string, number>()
      for (const snapshot of fundSnapshots) {
        allDates.add(snapshot.date)
        const value = selectedMetric === 'tvpi' ? snapshot.tvpiNet
          : selectedMetric === 'dpi' ? snapshot.dpiNet
          : snapshot.irrNetInception
        dateMap.set(snapshot.date, value)
      }
      snapshotsByFund.set(fund.fundId, dateMap)
    }

    const sortedDates = [...allDates].sort()
    return sortedDates.map(date => {
      const point: EvolutionDataPoint = { date }
      for (const fund of activeFunds) {
        const dateMap = snapshotsByFund.get(fund.fundId)
        if (dateMap?.has(date)) {
          point[fund.fundId] = dateMap.get(date)!
        }
      }
      return point
    })
  }, [filteredFunds, selectedMetric])

  const evolutionTableData = useMemo(() => {
    const activeFunds = filteredFunds.filter(f => f.phase !== 'terminated')
    return activeFunds
      .map(fund => {
        const snapshots = mockMetricSnapshots.filter(s => s.fundId === fund.fundId)
        const latest = snapshots[snapshots.length - 1]
        const oneYearAgo = snapshots.find(s => {
          const latestDate = new Date(latest?.date ?? '')
          const snapshotDate = new Date(s.date)
          const diffMs = latestDate.getTime() - snapshotDate.getTime()
          const diffDays = diffMs / (1000 * 60 * 60 * 24)
          return diffDays >= 350 && diffDays <= 380
        })

        const currentValue = latest
          ? (selectedMetric === 'tvpi' ? latest.tvpiNet : selectedMetric === 'dpi' ? latest.dpiNet : latest.irrNetInception)
          : 0
        const pastValue = oneYearAgo
          ? (selectedMetric === 'tvpi' ? oneYearAgo.tvpiNet : selectedMetric === 'dpi' ? oneYearAgo.dpiNet : oneYearAgo.irrNetInception)
          : null

        return {
          fundId: fund.fundId,
          name: fund.shortName,
          strategy: fund.strategy,
          vintage: fund.vintageYear,
          currentValue,
          delta: pastValue !== null ? currentValue - pastValue : null,
        }
      })
      .sort((a, b) => b.currentValue - a.currentValue)
  }, [filteredFunds, selectedMetric])

  // --- Scatter tab data ---

  const scatterData = useMemo<ScatterDataPoint[]>(() =>
    filteredFunds.map(fund => {
      const snapshot = getLatestSnapshot(fund.fundId)
      return {
        fundId: fund.fundId,
        name: fund.shortName,
        gpName: fund.gpName,
        strategy: fund.strategy,
        tvpi: snapshot?.tvpiNet ?? 0,
        irr: snapshot?.irrNetInception ?? 0,
        committed: fund.committed,
      }
    }),
  [filteredFunds])

  // --- Vintage tab data ---

  const vintageData = useMemo(() => {
    const vintages = [...new Set(filteredFunds.map(f => f.vintageYear))].sort()
    return vintages.map(vintage => {
      const entry: VintageBarEntry = { vintage }
      const fundsForVintage = filteredFunds.filter(f => f.vintageYear === vintage)
      for (const fund of fundsForVintage) {
        const snapshot = getLatestSnapshot(fund.fundId)
        if (snapshot) {
          entry[fund.fundId] = selectedMetric === 'tvpi' ? snapshot.tvpiNet
            : selectedMetric === 'dpi' ? snapshot.dpiNet
            : snapshot.irrNetInception
        }
      }
      return entry
    })
  }, [filteredFunds, selectedMetric])

  const vintageAverages = useMemo(() => {
    const vintages = [...new Set(filteredFunds.map(f => f.vintageYear))].sort()
    return vintages.map(vintage => {
      const fundsForVintage = filteredFunds.filter(f => f.vintageYear === vintage)
      const values = fundsForVintage
        .map(fund => {
          const snapshot = getLatestSnapshot(fund.fundId)
          if (!snapshot) return null
          return selectedMetric === 'tvpi' ? snapshot.tvpiNet
            : selectedMetric === 'dpi' ? snapshot.dpiNet
            : snapshot.irrNetInception
        })
        .filter((v): v is number => v !== null)
      const avg = values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0
      return { vintage, average: avg, count: values.length }
    })
  }, [filteredFunds, selectedMetric])

  // --- Benchmark tab data ---

  const benchmarkRows = useMemo(
    () => BENCHMARK_DATA.filter(r => activeStrategies.has(r.strategy)),
    [activeStrategies],
  )

  const pmeData = useMemo(
    () => MOCK_PME_DATA.filter(entry =>
      filteredFunds.some(f => f.name === entry.name),
    ),
    [filteredFunds],
  )

  const metricLabel = selectedMetric === 'tvpi' ? 'TVPI' : selectedMetric === 'dpi' ? 'DPI' : 'IRR (%)'
  const metricUnit = selectedMetric === 'irr' ? '%' : 'x'

  function formatMetricValue(value: number): string {
    if (selectedMetric === 'irr') return `${value.toFixed(1)}%`
    return `${value.toFixed(2)}x`
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h1 className="text-h4 text-text-primary">Performance des Fonds</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-caption text-text-muted mr-1">Metrique :</span>
            {METRIC_CHIPS.map(chip => (
              <Chip
                key={chip.key}
                label={chip.label}
                variant={selectedMetric === chip.key ? 'active' : 'default'}
                onClick={() => setSelectedMetric(chip.key)}
              />
            ))}
          </div>

          <div className="w-px h-5 bg-border-muted" />

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-caption text-text-muted mr-1">Strategies :</span>
            {ALL_STRATEGIES.map(strategy => (
              <Chip
                key={strategy}
                label={strategy}
                variant={activeStrategies.has(strategy) ? 'active' : 'default'}
                onClick={() => toggleStrategy(strategy)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={TABS_LIST}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        layoutId="fund-perf-tab"
        className="px-6"
      />

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <motion.div
          key={activeTab}
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 space-y-5"
        >
          {/* Tab: Evolution */}
          {activeTab === 'evolution' && (
            <>
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-caption font-semibold text-text-primary mb-3">
                  Evolution {metricLabel} par fonds
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: '#91919f' }}
                        tickFormatter={(val: string) => {
                          const parts = val.split('-')
                          return `${parts[0].slice(2)}Q${Math.ceil(parseInt(parts[1]) / 3)}`
                        }}
                        interval="preserveStartEnd"
                        minTickGap={40}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        domain={['auto', 'auto']}
                        tickFormatter={(val: number) => selectedMetric === 'irr' ? `${val.toFixed(0)}%` : `${val.toFixed(1)}x`}
                      />
                      <Tooltip content={<EvolutionTooltip />} />
                      {filteredFunds
                        .filter(f => f.phase !== 'terminated')
                        .map(fund => (
                          <Line
                            key={fund.fundId}
                            type="monotone"
                            dataKey={fund.fundId}
                            name={fund.shortName}
                            stroke={STRATEGY_COLORS[fund.strategy] ?? '#94a3b8'}
                            strokeWidth={selectedFundId === fund.fundId ? 3 : 1.5}
                            strokeOpacity={selectedFundId && selectedFundId !== fund.fundId ? 0.25 : 1}
                            dot={false}
                            activeDot={{ r: 4 }}
                            connectNulls
                          />
                        ))}
                      {selectedMetric !== 'irr' && (
                        <ReferenceLine y={1} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '1.0x', position: 'right', fontSize: 10, fill: '#91919f' }} />
                      )}
                      {selectedMetric === 'irr' && (
                        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '0%', position: 'right', fontSize: 10, fill: '#91919f' }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">Fonds</th>
                        <th className="px-3 py-2.5 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">Strategie</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">Vintage</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">{metricLabel} actuel</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">Delta 1 an</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evolutionTableData.map(row => (
                        <tr
                          key={row.fundId}
                          className={`border-b border-border-muted transition-colors cursor-pointer ${
                            selectedFundId === row.fundId ? 'bg-accent-muted/30' : 'hover:bg-surface-secondary'
                          }`}
                          onClick={() => setSelectedFundId(prev => prev === row.fundId ? null : row.fundId)}
                        >
                          <td className="px-4 py-2.5 text-text-primary font-medium">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STRATEGY_COLORS[row.strategy] }} />
                              {row.name}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{row.strategy}</td>
                          <td className="px-3 py-2.5 text-right font-data text-text-secondary">{row.vintage}</td>
                          <td className="px-3 py-2.5 text-right font-data font-medium text-text-primary">
                            {formatMetricValue(row.currentValue)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-data font-medium">
                            {row.delta !== null ? (
                              <span className={`inline-flex items-center gap-1 ${row.delta >= 0 ? 'text-success' : 'text-danger'}`}>
                                {row.delta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                {selectedMetric === 'irr'
                                  ? `${row.delta >= 0 ? '+' : ''}${row.delta.toFixed(1)} pp`
                                  : `${row.delta >= 0 ? '+' : ''}${row.delta.toFixed(2)}x`}
                              </span>
                            ) : (
                              <span className="text-text-muted">--</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}

          {/* Tab: Scatter */}
          {activeTab === 'scatter' && (
            <>
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-caption font-semibold text-text-primary mb-3">
                  TVPI vs IRR net (taille = engagement)
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" />
                      <XAxis
                        type="number"
                        dataKey="tvpi"
                        name="TVPI"
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        domain={['auto', 'auto']}
                        label={{ value: 'TVPI (x)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#91919f' }}
                      />
                      <YAxis
                        type="number"
                        dataKey="irr"
                        name="IRR"
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        domain={['auto', 'auto']}
                        label={{ value: 'IRR net (%)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#91919f' }}
                      />
                      <ZAxis type="number" dataKey="committed" range={[80, 600]} />
                      <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                      <ReferenceLine x={1} stroke="#94a3b8" strokeDasharray="4 4" />
                      <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                      {ALL_STRATEGIES.filter(s => activeStrategies.has(s)).map(strategy => {
                        const strategyData = scatterData.filter(d => d.strategy === strategy)
                        return (
                          <Scatter
                            key={strategy}
                            name={strategy}
                            data={strategyData}
                            fill={STRATEGY_COLORS[strategy] ?? '#94a3b8'}
                            fillOpacity={0.8}
                            stroke={STRATEGY_COLORS[strategy] ?? '#94a3b8'}
                            strokeWidth={1.5}
                          />
                        )
                      })}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="flex flex-wrap gap-3 px-1">
                {ALL_STRATEGIES.filter(s => activeStrategies.has(s)).map(strategy => (
                  <span key={strategy} className="inline-flex items-center gap-1.5 text-small text-text-secondary">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STRATEGY_COLORS[strategy] }} />
                    {strategy}
                  </span>
                ))}
              </motion.div>
            </>
          )}

          {/* Tab: Vintage */}
          {activeTab === 'vintage' && (
            <>
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-caption font-semibold text-text-primary mb-3">
                  {metricLabel} par vintage
                </h3>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vintageData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" vertical={false} />
                      <XAxis
                        dataKey="vintage"
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val: number) => selectedMetric === 'irr' ? `${val.toFixed(0)}%` : `${val.toFixed(1)}x`}
                      />
                      <Tooltip content={<VintageTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      {filteredFunds.map(fund => (
                        <Bar
                          key={fund.fundId}
                          dataKey={fund.fundId}
                          name={fund.shortName}
                          fill={STRATEGY_COLORS[fund.strategy] ?? '#94a3b8'}
                          radius={[3, 3, 0, 0]}
                          maxBarSize={28}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">Vintage</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">Nb fonds</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">{metricLabel} moyen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vintageAverages.map(row => (
                        <tr key={row.vintage} className="border-b border-border-muted hover:bg-surface-secondary transition-colors">
                          <td className="px-4 py-2.5 text-text-primary font-medium font-data">{row.vintage}</td>
                          <td className="px-3 py-2.5 text-right font-data text-text-secondary">{row.count}</td>
                          <td className="px-3 py-2.5 text-right font-data font-medium text-text-primary">
                            {formatMetricValue(row.average)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}

          {/* Tab: Benchmark */}
          {activeTab === 'benchmark' && (
            <>
              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">Fonds</th>
                        <th className="px-3 py-2.5 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">GP</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">IRR net</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">TVPI</th>
                        <th className="px-3 py-2.5 text-center text-caption font-semibold text-text-muted uppercase tracking-wider">Quartile</th>
                        <th className="px-3 py-2.5 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">vs Mediane</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkRows.map(row => (
                        <tr key={row.fundId} className="border-b border-border-muted hover:bg-surface-secondary transition-colors">
                          <td className="px-4 py-2.5 text-text-primary font-medium">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STRATEGY_COLORS[row.strategy] }} />
                              {row.name}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{row.gpName}</td>
                          <td className="px-3 py-2.5 text-right font-data font-medium text-text-primary">
                            {formatPercentage(row.irr, 1)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-data font-medium text-text-primary">
                            {row.tvpi.toFixed(2)}x
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <Badge
                              variant={
                                row.quartile === 1 ? 'success'
                                : row.quartile === 2 ? 'info'
                                : row.quartile === 3 ? 'warning'
                                : 'danger'
                              }
                              size="sm"
                            >
                              Q{row.quartile}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-right font-data font-medium">
                            <span className={row.vsMedian >= 0 ? 'text-success' : 'text-danger'}>
                              {row.vsMedian >= 0 ? '+' : ''}{row.vsMedian.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-caption font-semibold text-text-primary mb-3">
                  PME Kaplan-Schoar
                </h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pmeData} layout="vertical" margin={{ left: 100, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: '#91919f' }}
                        domain={[0.5, 1.6]}
                      />
                      <YAxis
                        type="category"
                        dataKey="shortName"
                        tick={{ fontSize: 10, fill: '#91919f' }}
                        width={95}
                      />
                      <Tooltip content={<PmeTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      <ReferenceLine
                        x={1}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        label={{ value: 'Marche', position: 'top', fontSize: 10, fill: '#91919f' }}
                      />
                      <Bar dataKey="pme" radius={[0, 3, 3, 0]} maxBarSize={16}>
                        {pmeData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.pme >= 1 ? '#16a34a' : '#dc2626'}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
