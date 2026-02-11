import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Star, Brain, Code, Eye, BarChart3,
  MessageSquare, FileText, Bug, Search, Send, Settings,
  Bot, User, DollarSign, Cpu, ChevronRight,
} from 'lucide-react'
import { messageVariants, smoothTransition } from '../lib/animations'

interface Model {
  id: string
  name: string
  provider: string
  description: string
  capabilities: { icon: React.ReactNode; label: string }[]
  cost: 1 | 2 | 3
  maxTokens: number
  costPerToken: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  modelId: string
  timestamp: Date
  tokensUsed?: number
  latencyMs?: number
}

const MODELS: Model[] = [
  {
    id: 'pro',
    name: 'Decider Pro',
    provider: 'Decider AI',
    description: 'Modele phare avec raisonnement avance et analyse approfondie.',
    capabilities: [
      { icon: <Brain className="w-3.5 h-3.5" />, label: 'Reasoning' },
      { icon: <Code className="w-3.5 h-3.5" />, label: 'Code' },
      { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Analyse' },
    ],
    cost: 3,
    maxTokens: 128000,
    costPerToken: '0.015',
  },
  {
    id: 'flash',
    name: 'Decider Flash',
    provider: 'Decider AI',
    description: 'Rapide et economique pour les taches courantes.',
    capabilities: [
      { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Chat' },
      { icon: <FileText className="w-3.5 h-3.5" />, label: 'Resume' },
    ],
    cost: 1,
    maxTokens: 32000,
    costPerToken: '0.001',
  },
  {
    id: 'finance',
    name: 'Decider Finance',
    provider: 'Decider AI',
    description: 'Specialise dans l\'analyse financiere et les donnees de marche.',
    capabilities: [
      { icon: <DollarSign className="w-3.5 h-3.5" />, label: 'Finance' },
      { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Analyse' },
      { icon: <Search className="w-3.5 h-3.5" />, label: 'Data' },
    ],
    cost: 2,
    maxTokens: 64000,
    costPerToken: '0.008',
  },
  {
    id: 'vision',
    name: 'Decider Vision',
    provider: 'Decider AI',
    description: 'Modele multimodal capable d\'analyser texte et images.',
    capabilities: [
      { icon: <Eye className="w-3.5 h-3.5" />, label: 'Vision' },
      { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Chat' },
      { icon: <Code className="w-3.5 h-3.5" />, label: 'Code' },
    ],
    cost: 2,
    maxTokens: 64000,
    costPerToken: '0.010',
  },
  {
    id: 'code',
    name: 'Decider Code',
    provider: 'Decider AI',
    description: 'Specialise dans le developpement, le debug et la revue de code.',
    capabilities: [
      { icon: <Code className="w-3.5 h-3.5" />, label: 'Code' },
      { icon: <Bug className="w-3.5 h-3.5" />, label: 'Debug' },
      { icon: <Search className="w-3.5 h-3.5" />, label: 'Review' },
    ],
    cost: 2,
    maxTokens: 96000,
    costPerToken: '0.009',
  },
]

const MOCK_RESPONSES: Record<string, string> = {
  pro: 'Apres une analyse approfondie, voici ma reflexion structuree :\n\n1. Le contexte macroeconomique actuel suggere une approche prudente\n2. Les indicateurs fondamentaux montrent des signaux mixtes\n3. Je recommande une diversification strategique avec un horizon de 18 mois\n\nCette analyse prend en compte les derniers rapports BCE et les tendances de marche.',
  flash: 'Voici un resume rapide : les marches sont stables avec une legere tendance haussiere. Les principaux indices montrent +0.3% sur la semaine.',
  finance: 'Analyse financiere detaillee :\n\n- IRR du portefeuille : 12.4% (vs benchmark 9.8%)\n- Ratio de Sharpe : 1.45\n- Volatilite annualisee : 8.2%\n- VaR 95% : -3.1%\n\nLe portefeuille surperforme le benchmark de 260 bps.',
  vision: 'J\'ai analyse l\'image fournie. Il s\'agit d\'un graphique de performance trimestrielle montrant une tendance positive sur Q3-Q4 2024. Les barres vertes indiquent une croissance de 15% par rapport au trimestre precedent.',
  code: '```typescript\nfunction calculateIRR(cashflows: number[]): number {\n  let rate = 0.1;\n  for (let i = 0; i < 100; i++) {\n    const npv = cashflows.reduce((sum, cf, t) =>\n      sum + cf / Math.pow(1 + rate, t), 0);\n    const dnpv = cashflows.reduce((sum, cf, t) =>\n      sum - t * cf / Math.pow(1 + rate, t + 1), 0);\n    rate -= npv / dnpv;\n  }\n  return rate;\n}\n```\nCette implementation utilise la methode Newton-Raphson pour converger rapidement.',
}

function CostIndicator({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map((index) => (
        <DollarSign
          key={index}
          className={`w-3 h-3 ${index <= level ? 'text-peach-500' : 'text-text-muted/30'}`}
        />
      ))}
    </span>
  )
}

let messageIdCounter = 0

export function ModelsExperiment() {
  const [selectedModelId, setSelectedModelId] = useState('pro')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['pro', 'finance']))
  const [mode, setMode] = useState<'chat' | 'comparison'>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [comparisonModels, setComparisonModels] = useState<string[]>(['pro', 'flash', 'finance'])
  const [comparisonMessages, setComparisonMessages] = useState<Record<string, ChatMessage[]>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showModelInfo, setShowModelInfo] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [topP, setTopP] = useState(0.9)
  const [systemPrompt, setSystemPrompt] = useState('Vous etes un assistant financier specialise.')
  const [inputValue, setInputValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedModel = MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, comparisonMessages])

  const toggleFavorite = useCallback((modelId: string) => {
    setFavorites((previous) => {
      const next = new Set(previous)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }, [])

  const handleSendChat = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return
    setInputValue('')

    const userMessage: ChatMessage = {
      id: String(++messageIdCounter),
      role: 'user',
      content: trimmed,
      modelId: selectedModelId,
      timestamp: new Date(),
    }
    setMessages((previous) => [...previous, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: String(++messageIdCounter),
        role: 'assistant',
        content: MOCK_RESPONSES[selectedModelId] ?? 'Reponse du modele.',
        modelId: selectedModelId,
        timestamp: new Date(),
        tokensUsed: 150 + Math.floor(Math.random() * 300),
        latencyMs: 400 + Math.floor(Math.random() * 1200),
      }
      setMessages((previous) => [...previous, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }, [inputValue, isTyping, selectedModelId])

  const handleSendComparison = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return
    setInputValue('')
    setIsTyping(true)

    const userMsg: ChatMessage = {
      id: String(++messageIdCounter),
      role: 'user',
      content: trimmed,
      modelId: 'user',
      timestamp: new Date(),
    }

    const newComparisonMessages: Record<string, ChatMessage[]> = {}
    for (const modelId of comparisonModels) {
      newComparisonMessages[modelId] = [
        ...(comparisonMessages[modelId] ?? []),
        userMsg,
      ]
    }
    setComparisonMessages(newComparisonMessages)

    for (const modelId of comparisonModels) {
      const delay = 600 + Math.random() * 1500
      setTimeout(() => {
        const response: ChatMessage = {
          id: String(++messageIdCounter),
          role: 'assistant',
          content: MOCK_RESPONSES[modelId] ?? 'Reponse.',
          modelId,
          timestamp: new Date(),
          tokensUsed: 100 + Math.floor(Math.random() * 400),
          latencyMs: Math.floor(delay),
        }
        setComparisonMessages((previous) => ({
          ...previous,
          [modelId]: [...(previous[modelId] ?? []), response],
        }))
      }, delay)
    }

    setTimeout(() => setIsTyping(false), 2500)
  }, [inputValue, isTyping, comparisonModels, comparisonMessages])

  const handleSend = mode === 'chat' ? handleSendChat : handleSendComparison

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const toggleComparisonModel = useCallback((modelId: string) => {
    setComparisonModels((previous) => {
      if (previous.includes(modelId)) {
        if (previous.length <= 2) return previous
        return previous.filter((id) => id !== modelId)
      }
      if (previous.length >= 3) return previous
      return [...previous, modelId]
    })
  }, [])

  return (
    <div className="w-full h-full max-w-6xl mx-auto flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-accent/50 transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-accent" />
              <span className="text-caption font-medium text-text-primary">{selectedModel.name}</span>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-80 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModelId(model.id); setDropdownOpen(false) }}
                      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-secondary transition-colors text-left cursor-pointer ${
                        model.id === selectedModelId ? 'bg-accent-muted/30' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-caption font-medium text-text-primary">{model.name}</span>
                          <span className="text-[0.625rem] px-1.5 py-0.5 rounded-full bg-glacier-100 text-glacier-700 font-medium">
                            {model.provider}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-1">
                            {model.capabilities.map((cap, index) => (
                              <span key={index} className="text-text-muted" title={cap.label}>{cap.icon}</span>
                            ))}
                          </div>
                          <CostIndicator level={model.cost} />
                        </div>
                      </div>
                      <button
                        onClick={(event) => { event.stopPropagation(); toggleFavorite(model.id) }}
                        className="mt-0.5 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${favorites.has(model.id) ? 'fill-yellow-400 text-yellow-400' : 'text-text-muted'}`} />
                      </button>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex bg-surface rounded-lg border border-border p-0.5">
            {(['chat', 'comparison'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`px-3 py-1.5 text-small font-medium rounded-md transition-colors cursor-pointer ${
                  mode === tab ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab === 'chat' ? 'Chat' : 'Comparaison'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            showSettings ? 'bg-accent-muted text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-tertiary'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {mode === 'chat' && (
            <>
              <AnimatePresence>
                {showModelInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={smoothTransition}
                    className="overflow-hidden border-b border-border"
                  >
                    <div className="p-4 bg-surface-secondary">
                      <p className="text-small text-text-secondary mb-3">{selectedModel.description}</p>
                      <div className="flex flex-wrap gap-4 text-small">
                        <div>
                          <span className="text-text-muted">Tokens max : </span>
                          <span className="text-text-primary font-medium">{selectedModel.maxTokens.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Cout/token : </span>
                          <span className="text-text-primary font-medium">${selectedModel.costPerToken}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {selectedModel.capabilities.map((cap, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-muted text-accent text-[0.6875rem] font-medium">
                              {cap.icon} {cap.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowModelInfo(!showModelInfo)}
                className="flex items-center gap-1 px-4 py-2 text-small text-text-muted hover:text-accent transition-colors cursor-pointer border-b border-border"
              >
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showModelInfo ? 'rotate-90' : ''}`} />
                Infos modele
              </button>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' ? 'bg-glacier-600 text-white' : 'bg-surface-tertiary text-text-secondary'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-glacier-600 text-white rounded-br-md'
                          : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                      }`}>
                        <div className="text-body leading-relaxed whitespace-pre-wrap">{message.content}</div>
                        {message.tokensUsed && (
                          <div className="flex gap-3 mt-2 text-[0.625rem] text-text-muted">
                            <span>{message.tokensUsed} tokens</span>
                            <span>{message.latencyMs}ms</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div className="bg-surface-tertiary rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((index) => (
                          <motion.div
                            key={index}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.2 }}
                            className="w-2 h-2 rounded-full bg-text-muted"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}

          {mode === 'comparison' && (
            <>
              <div className="flex gap-2 px-4 py-2 border-b border-border overflow-x-auto">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => toggleComparisonModel(model.id)}
                    className={`shrink-0 px-3 py-1.5 text-small font-medium rounded-full border transition-colors cursor-pointer ${
                      comparisonModels.includes(model.id)
                        ? 'bg-accent-muted text-accent border-accent/30'
                        : 'bg-surface text-text-muted border-border hover:border-border'
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex min-h-0">
                {comparisonModels.map((modelId) => {
                  const model = MODELS.find((m) => m.id === modelId)!
                  const modelMessages = comparisonMessages[modelId] ?? []
                  return (
                    <div key={modelId} className="flex-1 flex flex-col border-r last:border-r-0 border-border min-w-0">
                      <div className="px-3 py-2 border-b border-border bg-surface-secondary">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-accent" />
                          <span className="text-small font-medium text-text-primary truncate">{model.name}</span>
                          <CostIndicator level={model.cost} />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {modelMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-small leading-relaxed ${
                              message.role === 'user' ? 'text-text-muted italic' : 'text-text-primary'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.tokensUsed && (
                              <div className="flex gap-2 mt-1.5 text-[0.625rem] text-text-muted">
                                <span>{message.tokensUsed} tokens</span>
                                <span>{message.latencyMs}ms</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div className="border-t border-border bg-surface p-4">
            <div className="flex items-end gap-3 max-w-3xl mx-auto">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ecrivez un message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="rounded-xl bg-accent p-3 text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={smoothTransition}
              className="border-l border-border bg-surface-secondary overflow-hidden shrink-0"
            >
              <div className="w-[280px] p-4 space-y-5">
                <h3 className="text-caption font-semibold text-text-primary">Parametres avances</h3>

                <div>
                  <label className="flex justify-between text-small text-text-secondary mb-1.5">
                    <span>Temperature</span>
                    <span className="text-text-primary font-medium">{temperature.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={(event) => setTemperature(Number(event.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-[0.625rem] text-text-muted mt-0.5">
                    <span>Precis</span>
                    <span>Creatif</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-small text-text-secondary mb-1.5">
                    <span>Max tokens</span>
                    <span className="text-text-primary font-medium">{maxTokens}</span>
                  </label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(event) => setMaxTokens(Number(event.target.value))}
                    min={256}
                    max={selectedModel.maxTokens}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-small text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-small text-text-secondary mb-1.5">
                    <span>Top P</span>
                    <span className="text-text-primary font-medium">{topP.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={topP}
                    onChange={(event) => setTopP(Number(event.target.value))}
                    className="w-full accent-accent"
                  />
                </div>

                <div>
                  <label className="block text-small text-text-secondary mb-1.5">
                    System prompt
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(event) => setSystemPrompt(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-small text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted"
                    placeholder="Instructions systeme..."
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
