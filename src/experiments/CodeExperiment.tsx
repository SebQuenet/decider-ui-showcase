import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User, Play, Copy, Download, Eye, Code, GitCompare,
  Terminal, ChevronDown, FileCode, FileText, File,
  MessageSquare,
} from 'lucide-react'
import { messageVariants } from '../lib/animations'

type ArtifactTab = 'preview' | 'code' | 'diff' | 'terminal'
type FileId = 'index.html' | 'styles.css' | 'app.ts'
type Version = 'v1' | 'v2' | 'v3'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  hasArtifact?: boolean
}

interface InlineComment {
  line: number
  text: string
}

const FILE_ICONS: Record<FileId, React.ReactNode> = {
  'index.html': <FileCode className="w-3.5 h-3.5 text-peach-500" />,
  'styles.css': <FileText className="w-3.5 h-3.5 text-glacier-500" />,
  'app.ts': <File className="w-3.5 h-3.5 text-blue-500" />,
}

const CODE_FILES: Record<Version, Record<FileId, string>> = {
  v1: {
    'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="app"></div>
  <script src="app.ts"></script>
</body>
</html>`,
    'styles.css': `.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  height: 100vh;
  background: #f8fafc;
}

.sidebar {
  background: #1e293b;
  color: white;
  padding: 1.5rem;
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}`,
    'app.ts': `interface DashboardProps {
  title: string
  funds: Fund[]
}

interface Fund {
  name: string
  nav: number
  irr: number
}

function Dashboard({ title, funds }: DashboardProps) {
  const totalNav = funds.reduce(
    (sum, fund) => sum + fund.nav, 0
  )

  return {
    render() {
      console.log(\`Dashboard: \${title}\`)
      console.log(\`Total NAV: \${totalNav}\`)
      funds.forEach(fund => {
        console.log(\`  \${fund.name}: \${fund.irr}%\`)
      })
    }
  }
}`,
  },
  v2: {
    'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Dashboard - Decider</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="app.ts"></script>
</body>
</html>`,
    'styles.css': `.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  background: #0f172a;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-content: start;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.metric {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}`,
    'app.ts': `interface DashboardProps {
  title: string
  funds: Fund[]
  onFundSelect?: (fund: Fund) => void
}

interface Fund {
  id: string
  name: string
  nav: number
  irr: number
  status: 'active' | 'closed'
}

function Dashboard({ title, funds, onFundSelect }: DashboardProps) {
  const activeFunds = funds.filter(f => f.status === 'active')
  const totalNav = activeFunds.reduce(
    (sum, fund) => sum + fund.nav, 0
  )
  const avgIrr = activeFunds.reduce(
    (sum, fund) => sum + fund.irr, 0
  ) / activeFunds.length

  function handleFundClick(fund: Fund) {
    onFundSelect?.(fund)
  }

  return {
    render() {
      console.log(\`Dashboard: \${title}\`)
      console.log(\`Fonds actifs: \${activeFunds.length}\`)
      console.log(\`Total NAV: \${totalNav.toFixed(2)}M\`)
      console.log(\`IRR moyen: \${avgIrr.toFixed(1)}%\`)
    }
  }
}

export { Dashboard }
export type { Fund, DashboardProps }`,
  },
  v3: {
    'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Dashboard - Decider</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="app.ts"></script>
</body>
</html>`,
    'styles.css': `.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  background: #0f172a;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
}

.nav-item.active {
  background: rgba(41,171,181,0.2);
  color: #29abb5;
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-content: start;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  border: 1px solid transparent;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #29abb5;
}

.metric {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.trend-up { color: #16a34a; }
.trend-down { color: #dc2626; }`,
    'app.ts': `interface DashboardProps {
  title: string
  funds: Fund[]
  onFundSelect?: (fund: Fund) => void
  onExport?: (format: 'csv' | 'pdf') => void
}

interface Fund {
  id: string
  name: string
  nav: number
  irr: number
  status: 'active' | 'closed'
  trend: 'up' | 'down' | 'stable'
}

function Dashboard({ title, funds, onFundSelect, onExport }: DashboardProps) {
  const activeFunds = funds.filter(f => f.status === 'active')
  const totalNav = activeFunds.reduce(
    (sum, fund) => sum + fund.nav, 0
  )
  const avgIrr = activeFunds.reduce(
    (sum, fund) => sum + fund.irr, 0
  ) / activeFunds.length

  function handleFundClick(fund: Fund) {
    onFundSelect?.(fund)
  }

  function handleExport(format: 'csv' | 'pdf') {
    onExport?.(format)
  }

  return {
    render() {
      console.log(\`Dashboard: \${title}\`)
      console.log(\`Fonds actifs: \${activeFunds.length}\`)
      console.log(\`Total NAV: \${totalNav.toFixed(2)}M\`)
      console.log(\`IRR moyen: \${avgIrr.toFixed(1)}%\`)
      activeFunds.forEach(fund => {
        const icon = fund.trend === 'up' ? '↑' : fund.trend === 'down' ? '↓' : '→'
        console.log(\`  \${icon} \${fund.name}: \${fund.irr}% (NAV: \${fund.nav}M)\`)
      })
    }
  }
}

export { Dashboard }
export type { Fund, DashboardProps }`,
  },
}

const DIFF_LINES: { type: 'added' | 'removed' | 'unchanged'; content: string }[] = [
  { type: 'unchanged', content: 'interface DashboardProps {' },
  { type: 'unchanged', content: '  title: string' },
  { type: 'unchanged', content: '  funds: Fund[]' },
  { type: 'unchanged', content: '  onFundSelect?: (fund: Fund) => void' },
  { type: 'added', content: '  onExport?: (format: \'csv\' | \'pdf\') => void' },
  { type: 'unchanged', content: '}' },
  { type: 'unchanged', content: '' },
  { type: 'unchanged', content: 'interface Fund {' },
  { type: 'unchanged', content: '  id: string' },
  { type: 'unchanged', content: '  name: string' },
  { type: 'unchanged', content: '  nav: number' },
  { type: 'unchanged', content: '  irr: number' },
  { type: 'removed', content: '  status: \'active\' | \'closed\'' },
  { type: 'added', content: '  status: \'active\' | \'closed\'' },
  { type: 'added', content: '  trend: \'up\' | \'down\' | \'stable\'' },
  { type: 'unchanged', content: '}' },
]

const TERMINAL_LINES = [
  { prompt: true, text: 'pnpm dev' },
  { prompt: false, text: '' },
  { prompt: false, text: '  VITE v6.3.1  ready in 234 ms' },
  { prompt: false, text: '' },
  { prompt: false, text: '  ➜  Local:   http://localhost:5173/' },
  { prompt: false, text: '  ➜  Network: http://192.168.1.42:5173/' },
  { prompt: false, text: '' },
  { prompt: true, text: 'pnpm tsc --noEmit' },
  { prompt: false, text: '' },
  { prompt: false, text: '✓ No errors found.' },
]

const INLINE_COMMENTS: Record<FileId, InlineComment[]> = {
  'app.ts': [
    { line: 5, text: 'Ajouter la validation du format d\'export' },
    { line: 18, text: 'Optimiser avec useMemo pour les gros portfolios' },
  ],
  'styles.css': [
    { line: 12, text: 'Utiliser les tokens Decider pour les couleurs' },
  ],
  'index.html': [],
}

const VERSION_TIMESTAMPS: Record<Version, string> = {
  v1: 'il y a 2h',
  v2: 'il y a 45 min',
  v3: 'il y a 5 min',
}

const MOCK_CONVERSATIONS: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Cree un dashboard React avec une sidebar et des cartes de metriques pour afficher les performances des fonds.',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'J\'ai cree un dashboard avec une structure grid, une sidebar de navigation et des cartes de metriques. Le composant Dashboard accepte une liste de fonds et affiche le NAV total et l\'IRR.',
    timestamp: new Date(Date.now() - 7100000),
    hasArtifact: true,
  },
  {
    id: '3',
    role: 'user',
    content: 'Ajoute un filtre par statut (actif/clos), le calcul de l\'IRR moyen et un callback de selection.',
    timestamp: new Date(Date.now() - 2700000),
  },
  {
    id: '4',
    role: 'assistant',
    content: 'J\'ai mis a jour le dashboard avec le filtrage par statut, l\'IRR moyen et le callback `onFundSelect`. J\'ai aussi ameliore le CSS avec des transitions hover et un layout responsive.',
    timestamp: new Date(Date.now() - 2600000),
    hasArtifact: true,
  },
  {
    id: '5',
    role: 'user',
    content: 'Ajoute une fonctionnalite d\'export CSV/PDF et un indicateur de tendance par fonds.',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Voila la v3 avec export CSV/PDF, indicateurs de tendance (up/down/stable) et une navigation sidebar avec styles actifs. Le CSS a ete enrichi avec les couleurs Decider.',
    timestamp: new Date(Date.now() - 200000),
    hasArtifact: true,
  },
]

const ARTIFACT_TABS: { id: ArtifactTab; label: string; icon: React.ReactNode }[] = [
  { id: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
  { id: 'diff', label: 'Diff', icon: <GitCompare className="w-3.5 h-3.5" /> },
  { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-3.5 h-3.5" /> },
]

const FILE_TABS: FileId[] = ['index.html', 'styles.css', 'app.ts']

let messageIdCounter = 100

function highlightLine(line: string, fileType: string): string {
  let highlighted = line

  if (fileType === 'ts') {
    highlighted = line
      .replace(/(interface|function|const|let|return|export|type|import)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/(string|number|void|boolean)\b/g, '<span class="text-cyan-400">$1</span>')
      .replace(/('.*?')/g, '<span class="text-green-400">$1</span>')
      .replace(/(\/\/.*$)/g, '<span class="text-text-muted">$1</span>')
  } else if (fileType === 'css') {
    highlighted = line
      .replace(/([.#][\w-]+)/g, '<span class="text-peach-400">$1</span>')
      .replace(/:\s*(.+);/g, ': <span class="text-cyan-300">$1</span>;')
  } else if (fileType === 'html') {
    highlighted = line
      .replace(/(&lt;\/?[\w-]+)/g, '<span class="text-red-400">$1</span>')
      .replace(/([\w-]+)=/g, '<span class="text-yellow-400">$1</span>=')
      .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
  }

  return highlighted
}

export function CodeExperiment() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CONVERSATIONS)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeArtifactTab, setActiveArtifactTab] = useState<ArtifactTab>('code')
  const [activeFile, setActiveFile] = useState<FileId>('app.ts')
  const [currentVersion, setCurrentVersion] = useState<Version>('v3')
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<typeof TERMINAL_LINES>([])
  const [isRunning, setIsRunning] = useState(false)
  const [hoveredCommentLine, setHoveredCommentLine] = useState<number | null>(null)
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
    setIsTyping(true)

    setTimeout(() => {
      const response: ChatMessage = {
        id: String(++messageIdCounter),
        role: 'assistant',
        content: 'J\'ai mis a jour le code avec vos modifications. Vous pouvez voir les changements dans le panneau d\'artefact.',
        timestamp: new Date(),
        hasArtifact: true,
      }
      setMessages((previous) => [...previous, response])
      setIsTyping(false)
    }, 1200)
  }, [inputValue, isTyping])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleRunTerminal = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setTerminalOutput([])

    TERMINAL_LINES.forEach((line, index) => {
      setTimeout(() => {
        setTerminalOutput((previous) => [...previous, line])
        if (index === TERMINAL_LINES.length - 1) {
          setIsRunning(false)
        }
      }, index * 200)
    })
  }, [isRunning])

  const handleCopy = useCallback(() => {
    const code = CODE_FILES[currentVersion][activeFile]
    navigator.clipboard.writeText(code)
  }, [currentVersion, activeFile])

  const fileExtension = activeFile.split('.').pop() ?? ''
  const currentCode = CODE_FILES[currentVersion][activeFile]
  const currentComments = INLINE_COMMENTS[activeFile] ?? []

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="w-[55%] flex flex-col border-r border-border">
        <div className="px-4 py-3 border-b border-border bg-surface-secondary flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          <span className="text-caption font-semibold text-text-primary">Code Assistant</span>
        </div>

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
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-glacier-600 text-white rounded-br-md'
                    : 'bg-surface-tertiary text-text-primary rounded-bl-md'
                }`}>
                  <div className="text-body leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  {message.hasArtifact && (
                    <div className="mt-2 flex items-center gap-1.5 text-accent text-small">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Artefact mis a jour</span>
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

        <div className="border-t border-border bg-surface p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Demandez une modification de code..."
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

      <div className="w-[45%] flex flex-col bg-surface-secondary">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex gap-0.5">
            {ARTIFACT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveArtifactTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-small font-medium rounded-md transition-colors cursor-pointer ${
                  activeArtifactTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-tertiary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                className="flex items-center gap-1 px-2 py-1 text-small text-text-secondary rounded-md border border-border hover:bg-surface-tertiary transition-colors cursor-pointer"
              >
                {currentVersion}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {showVersionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                  >
                    {(['v1', 'v2', 'v3'] as Version[]).map((version) => (
                      <button
                        key={version}
                        onClick={() => { setCurrentVersion(version); setShowVersionDropdown(false) }}
                        className={`w-full flex items-center justify-between gap-4 px-3 py-2 text-small hover:bg-surface-secondary transition-colors cursor-pointer ${
                          currentVersion === version ? 'text-accent' : 'text-text-secondary'
                        }`}
                      >
                        <span className="font-medium">{version}</span>
                        <span className="text-text-muted text-[0.625rem]">{VERSION_TIMESTAMPS[version]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-tertiary transition-colors cursor-pointer"
              title="Copier"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-tertiary transition-colors cursor-pointer"
              title="Telecharger"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {(activeArtifactTab === 'code' || activeArtifactTab === 'diff') && (
          <div className="flex border-b border-border">
            {FILE_TABS.map((file) => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`flex items-center gap-1.5 px-3 py-2 text-small border-b-2 transition-colors cursor-pointer ${
                  activeFile === file
                    ? 'text-text-primary border-accent'
                    : 'text-text-muted border-transparent hover:text-text-secondary'
                }`}
              >
                {FILE_ICONS[file]}
                {file}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {activeArtifactTab === 'preview' && (
            <div className="p-4">
              <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-tertiary border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-[0.625rem] text-text-muted">localhost:5173</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] h-64">
                  <div className="bg-slate-900 p-3 text-[0.625rem] text-white/70 space-y-2">
                    <div className="text-glacier-400 font-bold text-[0.7rem] mb-3">Decider</div>
                    <div className="px-2 py-1 rounded bg-glacier-600/20 text-glacier-400">Dashboard</div>
                    <div className="px-2 py-1 rounded hover:bg-white/5">Fonds</div>
                    <div className="px-2 py-1 rounded hover:bg-white/5">Rapports</div>
                    <div className="px-2 py-1 rounded hover:bg-white/5">Parametres</div>
                  </div>
                  <div className="p-4 bg-slate-50 grid grid-cols-2 gap-3 content-start">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                      <div className="text-[0.5rem] text-slate-500 uppercase tracking-wider">Total NAV</div>
                      <div className="text-lg font-bold text-slate-900">847.2M</div>
                      <div className="text-[0.5rem] text-green-600 mt-1">↑ +12.4%</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                      <div className="text-[0.5rem] text-slate-500 uppercase tracking-wider">IRR moyen</div>
                      <div className="text-lg font-bold text-slate-900">14.2%</div>
                      <div className="text-[0.5rem] text-green-600 mt-1">↑ +2.1pts</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                      <div className="text-[0.5rem] text-slate-500 uppercase tracking-wider">Fonds actifs</div>
                      <div className="text-lg font-bold text-slate-900">12</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                      <div className="text-[0.5rem] text-slate-500 uppercase tracking-wider">TVPI</div>
                      <div className="text-lg font-bold text-slate-900">1.85x</div>
                      <div className="text-[0.5rem] text-green-600 mt-1">↑ +0.12x</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeArtifactTab === 'code' && (
            <div className="font-mono text-[0.8rem] leading-relaxed bg-slate-950 text-slate-300 min-h-full">
              {currentCode.split('\n').map((line, lineIndex) => {
                const lineNumber = lineIndex + 1
                const comment = currentComments.find((c) => c.line === lineNumber)
                return (
                  <div
                    key={lineIndex}
                    className="flex group/line hover:bg-white/5 relative"
                    onMouseEnter={() => comment && setHoveredCommentLine(lineNumber)}
                    onMouseLeave={() => setHoveredCommentLine(null)}
                  >
                    <span className="w-10 text-right pr-3 text-slate-600 select-none shrink-0 text-[0.75rem]">
                      {lineNumber}
                    </span>
                    {comment && (
                      <span className="absolute left-11 -top-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-yellow-500" />
                      </span>
                    )}
                    <span
                      className="flex-1 pl-3"
                      dangerouslySetInnerHTML={{ __html: highlightLine(line, fileExtension) }}
                    />

                    <AnimatePresence>
                      {hoveredCommentLine === lineNumber && comment && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-16 top-full z-30 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-[0.75rem] text-yellow-900 shadow-lg whitespace-nowrap"
                        >
                          {comment.text}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}

          {activeArtifactTab === 'diff' && (
            <div className="font-mono text-[0.8rem] leading-relaxed bg-slate-950 text-slate-300 min-h-full">
              {DIFF_LINES.map((line, index) => {
                let bgClass = ''
                let prefix = ' '
                if (line.type === 'added') {
                  bgClass = 'bg-green-950/40'
                  prefix = '+'
                } else if (line.type === 'removed') {
                  bgClass = 'bg-red-950/40'
                  prefix = '-'
                }

                return (
                  <div key={index} className={`flex ${bgClass}`}>
                    <span className="w-10 text-right pr-3 text-slate-600 select-none shrink-0 text-[0.75rem]">
                      {index + 1}
                    </span>
                    <span className={`w-4 text-center shrink-0 ${
                      line.type === 'added' ? 'text-green-400' : line.type === 'removed' ? 'text-red-400' : 'text-slate-600'
                    }`}>
                      {prefix}
                    </span>
                    <span className={`flex-1 ${
                      line.type === 'added' ? 'text-green-300' : line.type === 'removed' ? 'text-red-300' : ''
                    }`}>
                      {line.content}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {activeArtifactTab === 'terminal' && (
            <div className="font-mono text-[0.8rem] leading-relaxed bg-slate-950 text-slate-300 min-h-full p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-[0.7rem]">Terminal</span>
                <button
                  onClick={handleRunTerminal}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-600 text-white text-[0.75rem] hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  Executer
                </button>
              </div>
              <div className="space-y-0.5">
                {terminalOutput.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {line.prompt ? (
                      <span>
                        <span className="text-green-400">$</span>{' '}
                        <span className="text-white">{line.text}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{line.text}</span>
                    )}
                  </motion.div>
                ))}
                {terminalOutput.length === 0 && (
                  <span className="text-slate-500">Cliquez sur "Executer" pour lancer la commande...</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
