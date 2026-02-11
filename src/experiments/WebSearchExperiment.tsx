import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Send, Bot, User, Search, ExternalLink, X,
  BookOpen, Newspaper, BarChart3, Sparkles,
} from 'lucide-react'
import { messageVariants, smoothTransition } from '../lib/animations'

interface Source {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  faviconColor: string
}

interface SearchQuery {
  id: string
  text: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Source[]
  searchQueries?: SearchQuery[]
  isSearching?: boolean
}

type FocusMode = 'general' | 'academic' | 'news' | 'finance'

const FOCUS_MODES: { id: FocusMode; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'academic', label: 'Academique', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'news', label: 'Actualites', icon: <Newspaper className="w-3.5 h-3.5" /> },
  { id: 'finance', label: 'Finance', icon: <BarChart3 className="w-3.5 h-3.5" /> },
]

const MOCK_SOURCES: Source[] = [
  {
    id: '1',
    title: 'Performance des fonds PE en 2024',
    url: 'https://www.financial-times.com/pe-performance-2024',
    domain: 'financial-times.com',
    snippet: 'Les fonds de private equity ont enregistre un rendement moyen de 14.2% en 2024, surpassant les marches publics pour la troisieme annee consecutive. La tendance est portee par les secteurs technologie et sante.',
    faviconColor: '#F5C6AA',
  },
  {
    id: '2',
    title: 'Analyse du marche obligataire',
    url: 'https://www.bloomberg.com/bond-market-analysis',
    domain: 'bloomberg.com',
    snippet: 'Le marche obligataire montre des signes de stabilisation apres les turbulences de 2023. Les spreads de credit se sont resserres de 45 bps en moyenne, refletant un retour de la confiance des investisseurs.',
    faviconColor: '#B8D4E3',
  },
  {
    id: '3',
    title: 'Tendances d\'investissement ESG',
    url: 'https://www.reuters.com/esg-investment-trends',
    domain: 'reuters.com',
    snippet: 'Les flux vers les fonds ESG ont atteint 420 milliards d\'euros en 2024, un record. Les investisseurs institutionnels integrent de plus en plus les criteres ESG dans leurs decisions d\'allocation.',
    faviconColor: '#C5E8D0',
  },
  {
    id: '4',
    title: 'Rapport stabilite financiere',
    url: 'https://www.ecb.europa.eu/financial-stability-report',
    domain: 'ecb.europa.eu',
    snippet: 'La BCE souligne les risques lies a l\'immobilier commercial et aux taux d\'interet eleves. Le systeme bancaire reste resilient avec des ratios de fonds propres CET1 superieurs a 15% en moyenne.',
    faviconColor: '#D4C5F0',
  },
  {
    id: '5',
    title: 'Perspectives macro-economiques 2025',
    url: 'https://www.imf.org/macro-outlook-2025',
    domain: 'imf.org',
    snippet: 'Le FMI prevoit une croissance mondiale de 3.1% en 2025, avec des disparites regionales marquees. La zone euro devrait beneficier d\'une reprise moderee portee par la consommation.',
    faviconColor: '#F0E4B8',
  },
]

const MOCK_SEARCH_QUERIES: string[] = [
  'performance fonds private equity 2024',
  'marche obligataire tendances actuelles',
  'investissement ESG flux capitaux',
  'BCE rapport stabilite financiere',
]

const MOCK_RESPONSE = `D'apres mes recherches, voici une analyse complete du marche :

**Performance des fonds PE** : Les fonds de private equity ont enregistre un rendement moyen de 14.2% en 2024 [1], surpassant significativement les marches publics.

**Marche obligataire** : On observe une stabilisation avec un resserrement des spreads de credit de 45 bps [2], ce qui indique un retour progressif de la confiance.

**Tendances ESG** : Les flux vers les fonds ESG ont atteint un record de 420 milliards d'euros [3], confirmant l'integration croissante des criteres extra-financiers.

**Stabilite financiere** : La BCE maintient une vigilance sur l'immobilier commercial, mais le systeme bancaire reste solide avec des ratios CET1 au-dessus de 15% [4].

**Perspectives** : Le FMI anticipe une croissance mondiale de 3.1% en 2025 [5], avec une reprise moderee en zone euro.`

let messageIdCounter = 0

function CitationBadge({ index, onClick }: { index: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[0.625rem] font-bold hover:bg-accent-hover transition-colors cursor-pointer mx-0.5 align-super"
    >
      {index}
    </button>
  )
}

function SourceCard({ source, onClick }: { source: Source; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-56 p-3 bg-surface border border-border rounded-lg hover:border-accent/40 hover:shadow-md transition-all text-left cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center text-[0.5rem] font-bold text-white"
          style={{ backgroundColor: source.faviconColor }}
        >
          {source.domain[0].toUpperCase()}
        </div>
        <span className="text-[0.625rem] text-text-muted truncate">{source.domain}</span>
      </div>
      <p className="text-small font-medium text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
        {source.title}
      </p>
    </button>
  )
}

export function WebSearchExperiment() {
  const [webSearchEnabled, setWebSearchEnabled] = useState(true)
  const [focusMode, setFocusMode] = useState<FocusMode>('general')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [hoveredCitation, setHoveredCitation] = useState<Source | null>(null)
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return
    setInputValue('')

    const userMessage: ChatMessage = {
      id: String(++messageIdCounter),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages((previous) => [...previous, userMessage])

    if (!webSearchEnabled) {
      setIsTyping(true)
      setTimeout(() => {
        const response: ChatMessage = {
          id: String(++messageIdCounter),
          role: 'assistant',
          content: 'Voici ma reponse sans recherche web. Pour obtenir des informations a jour, activez la recherche web.',
          timestamp: new Date(),
        }
        setMessages((previous) => [...previous, response])
        setIsTyping(false)
      }, 1000)
      return
    }

    const searchingMessage: ChatMessage = {
      id: String(++messageIdCounter),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isSearching: true,
      searchQueries: [],
      sources: [],
    }
    setMessages((previous) => [...previous, searchingMessage])
    setIsTyping(true)

    MOCK_SEARCH_QUERIES.forEach((query, index) => {
      setTimeout(() => {
        setMessages((previous) => {
          const updated = [...previous]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage.isSearching) {
            lastMessage.searchQueries = [
              ...(lastMessage.searchQueries ?? []),
              { id: String(index), text: query },
            ]
          }
          return [...updated]
        })
      }, 500 + index * 600)
    })

    setTimeout(() => {
      setMessages((previous) => {
        const updated = [...previous]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.isSearching) {
          lastMessage.sources = MOCK_SOURCES
        }
        return [...updated]
      })
    }, 3200)

    setTimeout(() => {
      setMessages((previous) => {
        const filtered = previous.filter((m) => !m.isSearching)
        const response: ChatMessage = {
          id: String(++messageIdCounter),
          role: 'assistant',
          content: MOCK_RESPONSE,
          timestamp: new Date(),
          sources: MOCK_SOURCES,
        }
        return [...filtered, response]
      })
      setIsTyping(false)
    }, 4500)
  }, [inputValue, isTyping, webSearchEnabled])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleCitationHover = (source: Source, event: React.MouseEvent) => {
    setHoveredCitation(source)
    setHoveredPosition({ x: event.clientX, y: event.clientY })
  }

  function renderContentWithCitations(content: string, sources: Source[]): React.ReactNode {
    const parts = content.split(/(\[\d+\])/)
    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/)
      if (match) {
        const sourceIndex = parseInt(match[1], 10)
        const source = sources[sourceIndex - 1]
        if (!source) return part
        return (
          <span
            key={index}
            onMouseEnter={(event) => handleCitationHover(source, event)}
            onMouseLeave={() => { setHoveredCitation(null); setHoveredPosition(null) }}
          >
            <CitationBadge
              index={sourceIndex}
              onClick={() => setSelectedSource(source)}
            />
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="w-full h-full max-w-6xl mx-auto flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                webSearchEnabled
                  ? 'bg-accent-muted text-accent border-accent/30'
                  : 'bg-surface text-text-muted border-border'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-small font-medium">Recherche Web</span>
            </button>

            <div className="h-5 w-px bg-border" />

            <div className="flex gap-1">
              {FOCUS_MODES.map((fm) => (
                <button
                  key={fm.id}
                  onClick={() => setFocusMode(fm.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-small font-medium transition-colors cursor-pointer ${
                    focusMode === fm.id
                      ? 'bg-glacier-100 text-glacier-700'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  {fm.icon}
                  {fm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Globe className="w-12 h-12 text-accent/30 mb-4" />
              <p className="text-text-muted text-body">Posez une question pour lancer une recherche web.</p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => {
              if (message.isSearching) {
                return (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-small text-accent">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        >
                          <Search className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium">Recherche en cours...</span>
                      </div>

                      <AnimatePresence>
                        {(message.searchQueries ?? []).map((query) => (
                          <motion.div
                            key={query.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-small text-text-secondary"
                          >
                            <Search className="w-3 h-3 text-text-muted" />
                            <span className="italic">"{query.text}"</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {(message.sources ?? []).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
                        >
                          {message.sources!.map((source) => (
                            <SourceCard
                              key={source.id}
                              source={source}
                              onClick={() => setSelectedSource(source)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              }

              return (
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
                  <div className="max-w-[80%]">
                    {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 -mx-1 px-1">
                        {message.sources.map((source) => (
                          <SourceCard
                            key={source.id}
                            source={source}
                            onClick={() => setSelectedSource(source)}
                          />
                        ))}
                      </div>
                    )}

                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-glacier-600 text-white rounded-br-md'
                        : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                    }`}>
                      <div className="text-body leading-relaxed whitespace-pre-wrap">
                        {message.role === 'assistant' && message.sources
                          ? renderContentWithCitations(message.content, message.sources)
                          : message.content
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {isTyping && messages[messages.length - 1]?.isSearching !== true && (
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

        <div className="border-t border-border bg-surface p-4">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={webSearchEnabled ? 'Rechercher sur le web...' : 'Ecrivez un message...'}
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
        {selectedSource && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={smoothTransition}
            className="border-l border-border bg-surface-secondary overflow-hidden shrink-0"
          >
            <div className="w-[360px] flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-caption font-semibold text-text-primary">Source</h3>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="p-1 rounded-md hover:bg-surface-tertiary transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: selectedSource.faviconColor }}
                  >
                    {selectedSource.domain[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-small text-text-muted">{selectedSource.domain}</p>
                  </div>
                </div>

                <h4 className="text-body font-semibold text-text-primary">{selectedSource.title}</h4>

                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-small text-accent hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {selectedSource.url}
                </a>

                <div className="bg-surface rounded-lg border border-border p-3">
                  <p className="text-small text-text-secondary leading-relaxed">
                    {selectedSource.snippet}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <h5 className="text-small font-medium text-text-secondary mb-3">Autres sources</h5>
                  <div className="space-y-2">
                    {MOCK_SOURCES.filter((s) => s.id !== selectedSource.id).map((source) => (
                      <button
                        key={source.id}
                        onClick={() => setSelectedSource(source)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-left cursor-pointer"
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[0.5rem] font-bold text-white shrink-0"
                          style={{ backgroundColor: source.faviconColor }}
                        >
                          {source.domain[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-small font-medium text-text-primary truncate">{source.title}</p>
                          <p className="text-[0.625rem] text-text-muted">{source.domain}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredCitation && hoveredPosition && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            style={{
              position: 'fixed',
              left: Math.min(hoveredPosition.x - 120, window.innerWidth - 280),
              top: hoveredPosition.y - 120,
              zIndex: 100,
            }}
            className="w-64 p-3 bg-surface border border-border rounded-lg shadow-xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center text-[0.45rem] font-bold text-white"
                style={{ backgroundColor: hoveredCitation.faviconColor }}
              >
                {hoveredCitation.domain[0].toUpperCase()}
              </div>
              <span className="text-[0.625rem] text-text-muted">{hoveredCitation.domain}</span>
            </div>
            <p className="text-small font-medium text-text-primary mb-1">{hoveredCitation.title}</p>
            <p className="text-[0.625rem] text-text-secondary line-clamp-2">{hoveredCitation.snippet}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
