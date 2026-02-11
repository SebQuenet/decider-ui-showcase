import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Shield, Search, Download, EyeOff,
  CheckCircle2, MessageSquare, ChevronDown, ChevronRight,
  FileText, XCircle, Clock, Activity,
} from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants, smoothTransition } from '../lib/animations'

// --- Types ---

type Severity = 'critical' | 'major' | 'minor'
type Category = 'Financier' | 'Juridique' | 'Operationnel'
type AnalysisStep = 'idle' | 'intra' | 'cross' | 'press' | 'report' | 'done'

interface Contradiction {
  id: string
  severity: Severity
  category: Category
  description: string
  sourceA: { document: string; page: number; text: string; highlight: string }
  sourceB: { document: string; page: number; text: string; highlight: string }
  discrepancy: string
  resolved: boolean
}

// --- Constantes ---

const SEVERITY_CONFIG: Record<Severity, { label: string; bgClass: string; textClass: string; badgeClass: string }> = {
  critical: {
    label: 'Critique',
    bgClass: 'bg-danger-muted',
    textClass: 'text-danger',
    badgeClass: 'bg-danger text-white',
  },
  major: {
    label: 'Majeur',
    bgClass: 'bg-warning-muted',
    textClass: 'text-warning',
    badgeClass: 'bg-warning text-white',
  },
  minor: {
    label: 'Mineur',
    bgClass: 'bg-glacier-100',
    textClass: 'text-glacier-700',
    badgeClass: 'bg-glacier-500 text-white',
  },
}

const ANALYSIS_STEPS = [
  { id: 'intra' as const, label: 'Analyse intra-documents' },
  { id: 'cross' as const, label: 'Cross-documents' },
  { id: 'press' as const, label: 'Verification presse' },
  { id: 'report' as const, label: 'Generation rapport' },
]

const MOCK_CONTRADICTIONS: Contradiction[] = [
  {
    id: '1',
    severity: 'critical',
    category: 'Financier',
    description: 'Ecart significatif sur le TRI annonce',
    sourceA: {
      document: 'Prospectus_FondsAlpha_2024.pdf',
      page: 12,
      text: 'Le fonds Alpha Capital a genere un taux de rendement interne (TRI) net de frais de 15.2% sur la periode 2019-2024, surperformant significativement le benchmark de reference.',
      highlight: 'TRI net de frais de 15.2%',
    },
    sourceB: {
      document: 'Reporting_Q4_2024.pdf',
      page: 3,
      text: 'Performance du portefeuille : le TRI net s\'etablit a 12.8% depuis inception, en ligne avec les objectifs de gestion mais en retrait par rapport aux projections initiales.',
      highlight: 'TRI net s\'etablit a 12.8%',
    },
    discrepancy: 'Prospectus: IRR 15.2% vs Reporting: IRR 12.8% (delta 2.4%)',
    resolved: false,
  },
  {
    id: '2',
    severity: 'critical',
    category: 'Juridique',
    description: 'Clause de lock-up contradictoire',
    sourceA: {
      document: 'Term_Sheet_v3.pdf',
      page: 5,
      text: 'La periode de lock-up est fixee a 36 mois a compter de la date de souscription. Aucune sortie anticipee n\'est autorisee durant cette periode.',
      highlight: 'lock-up est fixee a 36 mois',
    },
    sourceB: {
      document: 'PPM_Final.pdf',
      page: 28,
      text: 'Les investisseurs beneficient d\'une periode de lock-up de 24 mois, avec possibilite de sortie anticipee sous reserve d\'un preavis de 90 jours et d\'une penalite de 2%.',
      highlight: 'lock-up de 24 mois',
    },
    discrepancy: 'Term Sheet: 36 mois sans sortie vs PPM: 24 mois avec sortie anticipee',
    resolved: false,
  },
  {
    id: '3',
    severity: 'major',
    category: 'Financier',
    description: 'Incoherence sur les frais de gestion',
    sourceA: {
      document: 'Prospectus_FondsAlpha_2024.pdf',
      page: 18,
      text: 'Les frais de gestion annuels s\'elevent a 1.75% de l\'actif net, preleves trimestriellement. Ces frais couvrent l\'ensemble des services de gestion.',
      highlight: 'frais de gestion annuels s\'elevent a 1.75%',
    },
    sourceB: {
      document: 'Side_Letter_InvestisseurA.pdf',
      page: 2,
      text: 'A titre derogatoire, les frais de gestion applicables sont fixes a 1.25% de l\'actif net pour tout engagement superieur a 10M EUR.',
      highlight: 'frais de gestion applicables sont fixes a 1.25%',
    },
    discrepancy: 'Prospectus: 1.75% vs Side Letter: 1.25% (reduction non documentee)',
    resolved: false,
  },
  {
    id: '4',
    severity: 'major',
    category: 'Operationnel',
    description: 'Divergence sur la taille de l\'equipe de gestion',
    sourceA: {
      document: 'DDQ_2024.pdf',
      page: 8,
      text: 'L\'equipe de gestion est composee de 12 professionnels de l\'investissement, dont 4 partners seniors avec plus de 15 ans d\'experience.',
      highlight: '12 professionnels de l\'investissement',
    },
    sourceB: {
      document: 'Article_LesEchos_Nov2024.html',
      page: 1,
      text: 'Suite aux departs recents, l\'equipe d\'Alpha Capital ne compte plus que 8 gerants, suscitant des interrogations parmi les investisseurs institutionnels.',
      highlight: 'ne compte plus que 8 gerants',
    },
    discrepancy: 'DDQ: 12 professionnels vs Presse: 8 gerants (4 departs non signales)',
    resolved: false,
  },
  {
    id: '5',
    severity: 'major',
    category: 'Financier',
    description: 'Ecart sur le ratio de levier',
    sourceA: {
      document: 'Reporting_Q4_2024.pdf',
      page: 7,
      text: 'Le ratio de levier du portefeuille est maintenu a 1.2x, conforme aux limites definies dans la documentation juridique.',
      highlight: 'ratio de levier du portefeuille est maintenu a 1.2x',
    },
    sourceB: {
      document: 'Audit_Ernst_2024.pdf',
      page: 15,
      text: 'Le levier consolide du fonds, incluant les structures SPV, atteint 2.1x au 31 decembre 2024.',
      highlight: 'levier consolide du fonds atteint 2.1x',
    },
    discrepancy: 'Reporting: 1.2x vs Audit: 2.1x (SPV non consolides)',
    resolved: false,
  },
  {
    id: '6',
    severity: 'major',
    category: 'Juridique',
    description: 'Changement de depositaire non notifie',
    sourceA: {
      document: 'PPM_Final.pdf',
      page: 34,
      text: 'Le depositaire designe est BNP Paribas Securities Services, charge de la conservation des actifs.',
      highlight: 'depositaire designe est BNP Paribas',
    },
    sourceB: {
      document: 'Reporting_Q4_2024.pdf',
      page: 1,
      text: 'Depositaire: Societe Generale Securities Services. Administrateur: Alter Domus.',
      highlight: 'Depositaire: Societe Generale',
    },
    discrepancy: 'PPM: BNP Paribas vs Reporting: Societe Generale (changement non notifie)',
    resolved: false,
  },
  {
    id: '7',
    severity: 'minor',
    category: 'Operationnel',
    description: 'Date de creation du fonds inconsistante',
    sourceA: {
      document: 'Factsheet_Janv2025.pdf',
      page: 1,
      text: 'Fonds Alpha Capital - Vintage 2019. Date de creation : 15 mars 2019.',
      highlight: 'Date de creation : 15 mars 2019',
    },
    sourceB: {
      document: 'Registre_Commerce.pdf',
      page: 1,
      text: 'Immatriculation de la societe Alpha Capital SLP au registre du commerce le 28 juin 2019.',
      highlight: 'Immatriculation le 28 juin 2019',
    },
    discrepancy: 'Factsheet: Mars 2019 vs RCS: Juin 2019 (3 mois d\'ecart)',
    resolved: false,
  },
  {
    id: '8',
    severity: 'minor',
    category: 'Financier',
    description: 'Arrondi NAV divergent entre documents',
    sourceA: {
      document: 'Reporting_Q4_2024.pdf',
      page: 2,
      text: 'La valeur liquidative (NAV) au 31/12/2024 s\'etablit a 142.3 M EUR.',
      highlight: 'NAV au 31/12/2024 s\'etablit a 142.3 M EUR',
    },
    sourceB: {
      document: 'Lettre_Investisseurs_Q4.pdf',
      page: 3,
      text: 'La NAV du fonds atteint 143.1 M EUR a fin decembre 2024, en hausse de 8.2% sur l\'annee.',
      highlight: 'NAV du fonds atteint 143.1 M EUR',
    },
    discrepancy: 'Reporting: 142.3 M vs Lettre: 143.1 M (delta 0.8 M EUR)',
    resolved: false,
  },
]

const FUNDS = ['Fonds Alpha Capital', 'Fonds Beta Growth', 'Fonds Gamma Income']

// --- Composant principal ---

export function ContradictionsExperiment(): React.ReactNode {
  const [selectedFund, setSelectedFund] = useState(FUNDS[0])
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('idle')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [contradictions, setContradictions] = useState<Contradiction[]>([])
  const [severityFilter, setSeverityFilter] = useState<Set<Severity>>(new Set(['critical', 'major', 'minor']))
  const [expandedContradiction, setExpandedContradiction] = useState<string | null>(null)
  const [showDueDiligence, setShowDueDiligence] = useState(false)

  const summaryCount = {
    critical: contradictions.filter((c) => c.severity === 'critical').length,
    major: contradictions.filter((c) => c.severity === 'major').length,
    minor: contradictions.filter((c) => c.severity === 'minor').length,
    total: contradictions.length,
  }

  const filteredContradictions = contradictions.filter((c) => severityFilter.has(c.severity))

  const launchAnalysis = useCallback(() => {
    setAnalysisStep('intra')
    setAnalysisProgress(0)
    setContradictions([])

    const steps: AnalysisStep[] = ['intra', 'cross', 'press', 'report', 'done']
    const durations = [1200, 1500, 1000, 800]

    let currentStep = 0
    let elapsed = 0
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0)

    function advanceStep(): void {
      if (currentStep >= durations.length) {
        setAnalysisStep('done')
        setAnalysisProgress(100)
        setContradictions(MOCK_CONTRADICTIONS)
        return
      }

      setAnalysisStep(steps[currentStep])
      const stepDuration = durations[currentStep]
      const startProgress = (elapsed / totalDuration) * 100
      const endProgress = ((elapsed + stepDuration) / totalDuration) * 100

      let frame = 0
      const totalFrames = stepDuration / 50

      const interval = setInterval(() => {
        frame++
        const progress = startProgress + (endProgress - startProgress) * (frame / totalFrames)
        setAnalysisProgress(Math.min(progress, 100))

        if (frame >= totalFrames) {
          clearInterval(interval)
          elapsed += stepDuration
          currentStep++
          advanceStep()
        }
      }, 50)
    }

    advanceStep()
  }, [])

  function toggleSeverityFilter(severity: Severity): void {
    setSeverityFilter((previous) => {
      const next = new Set(previous)
      if (next.has(severity)) {
        if (next.size > 1) next.delete(severity)
      } else {
        next.add(severity)
      }
      return next
    })
  }

  function markResolved(contradictionId: string): void {
    setContradictions((previous) =>
      previous.map((c) => (c.id === contradictionId ? { ...c, resolved: true } : c)),
    )
  }

  function handleIgnore(contradictionId: string): void {
    setContradictions((previous) => previous.filter((c) => c.id !== contradictionId))
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
          <h1 className="text-h4 text-text-primary">Detection de Contradictions</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFund}
            onChange={(event) => setSelectedFund(event.target.value)}
            className="px-3 py-2 bg-surface rounded-lg border border-border text-small text-text-primary cursor-pointer outline-none"
          >
            {FUNDS.map((fund) => (
              <option key={fund} value={fund}>{fund}</option>
            ))}
          </select>
          <button
            onClick={launchAnalysis}
            disabled={analysisStep !== 'idle' && analysisStep !== 'done'}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            Lancer l'analyse
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Stepper d'analyse */}
          <AnimatePresence>
            {analysisStep !== 'idle' && analysisStep !== 'done' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={smoothTransition}
                className="border-b border-border overflow-hidden"
              >
                <div className="px-6 py-4 bg-surface-secondary">
                  <div className="flex items-center gap-8 mb-3">
                    {ANALYSIS_STEPS.map((step) => {
                      const stepIndex = ANALYSIS_STEPS.findIndex((s) => s.id === step.id)
                      const currentIndex = ANALYSIS_STEPS.findIndex((s) => s.id === analysisStep)
                      let status: 'done' | 'active' | 'pending'
                      if (stepIndex < currentIndex) {
                        status = 'done'
                      } else if (stepIndex === currentIndex) {
                        status = 'active'
                      } else {
                        status = 'pending'
                      }

                      return (
                        <div key={step.id} className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-small font-medium ${
                            status === 'done'
                              ? 'bg-success text-white'
                              : status === 'active'
                                ? 'bg-accent text-white'
                                : 'bg-surface-tertiary text-text-muted'
                          }`}>
                            {status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepIndex + 1}
                          </div>
                          <span className={`text-small ${
                            status === 'active' ? 'text-text-primary font-medium' : 'text-text-muted'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cartes de resume */}
          {analysisStep === 'done' && (
            <div className="px-6 py-4 border-b border-border">
              <div className="flex gap-4">
                {([
                  { key: 'critical' as const, label: 'Critiques', count: summaryCount.critical, bgClass: 'bg-danger-muted', textClass: 'text-danger' },
                  { key: 'major' as const, label: 'Majeures', count: summaryCount.major, bgClass: 'bg-warning-muted', textClass: 'text-warning' },
                  { key: 'minor' as const, label: 'Mineures', count: summaryCount.minor, bgClass: 'bg-glacier-100', textClass: 'text-glacier-700' },
                  { key: 'total' as const, label: 'Total', count: summaryCount.total, bgClass: 'bg-surface-tertiary', textClass: 'text-text-primary' },
                ] as const).map((item) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex-1 rounded-xl px-4 py-3 ${item.bgClass}`}
                  >
                    <div className={`text-h2 font-bold font-data ${item.textClass}`}>{item.count}</div>
                    <div className="text-small text-text-secondary">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-small text-text-muted">Filtrer :</span>
                {(['critical', 'major', 'minor'] as const).map((severity) => {
                  const config = SEVERITY_CONFIG[severity]
                  const isActive = severityFilter.has(severity)
                  return (
                    <button
                      key={severity}
                      onClick={() => toggleSeverityFilter(severity)}
                      className={`px-3 py-1 rounded-full text-small font-medium transition-colors cursor-pointer ${
                        isActive
                          ? `${config.bgClass} ${config.textClass}`
                          : 'bg-surface-tertiary text-text-muted'
                      }`}
                    >
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Liste des contradictions */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {analysisStep === 'idle' && (
              <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
                <Shield className="w-12 h-12 text-text-muted/30" />
                <p className="text-body">Selectionnez un fonds et lancez l'analyse</p>
              </div>
            )}

            {analysisStep === 'done' && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="p-6 space-y-4"
              >
                {filteredContradictions.map((contradiction) => {
                  const config = SEVERITY_CONFIG[contradiction.severity]
                  const isExpanded = expandedContradiction === contradiction.id

                  return (
                    <motion.div
                      key={contradiction.id}
                      variants={staggerItemVariants}
                      className={`bg-surface rounded-xl border border-border shadow-sm overflow-hidden ${
                        contradiction.resolved ? 'opacity-60' : ''
                      }`}
                    >
                      <button
                        onClick={() => setExpandedContradiction(isExpanded ? null : contradiction.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-secondary/50 transition-colors text-left"
                      >
                        <ChevronRight className={`w-4 h-4 text-text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                        <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-semibold ${config.badgeClass}`}>
                          {config.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-tertiary text-text-secondary text-[0.625rem] font-medium">
                          {contradiction.category}
                        </span>
                        <span className="text-caption font-medium text-text-primary flex-1 truncate">
                          {contradiction.description}
                        </span>
                        {contradiction.resolved && (
                          <span className="px-2 py-0.5 rounded-full bg-success-muted text-success text-[0.625rem] font-medium">
                            Resolu
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-glacier-50 border border-glacier-200 p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-3.5 h-3.5 text-glacier-600" />
                                    <span className="text-small font-medium text-glacier-700">{contradiction.sourceA.document}</span>
                                    <span className="text-[0.625rem] text-glacier-500">p. {contradiction.sourceA.page}</span>
                                  </div>
                                  <p className="text-small text-text-secondary leading-relaxed">
                                    {contradiction.sourceA.text}
                                  </p>
                                </div>
                                <div className="rounded-lg bg-danger-muted border border-danger/20 p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-3.5 h-3.5 text-danger" />
                                    <span className="text-small font-medium text-danger">{contradiction.sourceB.document}</span>
                                    <span className="text-[0.625rem] text-danger/60">p. {contradiction.sourceB.page}</span>
                                  </div>
                                  <p className="text-small text-text-secondary leading-relaxed">
                                    {contradiction.sourceB.text}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 px-3 py-2 bg-warning-muted rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                                <span className="text-small font-medium text-warning">{contradiction.discrepancy}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleIgnore(contradiction.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-tertiary text-text-secondary hover:text-text-primary text-small transition-colors cursor-pointer"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                  Ignorer
                                </button>
                                <button
                                  onClick={() => markResolved(contradiction.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-muted text-success text-small transition-colors cursor-pointer hover:opacity-80"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Marquer resolu
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-tertiary text-text-secondary hover:text-text-primary text-small transition-colors cursor-pointer">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Ajouter commentaire
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Panel Express Due Diligence */}
        {analysisStep === 'done' && (
          <div className="w-80 border-l border-border bg-surface-secondary flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-border">
              <button
                onClick={() => setShowDueDiligence(!showDueDiligence)}
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <h2 className="text-caption font-semibold text-text-primary">Express Due Diligence</h2>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showDueDiligence ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
              {/* Score de risque */}
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-small text-text-secondary mb-2">Score de Risque Global</div>
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e9ecef" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#d97706" strokeWidth="8"
                      strokeDasharray={`${62 * 2.51} ${100 * 2.51}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-h3 font-bold text-warning font-data">62</span>
                  </div>
                </div>
                <div className="text-small font-medium text-warning">Risque Modere</div>
              </div>

              {/* Findings cles */}
              <div className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-small font-semibold text-text-primary mb-3">Constats cles</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: XCircle, text: 'Ecart TRI significatif entre documents', severity: 'text-danger' },
                    { icon: AlertTriangle, text: 'Clauses juridiques contradictoires', severity: 'text-warning' },
                    { icon: Clock, text: 'Donnees d\'equipe potentiellement obsoletes', severity: 'text-warning' },
                    { icon: Activity, text: 'Levier non consolide sous-estime', severity: 'text-danger' },
                  ].map((finding, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <finding.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${finding.severity}`} />
                      <span className="text-small text-text-secondary leading-tight">{finding.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume executif */}
              <div className="bg-surface rounded-xl border border-border p-4">
                <h3 className="text-small font-semibold text-text-primary mb-3">Resume executif</h3>
                <p className="text-small text-text-secondary leading-relaxed">
                  L'analyse de la data room du {selectedFund} revele {summaryCount.total} contradictions
                  dont {summaryCount.critical} critiques necessitant une attention immediate.
                  Les ecarts les plus preoccupants concernent les metriques de performance et les
                  dispositions juridiques. Une verification approfondie est recommandee avant toute
                  decision d'investissement.
                </p>
              </div>

              {/* Export */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium">
                <Download className="w-4 h-4" />
                Exporter le rapport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
