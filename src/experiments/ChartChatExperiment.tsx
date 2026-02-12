import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, ReferenceArea,
} from 'recharts'
import { messageVariants, staggerContainerVariants, staggerItemVariants } from '../lib/animations'

// --- Couleurs dataviz ---

const COLORS = {
  glacier500: '#29abb5',
  peach500: '#fe6d11',
  dataviz3: '#6366f1',
  dataviz4: '#16a34a',
  dataviz5: '#dc2626',
}

const PIE_COLORS = [
  COLORS.glacier500, COLORS.peach500, COLORS.dataviz3,
  COLORS.dataviz4, COLORS.dataviz5, '#8b5cf6',
]

// --- Donnees mock ---

const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

const NAV_DATA = MONTHS.map((month, index) => ({
  month,
  alpha: +(100 + index * 1.7 + Math.sin(index * 0.7) * 4 - (index === 8 ? 1.3 : 0)).toFixed(1),
  beta: +(95 + index * 0.8 + Math.cos(index * 0.5) * 2 + (index === 8 ? 0.3 : 0)).toFixed(1),
  gamma: +(105 + index * 3.1 + Math.sin(index * 1.1) * 7 - (index === 8 ? 5.5 : 0)).toFixed(1),
}))

const Q3_ZOOM_DATA = NAV_DATA.filter((_, i) => i >= 6 && i <= 9)

const SECTOR_DATA = [
  { name: 'Tech', value: 30 },
  { name: 'Sante', value: 20 },
  { name: 'Finance', value: 15 },
  { name: 'Industrie', value: 15 },
  { name: 'Energie', value: 10 },
  { name: 'Autre', value: 10 },
]

const CASHFLOW_DATA = [
  { quarter: 'Q1 2024', appels: -5.2, distributions: 3.1 },
  { quarter: 'Q2 2024', appels: -3.8, distributions: 4.5 },
  { quarter: 'Q3 2024', appels: -6.1, distributions: 2.8 },
  { quarter: 'Q4 2024', appels: -4.3, distributions: 5.9 },
]

// --- Types ---

type ChartId = 'nav' | 'sector' | 'cashflow'

interface ChartDefinition {
  id: ChartId
  title: string
  icon: React.ReactNode
  suggestions: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  inlineChart?: 'q3-zoom'
  suggestions?: string[]
}

// --- Definitions des graphiques ---

const CHART_DEFINITIONS: ChartDefinition[] = [
  {
    id: 'nav',
    title: 'Courbe NAV',
    icon: <LineChartIcon className="w-4 h-4" />,
    suggestions: [
      'Quelle tendance sur les 6 derniers mois ?',
      'Quel fonds performe le mieux ?',
      'Expliquer la baisse de septembre',
    ],
  },
  {
    id: 'sector',
    title: 'Repartition sectorielle',
    icon: <PieChartIcon className="w-4 h-4" />,
    suggestions: [
      'La diversification est-elle suffisante ?',
      'Quel risque de concentration ?',
      'Comparer avec un benchmark',
      'Quels secteurs surponderer ?',
    ],
  },
  {
    id: 'cashflow',
    title: 'Cash Flows trimestriels',
    icon: <BarChart3 className="w-4 h-4" />,
    suggestions: [
      'Le rythme de distribution est-il normal ?',
      'Quand le breakeven ?',
      'Projeter les flux Q1 2025',
    ],
  },
]

// --- Conversations pre-chargees ---

const NAV_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'nav-1',
    role: 'user',
    content: 'Quel fonds performe le mieux sur la periode ?',
  },
  {
    id: 'nav-2',
    role: 'assistant',
    content: `**Gamma Venture Fund** affiche la meilleure performance sur 12 mois avec une progression de **+32,4%** de sa NAV.

Cependant, cette surperformance s'accompagne d'une **volatilite significativement plus elevee** (ecart-type de 6,2% vs 3,1% pour Alpha).

Points cles :
- 📈 **Gamma** : +32,4% — portee par 2 exits reussis en Q2
- 📊 **Alpha** : +18,5% — progression reguliere et stable
- 📉 **Beta** : +8,2% — strategie credit, profil defensif attendu

> La baisse observee en septembre (-4,2% pour Gamma) correspond a la correction tech du marche, avec une recuperation rapide en octobre.`,
    suggestions: ['Zoomer sur Q3', 'Comparer la volatilite', 'Risque de concentration Gamma'],
  },
  {
    id: 'nav-3',
    role: 'user',
    content: 'Zoomer sur Q3',
  },
  {
    id: 'nav-4',
    role: 'assistant',
    content: `**Zoom sur Q3 2024** (Juillet — Octobre)

La periode est marquee par une divergence nette entre les fonds :`,
    inlineChart: 'q3-zoom',
    suggestions: ['Analyser la correlation', 'Impact sur le portefeuille global', 'Historique des corrections'],
  },
]

const SECTOR_WELCOME: ChatMessage[] = [
  {
    id: 'sector-w',
    role: 'assistant',
    content: `Vous avez selectionne le graphique **Repartition sectorielle**. Ce graphique montre l'allocation par secteur du portefeuille consolide.

Posez-moi une question sur la diversification, les risques de concentration ou la comparaison avec un benchmark.`,
    suggestions: [
      'La diversification est-elle suffisante ?',
      'Quel risque de concentration ?',
      'Comparer avec un benchmark',
    ],
  },
]

const CASHFLOW_WELCOME: ChatMessage[] = [
  {
    id: 'cashflow-w',
    role: 'assistant',
    content: `Vous avez selectionne le graphique **Cash Flows trimestriels**. Il represente les appels de fonds (negatifs) et les distributions (positifs) sur 4 trimestres.

Interrogez-moi sur le rythme des distributions, le breakeven ou les projections.`,
    suggestions: [
      'Le rythme de distribution est-il normal ?',
      'Quand le breakeven ?',
      'Projeter les flux Q1 2025',
    ],
  },
]

function getInitialMessages(chartId: ChartId): ChatMessage[] {
  switch (chartId) {
    case 'nav': return NAV_INITIAL_MESSAGES
    case 'sector': return SECTOR_WELCOME
    case 'cashflow': return CASHFLOW_WELCOME
  }
}

function generateGenericResponse(chartId: ChartId, question: string): ChatMessage {
  const chartName = CHART_DEFINITIONS.find((c) => c.id === chartId)?.title ?? 'graphique'
  const responses: Record<ChartId, string> = {
    nav: `Concernant la **${chartName}**, votre question est pertinente. Sur la base des donnees affichees, on observe une tendance haussiere globale avec des variations cycliques. Les trois fonds montrent des comportements differencies qui refletent leurs strategies respectives.\n\n> "${question}"\n\nAlpha maintient un profil stable, Beta offre une protection en marche baissier, et Gamma capture les opportunites de croissance avec plus de volatilite.`,
    sector: `Concernant la **${chartName}**, votre question merite une analyse approfondie. L'allocation actuelle montre une concentration notable dans le secteur Tech (30%) qui est superieure aux indices de reference habituels.\n\n> "${question}"\n\nLa diversification intersectorielle est correcte avec 6 secteurs representes, mais le poids des 2 premiers secteurs (Tech + Sante = 50%) justifie une attention particuliere.`,
    cashflow: `Concernant les **${chartName}**, l'analyse des flux montre un pattern classique de fonds en phase de maturite. Les appels diminuent progressivement tandis que les distributions augmentent.\n\n> "${question}"\n\nLe ratio distributions/appels est passe de 0,60x en Q1 a 1,37x en Q4, indiquant une nette amelioration de la generation de liquidites.`,
  }
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: responses[chartId],
    suggestions: CHART_DEFINITIONS.find((c) => c.id === chartId)?.suggestions.slice(0, 2),
  }
}

// --- Tooltip personnalise ---

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps): React.ReactNode {
  if (!active || !payload) return null
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-2.5">
      <p className="text-small font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-small" style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">{entry.value.toFixed(1)}</span>
        </p>
      ))}
    </div>
  )
}

// --- Composants graphiques ---

function NavChart({ showSeptemberAnnotation }: { showSeptemberAnnotation: boolean }): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={NAV_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#91919f' }} />
        <YAxis tick={{ fontSize: 11, fill: '#91919f' }} domain={['auto', 'auto']} />
        <RechartsTooltip content={<ChartTooltip />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        {showSeptemberAnnotation && (
          <ReferenceArea x1="Sep" x2="Sep" fill={COLORS.dataviz5} fillOpacity={0.1} />
        )}
        <Line type="monotone" dataKey="alpha" name="Alpha" stroke={COLORS.glacier500} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="beta" name="Beta" stroke={COLORS.peach500} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="gamma" name="Gamma" stroke={COLORS.dataviz3} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function SectorChart(): React.ReactNode {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={SECTOR_DATA}
          cx="50%"
          cy="50%"
          outerRadius="75%"
          innerRadius="40%"
          dataKey="value"
          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#91919f', strokeWidth: 1 }}
        >
          {SECTOR_DATA.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index]} />
          ))}
        </Pie>
        <RechartsTooltip
          formatter={(value?: number) => [`${value ?? 0}%`, 'Part']}
          contentStyle={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, fontSize: 12 }}
        />
      </PieChart>
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
          formatter={(value?: number) => [`${(value ?? 0).toFixed(1)} M€`, '']}
          contentStyle={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="appels" name="Appels" fill={COLORS.peach500} stackId="stack" radius={[0, 0, 2, 2]} />
        <Bar dataKey="distributions" name="Distributions" fill={COLORS.glacier500} stackId="stack" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function Q3ZoomChart(): React.ReactNode {
  return (
    <div className="my-3 bg-surface border border-border rounded-xl p-3">
      <p className="text-small font-medium text-text-secondary mb-2">Performance Q3 2024 (Jul — Oct)</p>
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={Q3_ZOOM_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#91919f' }} />
            <YAxis tick={{ fontSize: 10, fill: '#91919f' }} domain={['auto', 'auto']} />
            <RechartsTooltip content={<ChartTooltip />} />
            <ReferenceArea x1="Sep" x2="Sep" fill={COLORS.dataviz5} fillOpacity={0.2} label={{ value: 'Correction', fontSize: 10, fill: COLORS.dataviz5 }} />
            <Line type="monotone" dataKey="alpha" name="Alpha" stroke={COLORS.glacier500} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="beta" name="Beta" stroke={COLORS.peach500} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="gamma" name="Gamma" stroke={COLORS.dataviz3} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-small text-text-primary">
          <strong>Septembre</strong> a ete le mois le plus volatil de l'annee :
        </p>
        <p className="text-small text-text-secondary">• Gamma : <span className="text-red-600 font-medium">-4,2%</span> (correction tech, exposition Biotech)</p>
        <p className="text-small text-text-secondary">• Alpha : <span className="text-red-600 font-medium">-1,1%</span> (resilience du mid-cap)</p>
        <p className="text-small text-text-secondary">• Beta : <span className="text-green-600 font-medium">+0,3%</span> (decorrelation credit/equity)</p>
        <p className="text-small text-text-secondary mt-1">La recuperation en octobre (+5,8% pour Gamma) confirme que la baisse etait conjoncturelle et non structurelle.</p>
      </div>
    </div>
  )
}

// --- Miniature du graphique selectionne ---

function ChartThumbnail({ chartId, showAnnotation }: { chartId: ChartId; showAnnotation: boolean }): React.ReactNode {
  return (
    <div className="h-[100px] w-full px-3 pt-2 pb-1">
      {chartId === 'nav' && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={NAV_DATA}>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#91919f' }} />
            <YAxis hide domain={['auto', 'auto']} />
            {showAnnotation && <ReferenceArea x1="Sep" x2="Sep" fill={COLORS.dataviz5} fillOpacity={0.1} />}
            <Line type="monotone" dataKey="alpha" stroke={COLORS.glacier500} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="beta" stroke={COLORS.peach500} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="gamma" stroke={COLORS.dataviz3} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {chartId === 'sector' && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={SECTOR_DATA} cx="50%" cy="50%" outerRadius="90%" innerRadius="50%" dataKey="value">
              {SECTOR_DATA.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
      {chartId === 'cashflow' && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA}>
            <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#91919f' }} />
            <YAxis hide />
            <Bar dataKey="appels" fill={COLORS.peach500} stackId="stack" />
            <Bar dataKey="distributions" fill={COLORS.glacier500} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// --- Indicateur de frappe ---

function TypingIndicator(): React.ReactNode {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-surface-secondary border border-border-muted flex items-center justify-center">
        <Bot className="w-4 h-4 text-text-secondary" />
      </div>
      <div className="bg-surface-secondary border border-border-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="w-2 h-2 rounded-full bg-text-muted"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Rendu du contenu markdown simplifie ---

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-3 border-accent pl-3 my-2 text-text-secondary italic">
          {renderInline(line.slice(2))}
        </blockquote>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <p key={i} className="pl-2 my-0.5">{renderInline(line)}</p>
      )
    } else if (line.trim() === '') {
      elements.push(<br key={i} />)
    } else {
      elements.push(
        <p key={i} className="my-0.5">{renderInline(line)}</p>
      )
    }
  }

  return <>{elements}</>
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

// --- Composant principal ---

export function ChartChatExperiment(): React.ReactNode {
  const [selectedChart, setSelectedChart] = useState<ChartId>('nav')
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages('nav'))
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const showSeptemberAnnotation = selectedChart === 'nav' && messages.some(
    (m) => m.role === 'assistant' && (m.content.includes('septembre') || m.content.includes('Septembre') || m.content.includes('Q3'))
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  function handleSelectChart(chartId: ChartId): void {
    if (chartId === selectedChart) return
    setSelectedChart(chartId)
    setMessages(getInitialMessages(chartId))
    setInputValue('')
    setIsTyping(false)
  }

  function handleSendMessage(text: string): void {
    if (!text.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateGenericResponse(selectedChart, text.trim())
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const selectedChartDef = CHART_DEFINITIONS.find((c) => c.id === selectedChart)
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')

  return (
    <div className="w-full h-full flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Panneau gauche - Galerie de graphiques (55%) */}
      <div className="w-[55%] flex flex-col border-r border-border">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-surface-secondary">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h2 className="text-h4 text-text-primary">Graphiques</h2>
          <span className="text-small text-text-muted ml-auto">Cliquez pour selectionner</span>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
        >
          {/* Courbe NAV */}
          <motion.div variants={staggerItemVariants}>
            <button
              onClick={() => handleSelectChart('nav')}
              className={`w-full text-left bg-surface rounded-xl border transition-all cursor-pointer ${
                selectedChart === 'nav'
                  ? 'border-accent shadow-md shadow-accent/10 ring-1 ring-accent/30'
                  : 'border-border hover:border-border-muted hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-muted">
                <LineChartIcon className={`w-4 h-4 ${selectedChart === 'nav' ? 'text-accent' : 'text-text-muted'}`} />
                <h3 className="text-caption font-semibold text-text-primary">Courbe NAV</h3>
                <span className="text-small text-text-muted ml-auto">3 fonds — 12 mois</span>
              </div>
              <div className="h-[200px] p-3">
                <NavChart showSeptemberAnnotation={showSeptemberAnnotation} />
              </div>
            </button>
            <AnimatePresence>
              {selectedChart === 'nav' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 px-1">
                    {CHART_DEFINITIONS[0].suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-small font-medium hover:bg-accent/20 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Repartition sectorielle */}
          <motion.div variants={staggerItemVariants}>
            <button
              onClick={() => handleSelectChart('sector')}
              className={`w-full text-left bg-surface rounded-xl border transition-all cursor-pointer ${
                selectedChart === 'sector'
                  ? 'border-accent shadow-md shadow-accent/10 ring-1 ring-accent/30'
                  : 'border-border hover:border-border-muted hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-muted">
                <PieChartIcon className={`w-4 h-4 ${selectedChart === 'sector' ? 'text-accent' : 'text-text-muted'}`} />
                <h3 className="text-caption font-semibold text-text-primary">Repartition sectorielle</h3>
                <span className="text-small text-text-muted ml-auto">6 secteurs</span>
              </div>
              <div className="h-[200px] p-3">
                <SectorChart />
              </div>
            </button>
            <AnimatePresence>
              {selectedChart === 'sector' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 px-1">
                    {CHART_DEFINITIONS[1].suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-small font-medium hover:bg-accent/20 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Cash Flows */}
          <motion.div variants={staggerItemVariants}>
            <button
              onClick={() => handleSelectChart('cashflow')}
              className={`w-full text-left bg-surface rounded-xl border transition-all cursor-pointer ${
                selectedChart === 'cashflow'
                  ? 'border-accent shadow-md shadow-accent/10 ring-1 ring-accent/30'
                  : 'border-border hover:border-border-muted hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-muted">
                <BarChart3 className={`w-4 h-4 ${selectedChart === 'cashflow' ? 'text-accent' : 'text-text-muted'}`} />
                <h3 className="text-caption font-semibold text-text-primary">Cash Flows trimestriels</h3>
                <span className="text-small text-text-muted ml-auto">4 trimestres</span>
              </div>
              <div className="h-[200px] p-3">
                <CashFlowChart />
              </div>
            </button>
            <AnimatePresence>
              {selectedChart === 'cashflow' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 px-1">
                    {CHART_DEFINITIONS[2].suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-small font-medium hover:bg-accent/20 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Panneau droit - Chat (45%) */}
      <div className="w-[45%] flex flex-col min-w-0">
        {/* Header du chat */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface-secondary">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-caption font-semibold text-text-primary truncate">
              {selectedChartDef ? `Chat — ${selectedChartDef.title}` : 'Selectionnez un graphique'}
            </h3>
            <p className="text-small text-text-muted">Analyse contextuelle</p>
          </div>
        </div>

        {/* Miniature du graphique */}
        {selectedChart && (
          <div className="border-b border-border-muted bg-surface-secondary/50">
            <ChartThumbnail chartId={selectedChart} showAnnotation={showSeptemberAnnotation} />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isUser ? 'bg-accent text-white' : 'bg-surface-secondary border border-border-muted text-text-secondary'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 text-body leading-relaxed ${
                    isUser
                      ? 'bg-accent text-white rounded-br-md'
                      : 'bg-surface-secondary border border-border-muted text-text-primary rounded-bl-md'
                  }`}>
                    {renderMarkdown(message.content)}
                    {message.inlineChart === 'q3-zoom' && <Q3ZoomChart />}
                  </div>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-small font-medium hover:bg-accent/20 transition-colors cursor-pointer"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />

          {/* Suggestions du dernier message assistant (si pas en train d'ecrire et pas deja dans le message) */}
          {!isTyping && lastAssistantMessage && !lastAssistantMessage.suggestions && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                {CHART_DEFINITIONS.find((c) => c.id === selectedChart)?.suggestions.slice(0, 2).map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-surface-secondary border border-border text-small text-text-secondary hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-surface p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question sur le graphique..."
              rows={1}
              disabled={isTyping}
              className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl bg-accent p-3 text-white hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
