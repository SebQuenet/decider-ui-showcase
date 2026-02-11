import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, BarChart3, ClipboardList, BookOpen, HelpCircle,
  Check, AlertTriangle, X, ChevronRight, RefreshCw,
  FileDown, Presentation, Table, Clock,
} from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '../lib/animations'

// --- Types ---

interface Template {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  estimatedPages: number
}

interface DataAvailability {
  label: string
  status: 'available' | 'partial' | 'missing'
  details?: string
}

type GenerationStep = 'template' | 'checklist' | 'config' | 'generating' | 'preview'
type RiskLevel = 'low' | 'moderate' | 'high'
type Tone = 'institutional' | 'public'

interface DocumentSection {
  id: string
  title: string
  content: string
  risk?: { level: RiskLevel; label: string }
  chartPlaceholder?: string
}

// --- Constantes ---

const TEMPLATES: Template[] = [
  {
    id: 'factsheet',
    title: 'Factsheet',
    description: 'Fiche synthetique du fonds avec metriques cles et graphiques.',
    icon: <FileText className="w-6 h-6" />,
    estimatedPages: 2,
  },
  {
    id: 'reporting',
    title: 'Reporting Trimestriel',
    description: 'Rapport trimestriel complet avec performance, allocation et commentaires.',
    icon: <BarChart3 className="w-6 h-6" />,
    estimatedPages: 8,
  },
  {
    id: 'memo',
    title: 'Memo d\'Investissement',
    description: 'Analyse detaillee pour comite d\'investissement avec recommandation.',
    icon: <ClipboardList className="w-6 h-6" />,
    estimatedPages: 15,
  },
  {
    id: 'synthese',
    title: 'Synthese DD',
    description: 'Synthese des travaux de due diligence avec scoring et conclusions.',
    icon: <BookOpen className="w-6 h-6" />,
    estimatedPages: 12,
  },
  {
    id: 'questionnaire',
    title: 'Questionnaire DD',
    description: 'Questionnaire pre-rempli pour la due diligence operationnelle.',
    icon: <HelpCircle className="w-6 h-6" />,
    estimatedPages: 20,
  },
]

const DATA_CHECKLIST: DataAvailability[] = [
  { label: 'Performance historique', status: 'available' },
  { label: 'Composition du portefeuille', status: 'available' },
  { label: 'Frais detailles', status: 'partial', details: 'Side letters non incluses' },
  { label: 'Audit recent', status: 'missing', details: 'Dernier audit : 2023' },
  { label: 'Biographies equipe', status: 'available' },
  { label: 'Historique cash flows', status: 'available' },
  { label: 'Rapports ESG', status: 'partial', details: 'Donnees partielles Q3-Q4' },
  { label: 'Documents juridiques', status: 'available' },
]

const SECTIONS_CONFIG = [
  { id: 'resume', label: 'Resume Executif' },
  { id: 'performance', label: 'Performance' },
  { id: 'allocation', label: 'Allocation' },
  { id: 'risques', label: 'Risques' },
  { id: 'frais', label: 'Frais' },
  { id: 'conclusion', label: 'Conclusion' },
]

const GENERATION_MESSAGES = [
  'Extraction des donnees...',
  'Redaction des sections...',
  'Integration des graphiques...',
  'Mise en forme...',
]

const DOCUMENT_SECTIONS: DocumentSection[] = [
  {
    id: 'resume',
    title: 'Resume Executif',
    content: 'Le fonds Alpha Capital affiche une performance solide avec un TRI net de 14.2% depuis inception, surperformant le benchmark de 320 points de base. La strategie de diversification sectorielle a permis de limiter la volatilite a 8.5% annualise. L\'equipe de gestion, composee de 12 professionnels experimentes, deploie une approche disciplinee combinant analyse fondamentale et screening quantitatif.',
  },
  {
    id: 'performance',
    title: 'Performance',
    content: 'La performance du fonds sur les 12 derniers mois s\'etablit a +18.3%, portee par les positions dans le secteur technologique (+24.1%) et les services financiers (+15.7%). Le ratio de Sharpe de 1.42 confirme la qualite de l\'ajustement risque/rendement. Les DPI et RVPI s\'elevent respectivement a 0.85x et 0.72x, pour un TVPI de 1.57x.',
    chartPlaceholder: 'Graphique NAV',
  },
  {
    id: 'allocation',
    title: 'Allocation',
    content: 'Le portefeuille est investi a travers 6 secteurs principaux avec une concentration maitrisee. Le top 10 des positions represente 45% de l\'actif net. La diversification geographique couvre l\'Europe (55%), l\'Amerique du Nord (30%) et l\'Asie-Pacifique (15%). Les engagements non appeles representent 22% du total commis.',
    chartPlaceholder: 'Allocation sectorielle',
  },
  {
    id: 'risques',
    title: 'Risques',
    content: 'L\'analyse des risques identifie trois categories principales necessitant un suivi rapproche.',
    risk: { level: 'moderate', label: 'Risque global modere' },
  },
  {
    id: 'frais',
    title: 'Frais',
    content: 'Les frais de gestion s\'elevent a 1.75% de l\'actif net, preleves trimestriellement. Le carried interest est fixe a 20% au-dela d\'un hurdle rate de 8%, avec un mecanisme de catch-up a 100%. Les frais de transaction sont estimes a 0.15% par operation en moyenne. Le TER (Total Expense Ratio) s\'etablit a 2.1%.',
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: 'Le fonds Alpha Capital presente un profil risque/rendement attractif pour un investisseur institutionnel avec un horizon minimum de 7 ans. Les points de vigilance concernent la concentration sectorielle et la disponibilite limitee des donnees ESG. Nous recommandons une allocation cible de 3-5% du portefeuille alternatives.',
  },
]

const RISK_INDICATORS: { label: string; level: RiskLevel; description: string }[] = [
  { label: 'Risque de marche', level: 'moderate', description: 'Exposition aux cycles economiques' },
  { label: 'Risque de liquidite', level: 'high', description: 'Lock-up de 36 mois, rachat limite' },
  { label: 'Risque operationnel', level: 'low', description: 'Processus robustes, equipe stable' },
  { label: 'Risque de contrepartie', level: 'low', description: 'Depositaire tier-1' },
  { label: 'Risque reglementaire', level: 'moderate', description: 'Evolution AIFMD en cours' },
]

const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; bgClass: string; textClass: string }> = {
  low: { label: 'Faible', bgClass: 'bg-success-muted', textClass: 'text-success' },
  moderate: { label: 'Modere', bgClass: 'bg-warning-muted', textClass: 'text-warning' },
  high: { label: 'Eleve', bgClass: 'bg-danger-muted', textClass: 'text-danger' },
}

const VERSIONS = ['v3 (Final)', 'v2 (Revise)', 'v1 (Brouillon)']
const FUNDS = ['Fonds Alpha Capital', 'Fonds Beta Growth', 'Fonds Gamma Income']

const STATUS_ICON_MAP = {
  available: { icon: Check, className: 'text-success' },
  partial: { icon: AlertTriangle, className: 'text-warning' },
  missing: { icon: X, className: 'text-danger' },
}

// --- Composant principal ---

export function DocumentsExperiment(): React.ReactNode {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<GenerationStep>('template')
  const [selectedFund, setSelectedFund] = useState(FUNDS[0])
  const [tone, setTone] = useState<Tone>('institutional')
  const [enabledSections, setEnabledSections] = useState<Set<string>>(
    new Set(SECTIONS_CONFIG.map((s) => s.id)),
  )
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState('')
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function handleSelectTemplate(templateId: string): void {
    setSelectedTemplate(templateId)
    setCurrentStep('checklist')
  }

  function handleContinueToConfig(): void {
    setCurrentStep('config')
  }

  function handleGenerate(): void {
    setCurrentStep('generating')
    setGenerationProgress(0)
    setGenerationMessage(GENERATION_MESSAGES[0])

    let messageIndex = 0
    const totalDuration = 4000
    const interval = setInterval(() => {
      setGenerationProgress((previous) => {
        const next = previous + 2
        const newMessageIndex = Math.min(
          Math.floor((next / 100) * GENERATION_MESSAGES.length),
          GENERATION_MESSAGES.length - 1,
        )
        if (newMessageIndex !== messageIndex) {
          messageIndex = newMessageIndex
          setGenerationMessage(GENERATION_MESSAGES[messageIndex])
        }
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setCurrentStep('preview'), 400)
          return 100
        }
        return next
      })
    }, totalDuration / 50)
  }

  function toggleSection(sectionId: string): void {
    setEnabledSections((previous) => {
      const next = new Set(previous)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  function handleExport(format: string): void {
    setToastMessage(`Export ${format} en preparation...`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  function handleResetToTemplate(): void {
    setSelectedTemplate(null)
    setCurrentStep('template')
    setGenerationProgress(0)
  }

  const selectedTemplateData = TEMPLATES.find((t) => t.id === selectedTemplate)

  return (
    <div className="w-full h-full flex bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Panel gauche : Selection template */}
      <div className="w-[30%] border-r border-border bg-surface-secondary flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-caption font-semibold text-text-primary">Templates</h2>
          <p className="text-small text-text-muted mt-0.5">Selectionnez un type de document</p>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2"
        >
          {TEMPLATES.map((template) => (
            <motion.button
              key={template.id}
              variants={staggerItemVariants}
              onClick={() => handleSelectTemplate(template.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                selectedTemplate === template.id
                  ? 'border-accent bg-accent-muted/40 shadow-sm'
                  : 'border-border-muted bg-surface hover:border-border hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedTemplate === template.id
                    ? 'bg-accent text-white'
                    : 'bg-surface-tertiary text-text-secondary'
                }`}>
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-caption font-medium text-text-primary">{template.title}</div>
                  <div className="text-small text-text-muted mt-0.5 line-clamp-2">{template.description}</div>
                  <div className="text-[0.625rem] text-text-muted mt-1.5">~{template.estimatedPages} pages</div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Panel droit : Contenu dynamique */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Etape : Pas de selection */}
        {currentStep === 'template' && !selectedTemplate && (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-4 p-8">
            <FileText className="w-16 h-16 text-text-muted/20" />
            <p className="text-body text-center">Selectionnez un template pour commencer la generation</p>
          </div>
        )}

        {/* Etape : Checklist de donnees */}
        {currentStep === 'checklist' && selectedTemplateData && (
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-surface-secondary">
              <div className="flex items-center gap-2 text-small text-text-muted mb-1">
                <span>Etape 1/3</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-text-primary font-medium">Disponibilite des donnees</span>
              </div>
              <h2 className="text-h4 text-text-primary">{selectedTemplateData.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
              <p className="text-body text-text-secondary mb-4">
                Verification des donnees necessaires pour generer le document :
              </p>

              <div className="space-y-2">
                {DATA_CHECKLIST.map((item) => {
                  const statusConfig = STATUS_ICON_MAP[item.status]
                  const StatusIcon = statusConfig.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 px-4 py-3 bg-surface-secondary rounded-lg">
                      <StatusIcon className={`w-4 h-4 shrink-0 ${statusConfig.className}`} />
                      <span className="text-caption text-text-primary flex-1">{item.label}</span>
                      {item.details && (
                        <span className="text-small text-text-muted">{item.details}</span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-warning-muted rounded-xl border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-caption font-medium text-warning">Donnees incompletes</p>
                    <p className="text-small text-text-secondary mt-1">
                      Certaines donnees sont partielles ou manquantes. Le document sera genere avec
                      les informations disponibles et les sections concernees seront signalees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-between">
              <button
                onClick={handleResetToTemplate}
                className="px-4 py-2 text-caption text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={handleContinueToConfig}
                className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium"
              >
                Continuer malgre les donnees manquantes
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Etape : Configuration */}
        {currentStep === 'config' && (
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-surface-secondary">
              <div className="flex items-center gap-2 text-small text-text-muted mb-1">
                <span>Etape 2/3</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-text-primary font-medium">Configuration</span>
              </div>
              <h2 className="text-h4 text-text-primary">Parametres du document</h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              <div>
                <label className="block text-caption font-medium text-text-primary mb-2">Fonds</label>
                <select
                  value={selectedFund}
                  onChange={(event) => setSelectedFund(event.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-caption text-text-primary outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  {FUNDS.map((fund) => (
                    <option key={fund} value={fund}>{fund}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-caption font-medium text-text-primary mb-2">Ton</label>
                <div className="flex gap-3">
                  {([
                    { value: 'institutional' as const, label: 'Institutionnel' },
                    { value: 'public' as const, label: 'Grand public' },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-caption font-medium transition-colors cursor-pointer ${
                        tone === option.value
                          ? 'border-accent bg-accent-muted text-accent'
                          : 'border-border bg-surface text-text-secondary hover:border-border-strong'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-caption font-medium text-text-primary mb-2">Sections a inclure</label>
                <div className="grid grid-cols-2 gap-2">
                  {SECTIONS_CONFIG.map((section) => {
                    const isEnabled = enabledSections.has(section.id)
                    return (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-small transition-colors cursor-pointer ${
                          isEnabled
                            ? 'border-accent/30 bg-accent-muted/50 text-accent'
                            : 'border-border bg-surface text-text-muted'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isEnabled ? 'bg-accent border-accent' : 'border-border-strong'
                        }`}>
                          {isEnabled && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {section.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-between">
              <button
                onClick={() => setCurrentStep('checklist')}
                className="px-4 py-2 text-caption text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium"
              >
                Generer le document
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Etape : Generation en cours */}
        {currentStep === 'generating' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-10 h-10 text-accent" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-h4 text-text-primary mb-2">Generation en cours</h3>
              <p className="text-body text-text-secondary">{generationMessage}</p>
            </div>
            <div className="w-80">
              <div className="w-full h-3 bg-surface-tertiary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
              <div className="text-small text-text-muted text-center mt-2 font-data">{generationProgress}%</div>
            </div>
          </div>
        )}

        {/* Etape : Apercu du document */}
        {currentStep === 'preview' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-secondary">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetToTemplate}
                  className="text-small text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                >
                  Nouveau document
                </button>
                <span className="text-text-muted">/</span>
                <span className="text-caption font-medium text-text-primary">{selectedTemplateData?.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-surface rounded-lg border border-border">
                  <Clock className="w-3.5 h-3.5 text-text-muted" />
                  <select
                    value={selectedVersion}
                    onChange={(event) => setSelectedVersion(event.target.value)}
                    className="text-small text-text-primary bg-transparent outline-none cursor-pointer"
                  >
                    {VERSIONS.map((version) => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
                </div>
                {[
                  { label: 'PDF', icon: FileDown },
                  { label: 'Word', icon: FileText },
                  { label: 'Excel', icon: Table },
                  { label: 'PPT', icon: Presentation },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleExport(label)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface rounded-lg border border-border text-small text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* Page de titre */}
              <div className="max-w-3xl mx-auto px-8 py-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8 pb-8 border-b border-border"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-muted text-accent rounded-full text-small font-medium mb-4">
                    <FileText className="w-3.5 h-3.5" />
                    {selectedTemplateData?.title}
                  </div>
                  <h1 className="text-h1 text-text-primary mb-2">{selectedFund}</h1>
                  <p className="text-body text-text-secondary">
                    Genere le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-small text-text-muted mt-1">Decider Finance</p>
                </motion.div>

                {/* Table des matieres */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 p-4 bg-surface-secondary rounded-xl"
                >
                  <h3 className="text-caption font-semibold text-text-primary mb-3">Table des matieres</h3>
                  <div className="space-y-1.5">
                    {DOCUMENT_SECTIONS.filter((s) => enabledSections.has(s.id)).map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-surface-tertiary text-small text-text-secondary hover:text-accent transition-colors cursor-pointer"
                      >
                        <span className="font-data text-text-muted">{index + 1}.</span>
                        <span>{section.title}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Sections du document */}
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {DOCUMENT_SECTIONS.filter((s) => enabledSections.has(s.id)).map((section) => (
                    <motion.div
                      key={section.id}
                      id={section.id}
                      variants={staggerItemVariants}
                      className={`group relative ${
                        activeSection === section.id ? 'ring-2 ring-accent/20 rounded-xl' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-h3 text-text-primary">{section.title}</h2>
                        <button
                          onClick={() => setToastMessage(`Regeneration de "${section.title}"...`)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-tertiary text-text-muted hover:text-accent text-small transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerer
                        </button>
                      </div>

                      <p className="text-body text-text-secondary leading-relaxed">{section.content}</p>

                      {section.chartPlaceholder && (
                        <div className="mt-4 h-32 bg-surface-tertiary rounded-xl border border-border-muted flex items-center justify-center">
                          <div className="flex items-center gap-2 text-text-muted">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-caption">[{section.chartPlaceholder}]</span>
                          </div>
                        </div>
                      )}

                      {section.risk && (
                        <div className="mt-4 space-y-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-small font-medium ${
                            RISK_LEVEL_CONFIG[section.risk.level].bgClass
                          } ${RISK_LEVEL_CONFIG[section.risk.level].textClass}`}>
                            {section.risk.label}
                          </div>
                          <div className="space-y-2">
                            {RISK_INDICATORS.map((risk) => {
                              const config = RISK_LEVEL_CONFIG[risk.level]
                              return (
                                <div key={risk.label} className="flex items-center gap-3 px-4 py-2.5 bg-surface-secondary rounded-lg">
                                  <span className="text-caption text-text-primary flex-1">{risk.label}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-medium ${config.bgClass} ${config.textClass}`}>
                                    {config.label}
                                  </span>
                                  <span className="text-small text-text-muted">{risk.description}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 bg-surface-inverse text-text-inverse px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3"
          >
            <span className="text-caption">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-text-inverse/60 hover:text-text-inverse cursor-pointer text-small"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
