import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Calendar, TrendingUp, TrendingDown, Maximize2, Minimize2,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { staggerContainerVariants, staggerItemVariants } from '../lib/animations'

// --- Couleurs dataviz ---

const COLORS = {
  glacier500: '#29abb5',
  peach500: '#fe6d11',
  dataviz3: '#6366f1',
  dataviz4: '#16a34a',
  dataviz5: '#dc2626',
  dataviz6: '#8b5cf6',
}

const PIE_COLORS = [
  COLORS.glacier500, COLORS.peach500, COLORS.dataviz3,
  COLORS.dataviz4, COLORS.dataviz5, COLORS.dataviz6,
]

// --- Donnees mock ---

const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

const NAV_DATA = MONTHS.map((month, index) => ({
  month,
  alpha: 100 + index * 3.2 + Math.sin(index * 0.8) * 5,
  beta: 95 + index * 2.1 + Math.cos(index * 0.6) * 4,
  gamma: 105 + index * 1.8 + Math.sin(index * 1.2) * 6,
}))

const ALLOCATION_DATA = [
  { name: 'Tech', value: 30 },
  { name: 'Sante', value: 20 },
  { name: 'Finance', value: 15 },
  { name: 'Industrie', value: 15 },
  { name: 'Energie', value: 10 },
  { name: 'Autre', value: 10 },
]

const DRAWDOWN_DATA = MONTHS.map((month, index) => ({
  month,
  drawdown: -Math.abs(Math.sin(index * 0.7) * 12 + Math.cos(index * 1.3) * 5),
}))

const QUARTERS = ['Q1-23', 'Q2-23', 'Q3-23', 'Q4-23', 'Q1-24', 'Q2-24', 'Q3-24', 'Q4-24']

const CASHFLOW_DATA = QUARTERS.map((quarter) => ({
  quarter,
  appels: -(Math.random() * 8 + 2),
  distributions: Math.random() * 6 + 1,
}))

const SCATTER_DATA = [
  { name: 'Fonds Alpha', volatilite: 8, rendement: 12, type: 'PE' },
  { name: 'Fonds Beta', volatilite: 15, rendement: 18, type: 'VC' },
  { name: 'Fonds Gamma', volatilite: 6, rendement: 7, type: 'Debt' },
  { name: 'Fonds Delta', volatilite: 20, rendement: 15, type: 'VC' },
  { name: 'Fonds Epsilon', volatilite: 12, rendement: 10, type: 'PE' },
  { name: 'Fonds Zeta', volatilite: 22, rendement: 8, type: 'Hedge' },
  { name: 'Fonds Eta', volatilite: 10, rendement: 14, type: 'PE' },
  { name: 'Fonds Theta', volatilite: 18, rendement: 16, type: 'VC' },
]

const WATERFALL_DATA = [
  { name: 'Debut', value: 100, fill: COLORS.glacier500, isBase: true },
  { name: 'Revenus', value: 25, fill: COLORS.dataviz4, isBase: false },
  { name: 'Frais', value: -8, fill: COLORS.dataviz5, isBase: false },
  { name: 'Plus-values', value: 18, fill: COLORS.dataviz4, isBase: false },
  { name: 'Pertes', value: -12, fill: COLORS.dataviz5, isBase: false },
  { name: 'Fin', value: 123, fill: COLORS.glacier500, isBase: true },
]

function computeWaterfallBars(): { name: string; base: number; value: number; fill: string }[] {
  const bars: { name: string; base: number; value: number; fill: string }[] = []
  let cumulative = 0

  for (const item of WATERFALL_DATA) {
    if (item.isBase) {
      bars.push({ name: item.name, base: 0, value: item.value, fill: item.fill })
      cumulative = item.value
    } else {
      const base = item.value >= 0 ? cumulative : cumulative + item.value
      bars.push({ name: item.name, base, value: Math.abs(item.value), fill: item.fill })
      cumulative += item.value
    }
  }

  return bars
}

const WATERFALL_BARS = computeWaterfallBars()

const DATE_RANGES = ['12 mois', '3 ans', '5 ans', 'Depuis creation'] as const

// --- Tooltip personnalise ---

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function NavTooltip({ active, payload, label }: CustomTooltipProps): React.ReactNode {
  if (!active || !payload) return null

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
      <p className="text-small font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-small" style={{ color: entry.color }}>
          {entry.name}: <span className="font-data font-medium">{entry.value.toFixed(1)}</span>
        </p>
      ))}
    </div>
  )
}

// --- Composants de graphiques ---

interface ChartCardProps {
  title: string
  chartId: string
  expandedChart: string | null
  onToggleExpand: (id: string) => void
  children: React.ReactNode
}

function ChartCard({ title, chartId, expandedChart, onToggleExpand, children }: ChartCardProps): React.ReactNode {
  const isExpanded = expandedChart === chartId
  const isHidden = expandedChart !== null && !isExpanded

  if (isHidden) return null

  return (
    <motion.div
      layout
      className={`bg-surface rounded-xl border border-border shadow-sm overflow-hidden ${
        isExpanded ? 'col-span-full' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-muted">
        <h3 className="text-caption font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => onToggleExpand(chartId)}
          className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-muted transition-colors cursor-pointer"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
      <div className={`p-4 ${isExpanded ? 'h-[400px]' : 'h-[260px]'}`}>
        {children}
      </div>
    </motion.div>
  )
}

function NavChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={NAV_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#91919f' }} />
        <YAxis tick={{ fontSize: 11, fill: '#91919f' }} domain={['auto', 'auto']} />
        <RechartsTooltip content={<NavTooltip />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="alpha"
          name="Alpha"
          stroke={COLORS.glacier500}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="beta"
          name="Beta"
          stroke={COLORS.peach500}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="gamma"
          name="Gamma"
          stroke={COLORS.dataviz3}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function AllocationChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={ALLOCATION_DATA}
          cx="50%"
          cy="50%"
          outerRadius="75%"
          innerRadius="40%"
          dataKey="value"
          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#91919f', strokeWidth: 1 }}
        >
          {ALLOCATION_DATA.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index]} />
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
  )
}

function DrawdownChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={DRAWDOWN_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#91919f' }} />
        <YAxis tick={{ fontSize: 11, fill: '#91919f' }} domain={['auto', 0]} />
        <RechartsTooltip
          formatter={(value?: number) => [`${(value ?? 0).toFixed(1)}%`, 'Drawdown']}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="drawdown"
          stroke={COLORS.dataviz5}
          fill={COLORS.dataviz5}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function CashFlowChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={CASHFLOW_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#91919f' }} />
        <YAxis tick={{ fontSize: 11, fill: '#91919f' }} />
        <RechartsTooltip
          formatter={(value?: number) => [`${(value ?? 0).toFixed(1)} M`, '']}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="appels" name="Appels" fill={COLORS.peach500} stackId="stack" radius={[0, 0, 0, 0]} />
        <Bar dataKey="distributions" name="Distributions" fill={COLORS.glacier500} stackId="stack" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function RiskReturnChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis
          type="number"
          dataKey="volatilite"
          name="Volatilite"
          tick={{ fontSize: 11, fill: '#91919f' }}
          domain={[0, 28]}
          label={{ value: 'Volatilite (%)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#91919f' }}
        />
        <YAxis
          type="number"
          dataKey="rendement"
          name="Rendement"
          tick={{ fontSize: 11, fill: '#91919f' }}
          domain={[0, 22]}
          label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#91919f' }}
        />
        <RechartsTooltip
          formatter={(value?: number) => [`${value ?? 0}%`]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <ReferenceLine x={14} stroke="#ced4da" strokeDasharray="4 4" />
        <ReferenceLine y={12.5} stroke="#ced4da" strokeDasharray="4 4" />
        <Scatter data={SCATTER_DATA} fill={COLORS.glacier500}>
          {SCATTER_DATA.map((entry, index) => {
            const colorMap: Record<string, string> = {
              PE: COLORS.glacier500,
              VC: COLORS.peach500,
              Debt: COLORS.dataviz4,
              Hedge: COLORS.dataviz6,
            }
            return <Cell key={index} fill={colorMap[entry.type] ?? COLORS.glacier500} />
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function WaterfallChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={WATERFALL_BARS}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#91919f' }} />
        <YAxis tick={{ fontSize: 11, fill: '#91919f' }} domain={[0, 'auto']} />
        <RechartsTooltip
          formatter={(value?: number, name?: string) => {
            if (name === 'base') return [null, null]
            return [`${(value ?? 0).toFixed(0)} M`, 'Valeur']
          }}
          contentStyle={{
            background: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="base" stackId="waterfall" fill="transparent" />
        <Bar dataKey="value" stackId="waterfall" radius={[2, 2, 0, 0]}>
          {WATERFALL_BARS.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// --- Toast ---

function Toast({ message, onClose }: { message: string; onClose: () => void }): React.ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 right-6 bg-surface-inverse text-text-inverse px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3"
    >
      <span className="text-caption">{message}</span>
      <button onClick={onClose} className="text-text-inverse/60 hover:text-text-inverse cursor-pointer text-small">
        Fermer
      </button>
    </motion.div>
  )
}

// --- Composant principal ---

export function DatavizExperiment(): React.ReactNode {
  const [dateRange, setDateRange] = useState<string>(DATE_RANGES[0])
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function handleToggleExpand(chartId: string): void {
    setExpandedChart((current) => (current === chartId ? null : chartId))
  }

  function handleExport(): void {
    setToastMessage('Export CSV en cours de preparation...')
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h1 className="text-h4 text-text-primary">Dashboard Performance</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-border">
            <Calendar className="w-4 h-4 text-text-muted" />
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="text-small text-text-primary bg-transparent outline-none cursor-pointer"
            >
              {DATE_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 px-6 py-3 border-b border-border-muted bg-surface">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-small text-text-secondary">Performance YTD</span>
          <span className="text-data font-medium text-success font-data">+14.2%</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-danger" />
          <span className="text-small text-text-secondary">Max Drawdown</span>
          <span className="text-data font-medium text-danger font-data">-8.7%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-small text-text-secondary">Sharpe Ratio</span>
          <span className="text-data font-medium text-text-primary font-data">1.42</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-small text-text-secondary">AUM Total</span>
          <span className="text-data font-medium text-text-primary font-data">842 M</span>
        </div>
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-6 scrollbar-thin"
      >
        <motion.div
          layout
          className={`grid gap-5 ${
            expandedChart ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Evolution NAV"
              chartId="nav"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <NavChart />
            </ChartCard>
          </motion.div>

          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Allocation Sectorielle"
              chartId="allocation"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <AllocationChart />
            </ChartCard>
          </motion.div>

          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Drawdown"
              chartId="drawdown"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <DrawdownChart />
            </ChartCard>
          </motion.div>

          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Cash Flows"
              chartId="cashflow"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <CashFlowChart />
            </ChartCard>
          </motion.div>

          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Rendement vs Risque"
              chartId="scatter"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <RiskReturnChart />
            </ChartCard>
          </motion.div>

          <motion.div variants={staggerItemVariants} layout>
            <ChartCard
              title="Performance Waterfall"
              chartId="waterfall"
              expandedChart={expandedChart}
              onToggleExpand={handleToggleExpand}
            >
              <WaterfallChart />
            </ChartCard>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>
    </div>
  )
}
