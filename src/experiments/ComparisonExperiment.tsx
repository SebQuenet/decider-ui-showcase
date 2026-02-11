import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitCompareArrows,
  Medal,
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Badge } from '../components/ui/Badge.tsx'

type FundKey = 'alpha' | 'beta' | 'gamma'
type ViewTab = 'overview' | 'performance' | 'fees' | 'risk'

interface FundData {
  key: FundKey
  name: string
  shortName: string
  color: string
  bgColor: string
}

interface MetricValue {
  value: string
  numericValue: number
}

const FUNDS: FundData[] = [
  { key: 'alpha', name: 'Alpha Growth Fund', shortName: 'Alpha', color: 'bg-glacier-500', bgColor: 'bg-glacier-50' },
  { key: 'beta', name: 'Beta Income Fund', shortName: 'Beta', color: 'bg-peach-500', bgColor: 'bg-peach-50' },
  { key: 'gamma', name: 'Gamma Venture Fund', shortName: 'Gamma', color: 'bg-carbon-600', bgColor: 'bg-carbon-50' },
]

const OVERVIEW_METRICS: Record<string, Record<FundKey, MetricValue>> = {
  'IRR Net': { alpha: { value: '18.4%', numericValue: 18.4 }, beta: { value: '9.2%', numericValue: 9.2 }, gamma: { value: '24.1%', numericValue: 24.1 } },
  'TVPI': { alpha: { value: '1.52x', numericValue: 1.52 }, beta: { value: '1.28x', numericValue: 1.28 }, gamma: { value: '1.78x', numericValue: 1.78 } },
  'DPI': { alpha: { value: '0.45x', numericValue: 0.45 }, beta: { value: '0.82x', numericValue: 0.82 }, gamma: { value: '0.15x', numericValue: 0.15 } },
  'RVPI': { alpha: { value: '1.07x', numericValue: 1.07 }, beta: { value: '0.46x', numericValue: 0.46 }, gamma: { value: '1.63x', numericValue: 1.63 } },
  'AUM': { alpha: { value: '€245M', numericValue: 245 }, beta: { value: '€180M', numericValue: 180 }, gamma: { value: '€95M', numericValue: 95 } },
  'Vintage': { alpha: { value: '2020', numericValue: 2020 }, beta: { value: '2019', numericValue: 2019 }, gamma: { value: '2021', numericValue: 2021 } },
}

const PERFORMANCE_YEARS = ['2020', '2021', '2022', '2023', '2024']
const PERFORMANCE_DATA: Record<FundKey, number[]> = {
  alpha: [4.2, 12.8, -3.1, 14.6, 18.4],
  beta: [3.8, 7.2, 1.5, 6.8, 9.2],
  gamma: [0, 8.5, -7.2, 22.3, 24.1],
}

const FEE_METRICS: Record<string, Record<FundKey, string>> = {
  'Commission de gestion': { alpha: '2.0%', beta: '1.5%', gamma: '2.5%' },
  'Carried interest': { alpha: '20%', beta: '15%', gamma: '25%' },
  'Hurdle rate': { alpha: '8%', beta: '6%', gamma: '8%' },
  'Frais d\'administration': { alpha: '0.15%', beta: '0.12%', gamma: '0.20%' },
  'Total estimatif': { alpha: '2.15%', beta: '1.62%', gamma: '2.70%' },
}

const FEE_BREAKDOWN: Record<FundKey, { label: string; percentage: number; color: string }[]> = {
  alpha: [
    { label: 'Gestion', percentage: 60, color: 'bg-glacier-400' },
    { label: 'Admin', percentage: 5, color: 'bg-glacier-200' },
    { label: 'Carry potentiel', percentage: 35, color: 'bg-glacier-600' },
  ],
  beta: [
    { label: 'Gestion', percentage: 55, color: 'bg-peach-400' },
    { label: 'Admin', percentage: 5, color: 'bg-peach-200' },
    { label: 'Carry potentiel', percentage: 40, color: 'bg-peach-600' },
  ],
  gamma: [
    { label: 'Gestion', percentage: 50, color: 'bg-carbon-400' },
    { label: 'Admin', percentage: 5, color: 'bg-carbon-200' },
    { label: 'Carry potentiel', percentage: 45, color: 'bg-carbon-600' },
  ],
}

const RISK_METRICS: Record<string, Record<FundKey, MetricValue>> = {
  'Volatilite': { alpha: { value: '14.2%', numericValue: 14.2 }, beta: { value: '8.4%', numericValue: 8.4 }, gamma: { value: '22.6%', numericValue: 22.6 } },
  'Max Drawdown': { alpha: { value: '-8.3%', numericValue: -8.3 }, beta: { value: '-4.1%', numericValue: -4.1 }, gamma: { value: '-15.7%', numericValue: -15.7 } },
  'Sharpe Ratio': { alpha: { value: '1.42', numericValue: 1.42 }, beta: { value: '1.08', numericValue: 1.08 }, gamma: { value: '1.12', numericValue: 1.12 } },
  'Beta': { alpha: { value: '0.85', numericValue: 0.85 }, beta: { value: '0.42', numericValue: 0.42 }, gamma: { value: '1.25', numericValue: 1.25 } },
  'Sortino Ratio': { alpha: { value: '1.88', numericValue: 1.88 }, beta: { value: '1.42', numericValue: 1.42 }, gamma: { value: '1.35', numericValue: 1.35 } },
}

const RISK_LEVELS: Record<FundKey, { level: string; variant: 'success' | 'warning' | 'danger' }> = {
  alpha: { level: 'Modere', variant: 'warning' },
  beta: { level: 'Faible', variant: 'success' },
  gamma: { level: 'Eleve', variant: 'danger' },
}

const HEATMAP_CRITERIA = ['IRR', 'Risque', 'Liquidite', 'Frais', 'Track Record', 'ESG']
const HEATMAP_SCORES: Record<FundKey, number[]> = {
  alpha: [85, 65, 50, 70, 90, 75],
  beta: [55, 90, 85, 88, 80, 60],
  gamma: [95, 35, 25, 45, 60, 85],
}

const VIEW_TABS = [
  { id: 'overview' as const, label: 'Vue d\'ensemble' },
  { id: 'performance' as const, label: 'Performance' },
  { id: 'fees' as const, label: 'Frais' },
  { id: 'risk' as const, label: 'Risque' },
]

function getHeatmapColor(score: number): string {
  if (score >= 80) return 'bg-success/20 text-success'
  if (score >= 60) return 'bg-success/10 text-success'
  if (score >= 40) return 'bg-warning-muted text-warning'
  return 'bg-danger-muted text-danger'
}

export function ComparisonExperiment() {
  const [selectedFunds, setSelectedFunds] = useState<FundKey[]>(['alpha', 'beta', 'gamma'])
  const [activeView, setActiveView] = useState<ViewTab>('overview')
  const [showToast, setShowToast] = useState(false)

  function toggleFund(fund: FundKey): void {
    setSelectedFunds((previous) => {
      if (previous.includes(fund)) {
        if (previous.length <= 2) return previous
        return previous.filter((f) => f !== fund)
      }
      return [...previous, fund]
    })
  }

  const activeFunds = FUNDS.filter((f) => selectedFunds.includes(f.key))

  function handleExport(): void {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <GitCompareArrows className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Comparaison multi-fonds</h2>
            <p className="text-small text-text-muted">{activeFunds.length} fonds selectionnes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Fund multi-select */}
          <div className="flex gap-2">
            {FUNDS.map((fund) => {
              const isSelected = selectedFunds.includes(fund.key)
              return (
                <button
                  key={fund.key}
                  onClick={() => toggleFund(fund.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-small font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? `${fund.bgColor} border-current text-text-primary`
                      : 'border-border text-text-muted hover:bg-surface-secondary'
                  }`}
                >
                  {isSelected && (
                    <span className={`w-2.5 h-2.5 rounded-full ${fund.color}`} />
                  )}
                  {fund.shortName}
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              )
            })}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        tabs={VIEW_TABS}
        activeTabId={activeView}
        onTabChange={(id) => setActiveView(id as ViewTab)}
        layoutId="comparison-tabs"
        className="px-6"
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OverviewView funds={activeFunds} />
            </motion.div>
          )}
          {activeView === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PerformanceView funds={activeFunds} />
            </motion.div>
          )}
          {activeView === 'fees' && (
            <motion.div key="fees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FeesView funds={activeFunds} />
            </motion.div>
          )}
          {activeView === 'risk' && (
            <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RiskView funds={activeFunds} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-inverse text-text-inverse px-5 py-3 rounded-xl shadow-xl text-caption font-medium"
          >
            Export Excel en cours...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ViewProps {
  funds: FundData[]
}

function OverviewView({ funds }: ViewProps) {
  const metricNames = Object.keys(OVERVIEW_METRICS)

  return (
    <div className="space-y-6">
      {/* Comparison table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-secondary border-b border-border">
              <th className="text-left px-4 py-3 text-small font-semibold text-text-secondary">Metrique</th>
              {funds.map((fund) => (
                <th key={fund.key} className="text-right px-4 py-3 text-small font-semibold text-text-secondary">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${fund.color}`} />
                    {fund.shortName}
                  </div>
                </th>
              ))}
              <th className="text-center px-4 py-3 text-small font-semibold text-text-secondary">Rang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {metricNames.map((metric) => {
              const values = funds.map((f) => OVERVIEW_METRICS[metric][f.key])
              const sorted = [...values].sort((a, b) => b.numericValue - a.numericValue)

              return (
                <tr key={metric} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-caption text-text-primary font-medium">{metric}</td>
                  {funds.map((fund) => {
                    const metricValue = OVERVIEW_METRICS[metric][fund.key]
                    const rank = sorted.findIndex((v) => v.value === metricValue.value)
                    const isFirst = rank === 0
                    const isLast = rank === funds.length - 1

                    let cellColorClass = ''
                    if (isFirst && metric !== 'Vintage') cellColorClass = 'text-success font-semibold'
                    else if (isLast && metric !== 'Vintage' && metric !== 'AUM') cellColorClass = 'text-danger'

                    return (
                      <td key={fund.key} className={`px-4 py-3 text-right text-caption font-data ${cellColorClass}`}>
                        {metricValue.value}
                      </td>
                    )
                  })}
                  <td className="px-4 py-3 text-center">
                    {metric !== 'Vintage' && (
                      <div className="flex justify-center gap-1">
                        {funds.map((fund) => {
                          const metricValue = OVERVIEW_METRICS[metric][fund.key]
                          const rank = sorted.findIndex((v) => v.value === metricValue.value) + 1
                          const medalColors: Record<number, string> = {
                            1: 'text-yellow-500',
                            2: 'text-carbon-400',
                            3: 'text-peach-600',
                          }
                          return (
                            <span key={fund.key} className={`text-small ${medalColors[rank] ?? 'text-text-muted'}`}>
                              {rank === 1 ? <Medal className="w-4 h-4 inline" /> : `${rank}e`}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Heatmap */}
      <div>
        <h3 className="text-caption font-semibold text-text-primary mb-3">Matrice de comparaison</h3>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-2.5 text-small font-semibold text-text-secondary">Critere</th>
                {funds.map((fund) => (
                  <th key={fund.key} className="text-center px-4 py-2.5 text-small font-semibold text-text-secondary">
                    {fund.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {HEATMAP_CRITERIA.map((criterion, criterionIndex) => (
                <tr key={criterion}>
                  <td className="px-4 py-2.5 text-small text-text-primary font-medium">{criterion}</td>
                  {funds.map((fund) => {
                    const score = HEATMAP_SCORES[fund.key][criterionIndex]
                    return (
                      <td key={fund.key} className="px-4 py-2.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md text-small font-semibold font-data ${getHeatmapColor(score)}`}>
                          {score}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PerformanceView({ funds }: ViewProps) {
  const maxValue = Math.max(...funds.flatMap((f) => PERFORMANCE_DATA[f.key]))

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-caption font-semibold text-text-primary mb-4">Rendement annuel (%)</h3>
        <div className="flex items-end gap-4 h-52">
          {PERFORMANCE_YEARS.map((year, yearIndex) => (
            <div key={year} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                {funds.map((fund) => {
                  const value = PERFORMANCE_DATA[fund.key][yearIndex]
                  const height = Math.max(4, Math.abs(value) / maxValue * 140)
                  const isNegative = value < 0
                  return (
                    <motion.div
                      key={fund.key}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ delay: yearIndex * 0.1, type: 'spring', stiffness: 200 }}
                      className={`w-5 rounded-t-sm ${isNegative ? 'bg-danger/40' : fund.color} relative group`}
                      style={{ alignSelf: isNegative ? 'flex-start' : 'flex-end' }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-data text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value > 0 ? '+' : ''}{value}%
                      </span>
                    </motion.div>
                  )
                })}
              </div>
              <span className="text-small text-text-muted font-data">{year}</span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4">
          {funds.map((fund) => (
            <div key={fund.key} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${fund.color}`} />
              <span className="text-small text-text-secondary">{fund.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance metrics with sparkline indicators */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-secondary border-b border-border">
              <th className="text-left px-4 py-3 text-small font-semibold text-text-secondary">Annee</th>
              {funds.map((fund) => (
                <th key={fund.key} className="text-right px-4 py-3 text-small font-semibold text-text-secondary">
                  {fund.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PERFORMANCE_YEARS.map((year, yearIndex) => (
              <tr key={year}>
                <td className="px-4 py-2.5 text-caption text-text-primary font-medium">{year}</td>
                {funds.map((fund) => {
                  const value = PERFORMANCE_DATA[fund.key][yearIndex]
                  const isPositive = value > 0
                  return (
                    <td key={fund.key} className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {value !== 0 && (
                          isPositive
                            ? <ArrowUp className="w-3 h-3 text-success" />
                            : <ArrowDown className="w-3 h-3 text-danger" />
                        )}
                        {value === 0 && <Minus className="w-3 h-3 text-text-muted" />}
                        <span className={`text-caption font-data font-medium ${
                          isPositive ? 'text-success' : value < 0 ? 'text-danger' : 'text-text-muted'
                        }`}>
                          {value > 0 ? '+' : ''}{value}%
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FeesView({ funds }: ViewProps) {
  const feeNames = Object.keys(FEE_METRICS)

  return (
    <div className="space-y-6">
      {/* Fee comparison table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-secondary border-b border-border">
              <th className="text-left px-4 py-3 text-small font-semibold text-text-secondary">Type de frais</th>
              {funds.map((fund) => (
                <th key={fund.key} className="text-right px-4 py-3 text-small font-semibold text-text-secondary">
                  {fund.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {feeNames.map((fee) => {
              const isTotal = fee === 'Total estimatif'
              return (
                <tr key={fee} className={isTotal ? 'bg-surface-secondary font-semibold' : ''}>
                  <td className={`px-4 py-3 text-caption text-text-primary ${isTotal ? 'font-bold' : 'font-medium'}`}>
                    {fee}
                  </td>
                  {funds.map((fund) => (
                    <td key={fund.key} className={`px-4 py-3 text-right text-caption font-data ${isTotal ? 'font-bold' : ''}`}>
                      {FEE_METRICS[fee][fund.key]}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pie chart representations */}
      <div className="grid grid-cols-3 gap-4">
        {funds.map((fund) => {
          const breakdown = FEE_BREAKDOWN[fund.key]
          return (
            <div key={fund.key} className="bg-surface border border-border rounded-xl p-4">
              <h4 className="text-caption font-semibold text-text-primary mb-3 text-center">{fund.shortName}</h4>
              <div className="flex rounded-full overflow-hidden h-4 mb-3">
                {breakdown.map((segment) => (
                  <motion.div
                    key={segment.label}
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percentage}%` }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className={`h-full ${segment.color}`}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {breakdown.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${segment.color}`} />
                      <span className="text-small text-text-secondary">{segment.label}</span>
                    </div>
                    <span className="text-small font-data text-text-primary">{segment.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RiskView({ funds }: ViewProps) {
  const riskMetricNames = Object.keys(RISK_METRICS)

  return (
    <div className="space-y-6">
      {/* Risk classification */}
      <div className="flex gap-3">
        {funds.map((fund) => {
          const riskInfo = RISK_LEVELS[fund.key]
          return (
            <div key={fund.key} className="flex-1 bg-surface border border-border rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${fund.color}`} />
                <span className="text-caption font-semibold text-text-primary">{fund.shortName}</span>
              </div>
              <Badge variant={riskInfo.variant} size="md">{riskInfo.level}</Badge>
            </div>
          )
        })}
      </div>

      {/* Risk metrics table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-secondary border-b border-border">
              <th className="text-left px-4 py-3 text-small font-semibold text-text-secondary">Metrique</th>
              {funds.map((fund) => (
                <th key={fund.key} className="text-right px-4 py-3 text-small font-semibold text-text-secondary">
                  {fund.shortName}
                </th>
              ))}
              <th className="text-center px-4 py-3 text-small font-semibold text-text-secondary">Meilleur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {riskMetricNames.map((metric) => {
              const values = funds.map((f) => RISK_METRICS[metric][f.key])
              const isLowerBetter = metric === 'Volatilite' || metric === 'Max Drawdown' || metric === 'Beta'
              const sorted = [...values].sort((a, b) =>
                isLowerBetter ? a.numericValue - b.numericValue : b.numericValue - a.numericValue
              )
              const bestValue = sorted[0].value

              return (
                <tr key={metric} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-caption text-text-primary font-medium">{metric}</td>
                  {funds.map((fund) => {
                    const metricValue = RISK_METRICS[metric][fund.key]
                    const isBest = metricValue.value === bestValue
                    return (
                      <td key={fund.key} className={`px-4 py-3 text-right text-caption font-data ${
                        isBest ? 'text-success font-semibold' : 'text-text-primary'
                      }`}>
                        {metricValue.value}
                      </td>
                    )
                  })}
                  <td className="px-4 py-3 text-center">
                    {funds.map((fund) => {
                      const metricValue = RISK_METRICS[metric][fund.key]
                      if (metricValue.value !== bestValue) return null
                      return (
                        <div key={fund.key} className="flex items-center justify-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${fund.color}`} />
                          <span className="text-small text-text-secondary">{fund.shortName}</span>
                        </div>
                      )
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Radar-style representation as styled grid */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-caption font-semibold text-text-primary mb-4">Profil de risque compare</h3>
        <div className="space-y-3">
          {riskMetricNames.map((metric) => {
            const maxValue = Math.max(...funds.map((f) => Math.abs(RISK_METRICS[metric][f.key].numericValue)))
            return (
              <div key={metric} className="space-y-1">
                <span className="text-small text-text-secondary">{metric}</span>
                <div className="space-y-1">
                  {funds.map((fund) => {
                    const value = Math.abs(RISK_METRICS[metric][fund.key].numericValue)
                    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
                    return (
                      <div key={fund.key} className="flex items-center gap-2">
                        <span className="text-[10px] w-12 text-text-muted text-right">{fund.shortName}</span>
                        <div className="flex-1 h-3 rounded-full bg-surface-tertiary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className={`h-full rounded-full ${fund.color}`}
                          />
                        </div>
                        <span className="text-[10px] font-data text-text-muted w-12">
                          {RISK_METRICS[metric][fund.key].value}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
