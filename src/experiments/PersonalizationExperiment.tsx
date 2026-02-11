import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Cpu,
  X,
  Plus,
  Check,
  Loader2,
  Globe,
  Code,
  BarChart3,
  Shield,
  Leaf,
  AlertTriangle,
  FileText,
  Eye,
  ChevronRight,
  Clock,
  Terminal,
  Play,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Textarea } from '../components/ui/Textarea.tsx'
import { Input } from '../components/ui/Input.tsx'

const STYLE_PRESETS = [
  { id: 'concis', label: 'Concis', description: 'Reponses courtes et directes' },
  { id: 'detaille', label: 'Detaille', description: 'Explications approfondies' },
  { id: 'technique', label: 'Technique', description: 'Vocabulaire specialise' },
  { id: 'pedagogique', label: 'Pedagogique', description: 'Approche explicative' },
]

const PERSONAS = [
  { id: 'senior', name: 'Analyste Senior', avatar: '👨‍💼', color: 'bg-glacier-100 border-glacier-300' },
  { id: 'junior', name: 'Junior Associate', avatar: '👩‍💻', color: 'bg-peach-100 border-peach-300' },
  { id: 'risk', name: 'Risk Manager', avatar: '🛡️', color: 'bg-warning-muted border-yellow-300' },
  { id: 'cio', name: 'CIO', avatar: '👔', color: 'bg-lab-gray-100 border-lab-gray-300' },
]

const INITIAL_MEMORIES = [
  'Prefere les analyses en francais',
  'Specialise PE mid-cap Europe',
  'Travaille chez Alpha Capital Partners',
  'Rapports au format concis avec tableaux',
]

const BOT_STORE = [
  { id: 'dd', name: 'Analyste DD', description: 'Due diligence approfondie sur les fonds', icon: Eye, color: 'bg-glacier-500' },
  { id: 'reporting', name: 'Redacteur Reporting', description: 'Generation de rapports trimestriels', icon: FileText, color: 'bg-peach-500' },
  { id: 'veille', name: 'Veille Marche', description: 'Surveillance des tendances du marche', icon: Globe, color: 'bg-carbon-600' },
  { id: 'compliance', name: 'Compliance', description: 'Verification conformite reglementaire', icon: Shield, color: 'bg-warning' },
  { id: 'esg', name: 'ESG Scorer', description: 'Notation ESG des investissements', icon: Leaf, color: 'bg-success' },
  { id: 'risk', name: 'Risk Analyzer', description: 'Analyse des risques portefeuille', icon: AlertTriangle, color: 'bg-danger' },
]

const WIZARD_TOOLS = [
  { id: 'web', label: 'Recherche Web', icon: Globe },
  { id: 'code', label: 'Execution Code', icon: Code },
  { id: 'data', label: 'Analyse de Donnees', icon: BarChart3 },
]

const AGENT_STEPS = [
  { id: 1, label: 'Collecter les donnees du fonds', status: 'complete' as const },
  { id: 2, label: 'Analyser les performances', status: 'complete' as const },
  { id: 3, label: 'Comparer avec les pairs', status: 'running' as const },
  { id: 4, label: 'Generer le rapport', status: 'pending' as const },
]

const AGENT_LOGS = [
  { time: '14:23:01', message: 'Demarrage de l\'analyse du fonds Alpha Growth...' },
  { time: '14:23:02', message: 'Acces data room Alpha Growth...' },
  { time: '14:23:03', message: '12 documents trouves dans la data room' },
  { time: '14:23:04', message: 'Extraction metriques cles : IRR, TVPI, DPI...' },
  { time: '14:23:05', message: 'IRR net calcule : 18.4% (vs benchmark 12.1%)' },
  { time: '14:23:07', message: 'Chargement des donnees peers...' },
  { time: '14:23:08', message: 'Comparaison avec 8 fonds similaires en cours...' },
  { time: '14:23:10', message: 'Alpha Growth se classe 2eme sur 9 fonds' },
]

type TabId = 'instructions' | 'bots' | 'agent'
type StepStatus = 'complete' | 'running' | 'pending'

const INTERNAL_TABS = [
  { id: 'instructions' as const, label: 'Instructions' },
  { id: 'bots' as const, label: 'Mes Bots' },
  { id: 'agent' as const, label: 'Agent' },
]

export function PersonalizationExperiment() {
  const [activeTab, setActiveTab] = useState<TabId>('instructions')

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-body font-semibold text-text-primary">Personnalisation</h2>
          <p className="text-small text-text-muted">Instructions, bots et agents autonomes</p>
        </div>
      </div>

      <Tabs
        tabs={INTERNAL_TABS}
        activeTabId={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        layoutId="personalization-tabs"
        className="px-6"
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'instructions' && <InstructionsPanel />}
        {activeTab === 'bots' && <BotsPanel />}
        {activeTab === 'agent' && <AgentPanel />}
      </div>
    </div>
  )
}

function InstructionsPanel() {
  const [instructions, setInstructions] = useState('Repondez de maniere precise et structuree. Privilegiez les tableaux pour les donnees chiffrees. Citez toujours vos sources.')
  const [selectedStyle, setSelectedStyle] = useState('concis')
  const [selectedPersona, setSelectedPersona] = useState('senior')
  const [memories, setMemories] = useState(INITIAL_MEMORIES)
  const [newMemory, setNewMemory] = useState('')

  function addMemory(): void {
    const trimmed = newMemory.trim()
    if (!trimmed) return
    setMemories((previous) => [...previous, trimmed])
    setNewMemory('')
  }

  function removeMemory(index: number): void {
    setMemories((previous) => previous.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Custom instructions */}
      <div>
        <Textarea
          label="Comment devez-vous repondre ?"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="Decrivez comment l'assistant doit se comporter..."
          rows={3}
        />
      </div>

      {/* Style presets */}
      <div>
        <p className="text-caption font-medium text-text-primary mb-2">Style de reponse</p>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStyle(preset.id)}
              className={`text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedStyle === preset.id
                  ? 'border-accent bg-accent-muted'
                  : 'border-border bg-surface hover:bg-surface-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-caption font-medium text-text-primary">{preset.label}</span>
                {selectedStyle === preset.id && <Check className="w-4 h-4 text-accent" />}
              </div>
              <p className="text-small text-text-muted mt-0.5">{preset.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Persona selector */}
      <div>
        <p className="text-caption font-medium text-text-primary mb-2">Persona</p>
        <div className="grid grid-cols-2 gap-2">
          {PERSONAS.map((persona) => (
            <motion.button
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPersona(persona.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedPersona === persona.id
                  ? 'border-accent bg-accent-muted'
                  : `${persona.color} hover:opacity-80`
              }`}
            >
              <span className="text-2xl">{persona.avatar}</span>
              <span className="text-caption font-medium text-text-primary">{persona.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Memories */}
      <div>
        <p className="text-caption font-medium text-text-primary mb-2">Memoire</p>
        <div className="space-y-1.5 mb-3">
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                className="flex items-center gap-2 bg-surface-secondary px-3 py-2 rounded-lg"
              >
                <span className="flex-1 text-small text-text-secondary">{memory}</span>
                <button
                  onClick={() => removeMemory(index)}
                  className="text-text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <Input
            value={newMemory}
            onChange={(event) => setNewMemory(event.target.value)}
            placeholder="Ajouter un fait..."
            onKeyDown={(event) => { if (event.key === 'Enter') addMemory() }}
            className="flex-1"
          />
          <Button variant="secondary" size="md" onClick={addMemory}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function BotsPanel() {
  const [wizardStep, setWizardStep] = useState(0)
  const [botName, setBotName] = useState('')
  const [botInstructions, setBotInstructions] = useState('')
  const [botTools, setBotTools] = useState<string[]>([])

  function toggleTool(toolId: string): void {
    setBotTools((previous) =>
      previous.includes(toolId)
        ? previous.filter((t) => t !== toolId)
        : [...previous, toolId]
    )
  }

  const wizardStepLabels = ['Nom + Avatar', 'Instructions', 'Outils', 'Apercu']

  return (
    <div className="p-6 space-y-6">
      {/* Bot builder wizard */}
      <div className="bg-surface-secondary rounded-xl p-5 border border-border">
        <h3 className="text-caption font-semibold text-text-primary mb-4">Creer un bot</h3>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-5">
          {wizardStepLabels.map((label, index) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-small font-bold shrink-0 ${
                index < wizardStep
                  ? 'bg-success text-white'
                  : index === wizardStep
                    ? 'bg-accent text-white'
                    : 'bg-surface-tertiary text-text-muted'
              }`}>
                {index < wizardStep ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span className={`text-small hidden sm:inline ${
                index === wizardStep ? 'text-text-primary font-medium' : 'text-text-muted'
              }`}>
                {label}
              </span>
              {index < wizardStepLabels.length - 1 && (
                <div className={`flex-1 h-px ${index < wizardStep ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={wizardStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {wizardStep === 0 && (
              <div className="space-y-3">
                <Input
                  label="Nom du bot"
                  value={botName}
                  onChange={(event) => setBotName(event.target.value)}
                  placeholder="Ex: Analyste ESG"
                />
                <div>
                  <p className="text-caption font-medium text-text-primary mb-2">Avatar</p>
                  <div className="flex gap-2">
                    {['🤖', '📊', '🔍', '📈', '🛡️', '🌍'].map((emoji) => (
                      <button
                        key={emoji}
                        className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-xl hover:border-accent transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 1 && (
              <Textarea
                label="Instructions du bot"
                value={botInstructions}
                onChange={(event) => setBotInstructions(event.target.value)}
                placeholder="Decrivez le comportement souhaite..."
                rows={4}
              />
            )}

            {wizardStep === 2 && (
              <div className="space-y-2">
                <p className="text-caption font-medium text-text-primary">Outils disponibles</p>
                {WIZARD_TOOLS.map((tool) => {
                  const Icon = tool.icon
                  const isSelected = botTools.includes(tool.id)
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected ? 'border-accent bg-accent-muted' : 'border-border bg-surface hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-text-secondary" />
                      <span className="text-caption text-text-primary flex-1 text-left">{tool.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  )
                })}
              </div>
            )}

            {wizardStep === 3 && (
              <div className="bg-surface rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-caption font-semibold text-text-primary">{botName || 'Mon Bot'}</p>
                    <p className="text-small text-text-muted">{botTools.length} outil(s) actif(s)</p>
                  </div>
                </div>
                <p className="text-small text-text-secondary">{botInstructions || 'Aucune instruction configuree'}</p>
                <div className="flex gap-1.5">
                  {botTools.map((toolId) => (
                    <Badge key={toolId} variant="accent" size="sm">{toolId}</Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={wizardStep === 0}
            onClick={() => setWizardStep((s) => s - 1)}
          >
            Precedent
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (wizardStep < 3) {
                setWizardStep((s) => s + 1)
              } else {
                setWizardStep(0)
                setBotName('')
                setBotInstructions('')
                setBotTools([])
              }
            }}
          >
            {wizardStep === 3 ? 'Creer' : 'Suivant'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bot store */}
      <div>
        <h3 className="text-caption font-semibold text-text-primary mb-3">Bot Store</h3>
        <div className="grid grid-cols-2 gap-3">
          {BOT_STORE.map((bot) => {
            const Icon = bot.icon
            return (
              <motion.div
                key={bot.id}
                whileHover={{ scale: 1.02 }}
                className="bg-surface border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 ${bot.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-caption font-medium text-text-primary">{bot.name}</p>
                <p className="text-small text-text-muted mt-0.5 mb-3">{bot.description}</p>
                <Button variant="secondary" size="sm" className="w-full">
                  <Bot className="w-3.5 h-3.5" />
                  Utiliser
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AgentPanel() {
  const [showApproval, setShowApproval] = useState(true)
  const [approvalHandled, setApprovalHandled] = useState(false)
  const [steps, setSteps] = useState(AGENT_STEPS)

  function handleApproval(approved: boolean): void {
    setApprovalHandled(true)
    setShowApproval(false)

    if (approved) {
      setTimeout(() => {
        setSteps((previous) =>
          previous.map((step) => {
            if (step.id === 3) return { ...step, status: 'complete' as StepStatus }
            if (step.id === 4) return { ...step, status: 'running' as StepStatus }
            return step
          })
        )
      }, 1500)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Agent input */}
      <div className="bg-surface-secondary rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Play className="w-4 h-4 text-accent" />
          <span className="text-caption font-semibold text-text-primary">Mission de l'agent</span>
        </div>
        <p className="text-body text-text-secondary bg-surface rounded-lg px-3 py-2 border border-border">
          Analysez le fonds Alpha Growth et generez un rapport complet avec comparaison aux pairs.
        </p>
      </div>

      {/* Execution plan */}
      <div>
        <h3 className="text-caption font-semibold text-text-primary mb-3">Plan d'execution</h3>
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-3">
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step.status === 'complete'
                    ? 'bg-success text-white'
                    : step.status === 'running'
                      ? 'bg-accent text-white'
                      : 'bg-surface-tertiary text-text-muted'
                }`}>
                  {step.status === 'complete' && <Check className="w-4 h-4" />}
                  {step.status === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {step.status === 'pending' && <span className="text-small font-bold">{step.id}</span>}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-6 ${
                    step.status === 'complete' ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="pb-4 pt-1.5">
                <p className={`text-caption font-medium ${
                  step.status === 'pending' ? 'text-text-muted' : 'text-text-primary'
                }`}>
                  {step.label}
                </p>
                {step.status === 'running' && (
                  <Badge variant="info" size="sm" className="mt-1">En cours...</Badge>
                )}
                {step.status === 'complete' && (
                  <Badge variant="success" size="sm" className="mt-1">Termine</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval dialog */}
      <AnimatePresence>
        {showApproval && !approvalHandled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-warning-muted border border-warning/30 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-caption font-semibold text-text-primary">Autorisation requise</p>
                <p className="text-small text-text-secondary mt-1">
                  L'agent souhaite acceder a la data room Alpha Growth. Autoriser ?
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="primary" size="sm" onClick={() => handleApproval(true)}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Autoriser
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleApproval(false)}>
                    <ShieldX className="w-3.5 h-3.5" />
                    Refuser
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent log */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-text-muted" />
          <span className="text-caption font-semibold text-text-primary">Journal de l'agent</span>
        </div>
        <div className="bg-carbon-950 rounded-lg p-3 max-h-52 overflow-y-auto scrollbar-thin font-mono">
          {AGENT_LOGS.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-2 py-0.5"
            >
              <span className="text-small text-carbon-400 shrink-0">
                <Clock className="w-3 h-3 inline mr-1" />
                [{log.time}]
              </span>
              <span className="text-small text-carbon-100">{log.message}</span>
            </motion.div>
          ))}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-2 h-3.5 bg-glacier-400 ml-1"
          />
        </div>
      </div>
    </div>
  )
}
