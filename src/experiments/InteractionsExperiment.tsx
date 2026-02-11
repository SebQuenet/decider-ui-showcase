import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Square,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Brain,
  Search,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react'
import { IconButton } from '../components/ui/IconButton.tsx'
import { Chip } from '../components/ui/Chip.tsx'
import { Toggle } from '../components/ui/Toggle.tsx'
import { Modal } from '../components/ui/Modal.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { ProgressBar } from '../components/ui/ProgressBar.tsx'
import { Tooltip } from '../components/ui/Tooltip.tsx'
import type { Message, ThinkingBlock } from '../types/chat.ts'

// --- Données mockées ---

const THINKING_CONTENT = `Je dois analyser cette question sous plusieurs angles.

Premièrement, considérons les données historiques de performance du portefeuille sur les 12 derniers mois.

Deuxièmement, l'environnement macroéconomique actuel suggère une rotation sectorielle vers les valeurs défensives.

Troisièmement, les corrélations entre les classes d'actifs ont évolué significativement depuis le dernier rééquilibrage.

Conclusion : une réallocation progressive serait préférable à un rééquilibrage brutal.`

const ALTERNATIVE_RESPONSES = [
  "L'analyse du portefeuille montre une exposition excessive au secteur technologique (38%). Je recommande de **réduire cette position à 25%** et de réallouer vers les obligations investment grade et les matières premières pour améliorer la diversification.\n\nPoints clés :\n- Ratio de Sharpe actuel : 0.72\n- Ratio de Sharpe estimé après rééquilibrage : 0.89\n- Réduction estimée du drawdown max : -5.2 points",
  "Après analyse approfondie, votre portefeuille présente un profil **rendement/risque sous-optimal**. Voici ma recommandation détaillée :\n\n1. **Réduire** les positions sur les small caps US (-10%)\n2. **Augmenter** l'exposition aux marchés émergents (+5%)\n3. **Ajouter** une couverture en options sur le S&P 500\n4. **Maintenir** les positions obligataires actuelles\n\nCette réallocation devrait améliorer le Sharpe de 0.15 points.",
  "Je suggère une approche en **deux phases** :\n\n**Phase 1 (immédiate)** : Prendre des profits partiels sur les positions en gain de +30% et plus. Cela concerne 4 lignes du portefeuille pour un total de 180K€.\n\n**Phase 2 (sur 3 mois)** : Déployer progressivement les liquidités vers un panier diversifié de 8 ETF sectoriels, en utilisant une stratégie DCA mensuelle.\n\n> Le timing d'exécution est crucial : évitez les jours de publication des résultats.",
]

const DEEP_RESEARCH_STEPS = [
  { label: 'Recherche', description: 'Collecte de données marché...' },
  { label: 'Analyse', description: 'Traitement des signaux...' },
  { label: 'Génération', description: 'Rédaction de la synthèse...' },
]

let messageIdCounter = 0
function generateId(): string {
  messageIdCounter += 1
  return `int-${Date.now()}-${messageIdCounter}`
}

function createInitialMessages(reasoningMode: boolean): Message[] {
  const thinking: ThinkingBlock[] | undefined = reasoningMode
    ? [{
        id: 'think-1',
        content: THINKING_CONTENT,
        durationMs: 3200,
        isCollapsed: true,
      }]
    : undefined

  return [
    {
      id: generateId(),
      role: 'user',
      content: 'Peux-tu analyser mon portefeuille et me donner des recommandations de rééquilibrage ?',
      timestamp: new Date(Date.now() - 120000),
      status: 'complete',
    },
    {
      id: generateId(),
      role: 'assistant',
      content: ALTERNATIVE_RESPONSES[0],
      timestamp: new Date(Date.now() - 115000),
      status: 'complete',
      thinking,
      branches: [
        { id: 'branch-0', messages: [], createdAt: new Date(Date.now() - 115000) },
      ],
      currentBranchIndex: 0,
      feedback: null,
      suggestions: [
        { id: 'sug-1', label: 'Explique en détail', prompt: 'Peux-tu détailler chaque recommandation ?' },
        { id: 'sug-2', label: 'Donne un exemple', prompt: 'Montre-moi un exemple concret de rééquilibrage' },
        { id: 'sug-3', label: 'Résume', prompt: 'Résume les points principaux en 3 lignes' },
        { id: 'sug-4', label: 'Risques ?', prompt: 'Quels sont les risques de cette stratégie ?' },
      ],
    },
    {
      id: generateId(),
      role: 'user',
      content: 'Quels sont les risques principaux de cette réallocation ?',
      timestamp: new Date(Date.now() - 60000),
      status: 'complete',
    },
    {
      id: generateId(),
      role: 'assistant',
      content: "Les risques principaux sont :\n\n1. **Risque de timing** : La réallocation progressive étale le risque mais peut manquer des points d'entrée optimaux\n2. **Risque de change** : L'exposition aux émergents introduit une volatilité FX de ±8%\n3. **Risque de liquidité** : Certains ETF sectoriels ont des spreads élevés en période de stress\n4. **Risque de corrélation** : En cas de crise, les corrélations augmentent et la diversification perd de son efficacité\n\nJe recommande de mettre en place des **stop-loss dynamiques** à -12% par position.",
      timestamp: new Date(Date.now() - 55000),
      status: 'complete',
      feedback: null,
    },
  ]
}

export function InteractionsExperiment() {
  const [reasoningMode, setReasoningMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => createInitialMessages(false))
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [feedbackModalMessageId, setFeedbackModalMessageId] = useState<string | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [deepResearchActive, setDeepResearchActive] = useState(false)
  const [deepResearchStep, setDeepResearchStep] = useState(0)
  const [streamingText, setStreamingText] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(createInitialMessages(reasoningMode))
  }, [reasoningMode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const cancelGeneration = useCallback((): void => {
    if (generationTimerRef.current) clearTimeout(generationTimerRef.current)
    setIsGenerating(false)
    if (streamingMessageId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingMessageId
            ? { ...m, content: streamingText || m.content, status: 'complete' as const }
            : m,
        ),
      )
      setStreamingMessageId(null)
      setStreamingText('')
    }
  }, [streamingMessageId, streamingText])

  function simulateStreaming(text: string, messageId: string): void {
    setStreamingMessageId(messageId)
    setStreamingText('')
    setIsGenerating(true)

    let charIndex = 0
    function tick() {
      if (charIndex >= text.length) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, content: text, status: 'complete' as const }
              : m,
          ),
        )
        setStreamingMessageId(null)
        setStreamingText('')
        setIsGenerating(false)
        return
      }
      charIndex += 2
      const displayed = text.slice(0, charIndex)
      setStreamingText(displayed)
      generationTimerRef.current = setTimeout(tick, 15)
    }
    generationTimerRef.current = setTimeout(tick, 15)
  }

  function handleRegenerate(messageId: string): void {
    if (isGenerating) return

    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message

        const currentBranches = message.branches ?? [
          { id: 'branch-0', messages: [], createdAt: message.timestamp },
        ]

        const newBranch = {
          id: `branch-${currentBranches.length}`,
          messages: [],
          createdAt: new Date(),
        }

        return {
          ...message,
          content: '',
          status: 'streaming' as const,
          branches: [...currentBranches, newBranch],
          currentBranchIndex: currentBranches.length,
        }
      }),
    )

    const message = messages.find((m) => m.id === messageId)
    const branchCount = (message?.branches?.length ?? 1)
    const responseIndex = branchCount % ALTERNATIVE_RESPONSES.length
    simulateStreaming(ALTERNATIVE_RESPONSES[responseIndex], messageId)
  }

  function handleNavigateBranch(messageId: string, direction: 'prev' | 'next'): void {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message
        const branches = message.branches ?? []
        const currentIndex = message.currentBranchIndex ?? 0
        const newIndex = direction === 'prev'
          ? Math.max(0, currentIndex - 1)
          : Math.min(branches.length - 1, currentIndex + 1)

        const responseIndex = newIndex % ALTERNATIVE_RESPONSES.length

        return {
          ...message,
          currentBranchIndex: newIndex,
          content: ALTERNATIVE_RESPONSES[responseIndex],
        }
      }),
    )
  }

  function handleStartEdit(message: Message): void {
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }

  function handleSubmitEdit(messageId: string): void {
    if (!editContent.trim()) return

    setMessages((prev) => {
      const messageIndex = prev.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) return prev

      const updatedMessage = {
        ...prev[messageIndex],
        content: editContent.trim(),
        isEdited: true,
      }

      const newAssistant: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        status: 'streaming',
        feedback: null,
      }

      const newMessages = [...prev.slice(0, messageIndex), updatedMessage, newAssistant]
      simulateStreaming(
        ALTERNATIVE_RESPONSES[Math.floor(Math.random() * ALTERNATIVE_RESPONSES.length)],
        newAssistant.id,
      )
      return newMessages
    })

    setEditingMessageId(null)
    setEditContent('')
  }

  function handleCopy(content: string, messageId: string): void {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  function handleFeedback(messageId: string, type: 'positive' | 'negative'): void {
    if (type === 'negative') {
      setFeedbackModalMessageId(messageId)
      return
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, feedback: m.feedback === type ? null : type }
          : m,
      ),
    )
  }

  function handleSubmitNegativeFeedback(): void {
    if (feedbackModalMessageId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === feedbackModalMessageId ? { ...m, feedback: 'negative' as const } : m,
        ),
      )
    }
    setFeedbackModalMessageId(null)
    setFeedbackComment('')
  }

  function handleSuggestionClick(prompt: string): void {
    if (isGenerating) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      status: 'complete',
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
      feedback: null,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    simulateStreaming(
      ALTERNATIVE_RESPONSES[Math.floor(Math.random() * ALTERNATIVE_RESPONSES.length)],
      assistantMessage.id,
    )
  }

  function handleDeepResearch(): void {
    setDeepResearchActive(true)
    setDeepResearchStep(0)

    let step = 0
    function advanceStep() {
      step += 1
      if (step >= DEEP_RESEARCH_STEPS.length) {
        setDeepResearchActive(false)

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          status: 'streaming',
          feedback: null,
        }
        setMessages((prev) => [...prev, assistantMessage])
        simulateStreaming(
          "## Résultat de la recherche approfondie\n\nAprès analyse de 47 sources et 3 bases de données financières, voici les conclusions :\n\n- Le **consensus analystes** est à l'achat sur 68% des positions du portefeuille\n- Les **indicateurs techniques** signalent un support à -4% des niveaux actuels\n- Le **sentiment de marché** est neutre à légèrement positif\n\nRecommandation : **maintenir les positions** avec un renforcement opportuniste sur repli de 5%.",
          assistantMessage.id,
        )
        return
      }
      setDeepResearchStep(step)
      setTimeout(advanceStep, 1500)
    }
    setTimeout(advanceStep, 1500)
  }

  function handleSend(content: string): void {
    if (isGenerating) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'complete',
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
      feedback: null,
      thinking: reasoningMode
        ? [{ id: generateId(), content: THINKING_CONTENT, durationMs: 2800, isCollapsed: true }]
        : undefined,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    simulateStreaming(
      ALTERNATIVE_RESPONSES[Math.floor(Math.random() * ALTERNATIVE_RESPONSES.length)],
      assistantMessage.id,
    )
  }

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')

  return (
    <div className="w-full max-w-3xl h-[700px] mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-glacier-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Interactions</h2>
            <p className="text-small text-text-muted">Actions, branches, feedback</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip content="Recherche approfondie multi-sources">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeepResearch}
              disabled={isGenerating || deepResearchActive}
            >
              <Search className="w-3.5 h-3.5" />
              Recherche
            </Button>
          </Tooltip>
          <Toggle
            checked={reasoningMode}
            onChange={setReasoningMode}
            label="Raisonnement"
          />
        </div>
      </div>

      {/* Deep Research Stepper */}
      <AnimatePresence>
        {deepResearchActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 bg-surface-tertiary/50">
              <div className="flex items-center gap-6">
                {DEEP_RESEARCH_STEPS.map((step, index) => {
                  const isActive = index === deepResearchStep
                  const isDone = index < deepResearchStep
                  return (
                    <div key={step.label} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-small font-semibold transition-colors ${
                          isDone
                            ? 'bg-green-500 text-white'
                            : isActive
                              ? 'bg-accent text-white'
                              : 'bg-surface-tertiary text-text-muted'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <div>
                        <p className={`text-small font-medium ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <p className="text-small text-text-muted">{step.description}</p>
                        )}
                      </div>
                      {index < DEEP_RESEARCH_STEPS.length - 1 && (
                        <div className="w-8 h-px bg-border ml-2" />
                      )}
                    </div>
                  )
                })}
              </div>
              <ProgressBar
                value={((deepResearchStep + 1) / DEEP_RESEARCH_STEPS.length) * 100}
                className="mt-3"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const isLastAssistant = message.id === lastAssistantMessage?.id
            const isEditing = editingMessageId === message.id
            const isCurrentlyStreaming = message.id === streamingMessageId

            const displayContent = isCurrentlyStreaming
              ? streamingText
              : message.content

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isUser
                        ? 'bg-glacier-600 text-white'
                        : 'bg-surface-tertiary text-text-secondary'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
                    {/* Thinking block */}
                    {!isUser && message.thinking?.map((block) => (
                      <ThinkingBlockView key={block.id} block={block} />
                    ))}

                    {/* Message content */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(event) => setEditContent(event.target.value)}
                          className="w-full rounded-xl border border-accent bg-surface px-4 py-3 text-body text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => setEditingMessageId(null)}>
                            Annuler
                          </Button>
                          <Button size="sm" onClick={() => handleSubmitEdit(message.id)}>
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isUser
                            ? 'bg-glacier-600 text-white rounded-br-md'
                            : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                        }`}
                      >
                        <p className="text-body leading-relaxed whitespace-pre-wrap">
                          {displayContent}
                          {isCurrentlyStreaming && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                              className="inline-block w-1.5 h-4 bg-accent rounded-sm ml-1 align-text-bottom"
                            />
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-small ${isUser ? 'text-white/60' : 'text-text-muted'}`}>
                            {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.isEdited && (
                            <Badge size="sm" variant="default">modifié</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Branch navigation */}
                    {!isUser && message.branches && message.branches.length > 1 && !isEditing && (
                      <div className="flex items-center gap-2 mt-2">
                        <IconButton
                          icon={<ChevronLeft />}
                          label="Version précédente"
                          size="sm"
                          disabled={(message.currentBranchIndex ?? 0) === 0}
                          onClick={() => handleNavigateBranch(message.id, 'prev')}
                        />
                        <span className="text-small text-text-muted font-medium tabular-nums">
                          {(message.currentBranchIndex ?? 0) + 1}/{message.branches.length}
                        </span>
                        <IconButton
                          icon={<ChevronRight />}
                          label="Version suivante"
                          size="sm"
                          disabled={(message.currentBranchIndex ?? 0) >= message.branches.length - 1}
                          onClick={() => handleNavigateBranch(message.id, 'next')}
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    {!isEditing && !isCurrentlyStreaming && message.status === 'complete' && (
                      <div className={`flex items-center gap-1 mt-2 ${isUser ? 'justify-end' : ''}`}>
                        <Tooltip content={copiedMessageId === message.id ? 'Copié !' : 'Copier'}>
                          <IconButton
                            icon={copiedMessageId === message.id ? <Check className="text-green-500" /> : <Copy />}
                            label="Copier"
                            size="sm"
                            onClick={() => handleCopy(message.content, message.id)}
                          />
                        </Tooltip>
                        {isUser && (
                          <Tooltip content="Modifier">
                            <IconButton
                              icon={<Pencil />}
                              label="Modifier"
                              size="sm"
                              onClick={() => handleStartEdit(message)}
                            />
                          </Tooltip>
                        )}
                        {!isUser && (
                          <>
                            <Tooltip content="Régénérer">
                              <IconButton
                                icon={<RefreshCw />}
                                label="Régénérer"
                                size="sm"
                                onClick={() => handleRegenerate(message.id)}
                              />
                            </Tooltip>
                            <Tooltip content="Utile">
                              <IconButton
                                icon={<ThumbsUp />}
                                label="Utile"
                                size="sm"
                                className={message.feedback === 'positive' ? 'text-green-500' : ''}
                                onClick={() => handleFeedback(message.id, 'positive')}
                              />
                            </Tooltip>
                            <Tooltip content="Pas utile">
                              <IconButton
                                icon={<ThumbsDown />}
                                label="Pas utile"
                                size="sm"
                                className={message.feedback === 'negative' ? 'text-red-500' : ''}
                                onClick={() => handleFeedback(message.id, 'negative')}
                              />
                            </Tooltip>
                          </>
                        )}
                      </div>
                    )}

                    {/* Suggestion chips */}
                    {isLastAssistant && message.suggestions && !isCurrentlyStreaming && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {message.suggestions.map((suggestion) => (
                          <Chip
                            key={suggestion.id}
                            label={suggestion.label}
                            variant="active"
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <InteractionsInput
        onSend={handleSend}
        isGenerating={isGenerating}
        onStop={cancelGeneration}
      />

      {/* Feedback modal */}
      <Modal
        open={feedbackModalMessageId !== null}
        onClose={() => {
          setFeedbackModalMessageId(null)
          setFeedbackComment('')
        }}
        title="Qu'est-ce qui n'allait pas ?"
      >
        <div className="space-y-4">
          <textarea
            value={feedbackComment}
            onChange={(event) => setFeedbackComment(event.target.value)}
            placeholder="Décrivez le problème (optionnel)..."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setFeedbackModalMessageId(null)
                setFeedbackComment('')
              }}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleSubmitNegativeFeedback}>
              Envoyer le feedback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ThinkingBlockView({
  block,
}: {
  block: ThinkingBlock
}) {
  const [isCollapsed, setIsCollapsed] = useState(block.isCollapsed)

  function toggleCollapse(): void {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <button
        onClick={toggleCollapse}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-left cursor-pointer hover:bg-amber-100/50 transition-colors"
      >
        <Brain className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-small font-medium text-amber-800">Raisonnement</span>
        <span className="text-small text-amber-600 flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          {(block.durationMs / 1000).toFixed(1)}s
        </span>
        <ChevronDown
          className={`w-4 h-4 text-amber-600 transition-transform ${!isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 border-t border-amber-200">
              <p className="text-small text-amber-900 leading-relaxed whitespace-pre-wrap pt-2">
                {block.content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InteractionsInput({
  onSend,
  isGenerating,
  onStop,
}: {
  onSend: (content: string) => void
  isGenerating: boolean
  onStop: () => void
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(): void {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
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
          placeholder="Posez une question..."
          disabled={isGenerating}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted"
        />
        {isGenerating ? (
          <Tooltip content="Arrêter la génération">
            <button
              onClick={onStop}
              className="rounded-xl bg-red-500 p-3 text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="rounded-xl bg-accent p-3 text-text-inverse hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
