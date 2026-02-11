import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Paperclip,
  Globe,
  Brain,
  Mic,
  Send,
  X,
  FileText,
  Image,
  FileSpreadsheet,
  Upload,
  User,
  Bot,
} from 'lucide-react'
import { IconButton } from '../components/ui/IconButton.tsx'
import { Tooltip } from '../components/ui/Tooltip.tsx'

interface MockFile {
  id: string
  name: string
  type: string
  size: string
}

interface SentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  files?: MockFile[]
  timestamp: Date
}

interface MentionOption {
  id: string
  label: string
  description: string
}

interface SlashCommand {
  id: string
  command: string
  description: string
}

const MENTION_OPTIONS: MentionOption[] = [
  { id: 'decider-pro', label: '@Decider Pro', description: 'Modèle principal' },
  { id: 'analyste', label: '@Analyste', description: 'Spécialiste analyse financière' },
  { id: 'equipe', label: '@Équipe', description: 'Discussion collaborative' },
  { id: 'compliance', label: '@Compliance', description: 'Vérification conformité' },
]

const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'resume', command: '/résumé', description: 'Résumer un document ou une conversation' },
  { id: 'traduction', command: '/traduction', description: 'Traduire le texte sélectionné' },
  { id: 'analyse', command: '/analyse', description: 'Analyse approfondie de données' },
  { id: 'graphique', command: '/graphique', description: 'Générer un graphique à partir de données' },
]

const MOCK_FILES: MockFile[] = [
  { id: 'f1', name: 'rapport-q4-2024.pdf', type: 'pdf', size: '2.4 MB' },
  { id: 'f2', name: 'portefeuille-export.csv', type: 'csv', size: '156 KB' },
  { id: 'f3', name: 'analyse-risques.png', type: 'image', size: '890 KB' },
]

const PLACEHOLDERS = [
  'Posez une question...',
  'Analysez un document...',
  'Comparez des fonds...',
  'Générez un rapport...',
  'Recherchez des données marché...',
]

const MOCK_ASSISTANT_RESPONSES = [
  "J'ai bien reçu votre message. Voici une analyse préliminaire basée sur les éléments fournis. Les indicateurs principaux sont positifs avec un rendement annualisé de 8.4%.",
  "Après examen des données, je recommande une approche en deux phases : d'abord consolider les positions existantes, puis diversifier progressivement vers les marchés émergents.",
  "Les fichiers ont été analysés avec succès. Le rapport montre une corrélation de 0.87 entre les facteurs de risque identifiés et la volatilité observée sur les 6 derniers mois.",
]

let idCounter = 0
function generateId(): string {
  idCounter += 1
  return `comp-${Date.now()}-${idCounter}`
}

function getFileIcon(type: string): React.ReactNode {
  switch (type) {
    case 'pdf': return <FileText className="w-3.5 h-3.5" />
    case 'csv': return <FileSpreadsheet className="w-3.5 h-3.5" />
    case 'image': return <Image className="w-3.5 h-3.5" />
    default: return <FileText className="w-3.5 h-3.5" />
  }
}

export function CompositionExperiment() {
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<MockFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')
  const [slashFilter, setSlashFilter] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [webSearchActive, setWebSearchActive] = useState(false)
  const [thinkingActive, setThinkingActive] = useState(false)
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Rotation du placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sentMessages])

  const adjustTextareaHeight = useCallback((): void => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue, adjustTextareaHeight])

  const filteredMentions = MENTION_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(mentionFilter.toLowerCase()),
  )

  const filteredCommands = SLASH_COMMANDS.filter((command) =>
    command.command.toLowerCase().includes(slashFilter.toLowerCase()),
  )

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value
    setInputValue(value)

    // Détection @ pour mentions
    const lastAtIndex = value.lastIndexOf('@')
    if (lastAtIndex !== -1 && (lastAtIndex === 0 || value[lastAtIndex - 1] === ' ')) {
      const afterAt = value.slice(lastAtIndex + 1)
      if (!afterAt.includes(' ')) {
        setShowMentions(true)
        setMentionFilter(afterAt)
        setSelectedDropdownIndex(0)
        setShowSlashCommands(false)
        return
      }
    }
    setShowMentions(false)

    // Détection / pour slash commands
    const lastSlashIndex = value.lastIndexOf('/')
    if (lastSlashIndex !== -1 && (lastSlashIndex === 0 || value[lastSlashIndex - 1] === ' ')) {
      const afterSlash = value.slice(lastSlashIndex + 1)
      if (!afterSlash.includes(' ')) {
        setShowSlashCommands(true)
        setSlashFilter(afterSlash)
        setSelectedDropdownIndex(0)
        setShowMentions(false)
        return
      }
    }
    setShowSlashCommands(false)
  }

  function handleSelectMention(option: MentionOption): void {
    const lastAtIndex = inputValue.lastIndexOf('@')
    const newValue = inputValue.slice(0, lastAtIndex) + option.label + ' '
    setInputValue(newValue)
    setShowMentions(false)
    textareaRef.current?.focus()
  }

  function handleSelectSlashCommand(command: SlashCommand): void {
    const lastSlashIndex = inputValue.lastIndexOf('/')
    const newValue = inputValue.slice(0, lastSlashIndex) + command.command + ' '
    setInputValue(newValue)
    setShowSlashCommands(false)
    textareaRef.current?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent): void {
    if (showMentions || showSlashCommands) {
      const items = showMentions ? filteredMentions : filteredCommands
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedDropdownIndex((prev) => Math.min(prev + 1, items.length - 1))
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedDropdownIndex((prev) => Math.max(prev - 1, 0))
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        if (showMentions && filteredMentions[selectedDropdownIndex]) {
          handleSelectMention(filteredMentions[selectedDropdownIndex])
        } else if (showSlashCommands && filteredCommands[selectedDropdownIndex]) {
          handleSelectSlashCommand(filteredCommands[selectedDropdownIndex])
        }
        return
      }
      if (event.key === 'Escape') {
        setShowMentions(false)
        setShowSlashCommands(false)
        return
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  function handleSend(): void {
    const trimmed = inputValue.trim()
    if (!trimmed && attachedFiles.length === 0) return

    const userMessage: SentMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      timestamp: new Date(),
    }

    setSentMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setAttachedFiles([])
    setShowMentions(false)
    setShowSlashCommands(false)

    // Réponse simulée
    setTimeout(() => {
      const assistantMessage: SentMessage = {
        id: generateId(),
        role: 'assistant',
        content: MOCK_ASSISTANT_RESPONSES[Math.floor(Math.random() * MOCK_ASSISTANT_RESPONSES.length)],
        timestamp: new Date(),
      }
      setSentMessages((prev) => [...prev, assistantMessage])
    }, 800 + Math.random() * 1000)
  }

  function handleFileUpload(): void {
    // Simulation : ajout d'un fichier mock aléatoire
    const availableFiles = MOCK_FILES.filter(
      (f) => !attachedFiles.some((af) => af.id === f.id),
    )
    if (availableFiles.length === 0) return
    const randomFile = availableFiles[Math.floor(Math.random() * availableFiles.length)]
    setAttachedFiles((prev) => [...prev, { ...randomFile, id: generateId() }])
  }

  function handleRemoveFile(fileId: string): void {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  function handleDragOver(event: React.DragEvent): void {
    event.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(event: React.DragEvent): void {
    event.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(event: React.DragEvent): void {
    event.preventDefault()
    setIsDragOver(false)
    // Simulation : on ajoute un fichier mock
    handleFileUpload()
  }

  function toggleRecording(): void {
    setIsRecording((prev) => !prev)
    if (isRecording) {
      // Simulation de fin d'enregistrement : ajouter du texte transcrit
      setInputValue((prev) => prev + 'Quel est le rendement du portefeuille sur le dernier trimestre ?')
    }
  }

  const tokenEstimate = Math.ceil(inputValue.split(/\s+/).filter(Boolean).length * 1.3)

  return (
    <div className="w-full max-w-3xl h-[700px] mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-glacier-500 to-glacier-700 flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-body font-semibold text-text-primary">Composition</h2>
          <p className="text-small text-text-muted">Saisie enrichie, fichiers, mentions</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {webSearchActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-small"
            >
              <Globe className="w-3 h-3" />
              Web
            </motion.span>
          )}
          {thinkingActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-small"
            >
              <Brain className="w-3 h-3" />
              Réflexion
            </motion.span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {sentMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted gap-3">
            <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center">
              <Send className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-body">Essayez la saisie enrichie ci-dessous</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              <span className="text-small bg-surface-tertiary px-2 py-1 rounded">@ pour mentionner</span>
              <span className="text-small bg-surface-tertiary px-2 py-1 rounded">/ pour les commandes</span>
              <span className="text-small bg-surface-tertiary px-2 py-1 rounded">Glissez des fichiers</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {sentMessages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
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
                  {message.files && message.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.files.map((file) => (
                        <span
                          key={file.id}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-small ${
                            isUser ? 'bg-white/20' : 'bg-surface'
                          }`}
                        >
                          {getFileIcon(file.type)}
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-body leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-small mt-1.5 ${isUser ? 'text-white/60' : 'text-text-muted'}`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div
        className="border-t border-border bg-surface"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-accent/5 border-2 border-dashed border-accent rounded-2xl"
            >
              <div className="flex flex-col items-center gap-2 text-accent">
                <Upload className="w-8 h-8" />
                <p className="text-body font-medium">Déposez vos fichiers ici</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fichiers attachés */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 px-4 pt-3">
                {attachedFiles.map((file) => (
                  <motion.span
                    key={file.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-tertiary border border-border text-small"
                  >
                    {getFileIcon(file.type)}
                    <span className="text-text-primary">{file.name}</span>
                    <span className="text-text-muted">{file.size}</span>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="rounded-full p-0.5 hover:bg-surface-secondary transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3 text-text-muted" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 pt-3">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-red-500"
                />
                <span className="text-small text-red-600 font-medium">Écoute...</span>
                <div className="flex-1 flex gap-0.5 items-center">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{ height: [4, 12 + Math.random() * 12, 4] }}
                      transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: index * 0.05 }}
                      className="w-1 bg-red-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea + actions */}
        <div className="relative p-4">
          {/* Dropdowns */}
          <AnimatePresence>
            {showMentions && filteredMentions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full left-4 right-4 mb-2 rounded-lg border border-border bg-surface shadow-lg py-1 z-20"
              >
                {filteredMentions.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectMention(option)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left cursor-pointer transition-colors ${
                      index === selectedDropdownIndex
                        ? 'bg-accent-muted text-accent-strong'
                        : 'text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center text-small font-semibold text-text-secondary">
                      {option.label[1]}
                    </div>
                    <div>
                      <p className="text-caption font-medium">{option.label}</p>
                      <p className="text-small text-text-muted">{option.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {showSlashCommands && filteredCommands.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full left-4 right-4 mb-2 rounded-lg border border-border bg-surface shadow-lg py-1 z-20"
              >
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => handleSelectSlashCommand(command)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left cursor-pointer transition-colors ${
                      index === selectedDropdownIndex
                        ? 'bg-accent-muted text-accent-strong'
                        : 'text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    <span className="text-caption font-mono text-accent">{command.command}</span>
                    <span className="text-small text-text-muted">{command.description}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDERS[placeholderIndex]}
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 pr-16 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted"
              />
              {/* Token counter */}
              {inputValue.length > 0 && (
                <span className="absolute bottom-2 right-3 text-small text-text-muted tabular-nums">
                  ~{tokenEstimate} tokens
                </span>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && attachedFiles.length === 0}
              className="rounded-xl bg-accent p-3 text-text-inverse hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-1 mt-2 max-w-3xl mx-auto">
            <Tooltip content="Joindre un fichier">
              <IconButton
                icon={<Paperclip />}
                label="Joindre un fichier"
                size="sm"
                onClick={handleFileUpload}
              />
            </Tooltip>
            <Tooltip content="Recherche web">
              <IconButton
                icon={<Globe />}
                label="Recherche web"
                size="sm"
                className={webSearchActive ? 'text-blue-500 bg-blue-50' : ''}
                onClick={() => setWebSearchActive((prev) => !prev)}
              />
            </Tooltip>
            <Tooltip content="Mode réflexion">
              <IconButton
                icon={<Brain />}
                label="Mode réflexion"
                size="sm"
                className={thinkingActive ? 'text-purple-500 bg-purple-50' : ''}
                onClick={() => setThinkingActive((prev) => !prev)}
              />
            </Tooltip>
            <Tooltip content={isRecording ? 'Arrêter' : 'Saisie vocale'}>
              <IconButton
                icon={<Mic />}
                label="Saisie vocale"
                size="sm"
                className={isRecording ? 'text-red-500 bg-red-50' : ''}
                onClick={toggleRecording}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
