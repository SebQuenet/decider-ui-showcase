import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Copy, Check, Send, Zap } from 'lucide-react'
import { IconButton } from '../components/ui/IconButton.tsx'
import { Tooltip } from '../components/ui/Tooltip.tsx'
import type { Message } from '../types/chat.ts'

const MOCK_RESPONSES = [
  `## Analyse des performances Q4

Les résultats du quatrième trimestre montrent une **croissance significative** dans plusieurs segments clés :

- **Revenus récurrents** : +18% par rapport au Q3
- **Taux de rétention** : 94.2%, en hausse de 2 points
- **Nouveaux clients** : 342 comptes signés
- **Panier moyen** : 12 400 € (+8%)

> Les indicateurs convergent vers une trajectoire haussière durable.

La progression est particulièrement marquée sur le segment **mid-market**, qui représente désormais 45% du revenu total.`,

  `Voici un exemple de composant React avec TypeScript :

\`\`\`typescript
interface AnalyticsDashboardProps {
  portfolioId: string
  dateRange: [Date, Date]
  benchmark?: string
}

export function AnalyticsDashboard({
  portfolioId,
  dateRange,
  benchmark = 'MSCI World',
}: AnalyticsDashboardProps) {
  const { data, isLoading } = usePortfolioMetrics(portfolioId, dateRange)

  if (isLoading) return <Spinner />

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="Rendement" value={data.returns} />
      <MetricCard label="Volatilité" value={data.volatility} />
      <MetricCard label="Sharpe Ratio" value={data.sharpe} />
      <BenchmarkComparison data={data} benchmark={benchmark} />
    </div>
  )
}
\`\`\`

Ce pattern utilise un hook personnalisé \`usePortfolioMetrics\` pour découpler la logique de récupération des données de l'affichage.`,

  `## Comparaison des modèles d'allocation

| Critère | Équipondéré | Risk Parity | MVO |
|---------|------------|-------------|-----|
| Rendement annuel | 8.2% | 7.8% | 9.1% |
| Volatilité | 12.4% | 9.6% | 14.2% |
| Max Drawdown | -18.3% | -12.1% | -22.7% |
| Sharpe Ratio | 0.66 | 0.81 | 0.64 |
| Turnover | Faible | Moyen | Élevé |

Le modèle **Risk Parity** offre le meilleur ratio rendement/risque avec un Sharpe de **0.81** et un drawdown maîtrisé.`,

  `## Guide d'intégration de l'API Decider

Pour intégrer l'API, suivez ces étapes :

### 1. Configuration initiale

Installez le SDK avec votre gestionnaire de paquets :

\`\`\`typescript
import { DeciderClient } from '@decider/sdk'

const client = new DeciderClient({
  apiKey: process.env.DECIDER_API_KEY,
  environment: 'production',
})
\`\`\`

### 2. Récupérer un portefeuille

\`\`\`typescript
const portfolio = await client.portfolios.get('ptf_abc123')
console.log(portfolio.name)        // "Fonds Diversifié"
console.log(portfolio.totalValue)  // 2_450_000
console.log(portfolio.positions)   // Position[]
\`\`\`

### 3. Lancer une analyse

- Appelez \`client.analysis.run()\` avec les paramètres souhaités
- Le résultat inclut les **métriques de risque**, les **projections** et les **recommandations**
- Les analyses sont **asynchrones** : utilisez le webhook ou le polling

> **Note** : Le rate limit est de 100 requêtes/minute en production.`,
]

let messageIdCounter = 0
function generateId(): string {
  messageIdCounter += 1
  return `stream-${Date.now()}-${messageIdCounter}`
}

function simpleMarkdownToHtml(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Blocs de code (on les marque avant le reste)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_match, lang, code) =>
      `<pre class="code-block" data-lang="${lang || ''}"><code>${code.trim()}</code></pre>`,
  )

  // Tableaux
  html = html.replace(
    /(?:^|\n)(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g,
    (_match, headerRow, _separator, bodyRows) => {
      const headers = headerRow.split('|').filter((cell: string) => cell.trim())
      const rows = bodyRows.trim().split('\n')

      let table = '<table class="md-table"><thead><tr>'
      for (const header of headers) {
        table += `<th>${header.trim()}</th>`
      }
      table += '</tr></thead><tbody>'
      for (const row of rows) {
        const cells = row.split('|').filter((cell: string) => cell.trim())
        table += '<tr>'
        for (const cell of cells) {
          table += `<td>${cell.trim()}</td>`
        }
        table += '</tr>'
      }
      table += '</tbody></table>'
      return table
    },
  )

  // Titres
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')

  // Gras
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // Listes
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)

  // Paragraphes
  html = html
    .split('\n\n')
    .map((block) => {
      if (
        block.startsWith('<h') ||
        block.startsWith('<pre') ||
        block.startsWith('<ul') ||
        block.startsWith('<table') ||
        block.startsWith('<blockquote')
      ) {
        return block
      }
      return block.trim() ? `<p>${block}</p>` : ''
    })
    .join('\n')

  return html
}

interface StreamingState {
  fullText: string
  displayedLength: number
  isComplete: boolean
}

export function ChatStreamingExperiment() {
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingState, setStreamingState] = useState<StreamingState | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [charsPerSecond, setCharsPerSecond] = useState(120)
  const [copiedBlockIndex, setCopiedBlockIndex] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isUserNearBottomRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const responseIndexRef = useRef(0)

  const scrollToBottom = useCallback(() => {
    if (isUserNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  function handleScroll(): void {
    const container = containerRef.current
    if (!container) return
    const threshold = 100
    isUserNearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingState?.displayedLength, scrollToBottom])

  useEffect(() => {
    if (!streamingState || streamingState.isComplete) return

    const msPerChar = 1000 / charsPerSecond

    function tick() {
      setStreamingState((previous) => {
        if (!previous || previous.isComplete) return previous
        const nextLength = Math.min(previous.displayedLength + 1, previous.fullText.length)
        const isComplete = nextLength >= previous.fullText.length

        if (isComplete && streamingMessageId) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === streamingMessageId
                ? { ...message, content: previous.fullText, status: 'complete' as const }
                : message,
            ),
          )
          setStreamingMessageId(null)
        }

        return { ...previous, displayedLength: nextLength, isComplete }
      })
    }

    timerRef.current = setTimeout(tick, msPerChar)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [streamingState, charsPerSecond, streamingMessageId])

  function handleSend(content: string): void {
    if (streamingState && !streamingState.isComplete) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'complete',
    }

    const responseText = MOCK_RESPONSES[responseIndexRef.current % MOCK_RESPONSES.length]
    responseIndexRef.current += 1

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    }

    setMessages((previous) => [...previous, userMessage, assistantMessage])
    setStreamingMessageId(assistantMessage.id)
    setStreamingState({ fullText: responseText, displayedLength: 0, isComplete: false })
  }

  function handleCopyBlock(code: string, blockIndex: number): void {
    navigator.clipboard.writeText(code)
    setCopiedBlockIndex(blockIndex)
    setTimeout(() => setCopiedBlockIndex(null), 2000)
  }

  const displayedText = streamingState ? streamingState.fullText.slice(0, streamingState.displayedLength) : ''
  const isStreaming = streamingState !== null && !streamingState.isComplete

  return (
    <div className="w-full max-w-3xl h-[700px] mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Chat Streaming</h2>
            <p className="text-small text-text-muted">Rendu Markdown progressif</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-small text-text-muted whitespace-nowrap">
            {charsPerSecond} car/s
          </label>
          <input
            type="range"
            min={20}
            max={500}
            value={charsPerSecond}
            onChange={(event) => setCharsPerSecond(Number(event.target.value))}
            className="w-24 accent-accent"
          />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const isCurrentlyStreaming = message.id === streamingMessageId && isStreaming

            const contentToRender = isCurrentlyStreaming ? displayedText : message.content
            const renderedHtml = simpleMarkdownToHtml(contentToRender)

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                      ? 'bg-glacier-600 text-white'
                      : 'bg-surface-tertiary text-text-secondary'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-glacier-600 text-white rounded-br-md'
                      : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                  }`}
                >
                  {isUser ? (
                    <p className="text-body leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <RenderedMarkdown
                      html={renderedHtml}
                      rawContent={contentToRender}
                      copiedBlockIndex={copiedBlockIndex}
                      onCopyBlock={handleCopyBlock}
                    />
                  )}

                  {isCurrentlyStreaming && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="inline-block w-1.5 h-4 bg-accent rounded-sm ml-1 align-text-bottom"
                    />
                  )}

                  <div
                    className={`text-small mt-1.5 ${
                      isUser ? 'text-white/60' : 'text-text-muted'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted gap-2">
            <Zap className="w-10 h-10 opacity-30" />
            <p className="text-body">Envoyez un message pour voir le streaming en action</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatStreamingInput onSend={handleSend} disabled={isStreaming} />
    </div>
  )
}

function RenderedMarkdown({
  html,
  rawContent,
  copiedBlockIndex,
  onCopyBlock,
}: {
  html: string
  rawContent: string
  copiedBlockIndex: number | null
  onCopyBlock: (code: string, index: number) => void
}) {
  // Extraire les blocs de code du contenu brut
  const codeBlocks: string[] = []
  const codeBlockRegex = /```\w*\n([\s\S]*?)```/g
  let match: RegExpExecArray | null = null
  while ((match = codeBlockRegex.exec(rawContent)) !== null) {
    codeBlocks.push(match[1].trim())
  }

  // Découper le HTML autour des blocs <pre>
  const parts = html.split(/(<pre class="code-block"[^>]*>[\s\S]*?<\/pre>)/g)
  let blockIndex = 0

  return (
    <div className="markdown-content text-body leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1 [&_strong]:font-semibold [&_blockquote]:border-l-3 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-text-muted [&_blockquote]:my-2 [&_.inline-code]:bg-surface [&_.inline-code]:px-1.5 [&_.inline-code]:py-0.5 [&_.inline-code]:rounded [&_.inline-code]:text-small [&_.inline-code]:font-mono [&_.md-table]:w-full [&_.md-table]:text-small [&_.md-table]:my-2 [&_.md-table_th]:bg-surface [&_.md-table_th]:px-3 [&_.md-table_th]:py-1.5 [&_.md-table_th]:text-left [&_.md-table_th]:font-semibold [&_.md-table_th]:border-b [&_.md-table_th]:border-border [&_.md-table_td]:px-3 [&_.md-table_td]:py-1.5 [&_.md-table_td]:border-b [&_.md-table_td]:border-border/50">
      {parts.map((part, partIndex) => {
        if (part.startsWith('<pre class="code-block"')) {
          const currentBlockIndex = blockIndex
          const codeContent = codeBlocks[currentBlockIndex] ?? ''
          const langMatch = part.match(/data-lang="(\w*)"/)
          const lang = langMatch?.[1] ?? ''
          blockIndex += 1

          return (
            <div key={partIndex} className="relative my-3 rounded-lg overflow-hidden bg-carbon-900">
              <div className="flex items-center justify-between px-4 py-2 bg-carbon-800 text-carbon-300 text-small">
                <span className="font-mono">{lang || 'code'}</span>
                <Tooltip content={copiedBlockIndex === currentBlockIndex ? 'Copié !' : 'Copier'}>
                  <IconButton
                    icon={copiedBlockIndex === currentBlockIndex ? <Check className="text-green-400" /> : <Copy />}
                    label="Copier le code"
                    size="sm"
                    className="text-carbon-400 hover:text-white hover:bg-carbon-700"
                    onClick={() => onCopyBlock(codeContent, currentBlockIndex)}
                  />
                </Tooltip>
              </div>
              <pre className="px-4 py-3 overflow-x-auto text-small font-mono text-carbon-100 leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          )
        }

        return (
          <span
            key={partIndex}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        )
      })}
    </div>
  )
}

function ChatStreamingInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void
  disabled: boolean
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(): void {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  function handleInput(): void {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-border bg-surface p-4">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Posez une question pour voir le streaming..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-accent p-3 text-text-inverse hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
