import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, AlertCircle, Info, Bell, Sun, ChevronDown,
  Eye, Clock, X, Plus, Mail, TrendingUp, Newspaper,
  Activity, CheckCircle2, Filter,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Toggle } from '../components/ui/Toggle.tsx'

// --- Types ---

type AlertSeverity = 'critical' | 'important' | 'info'
type AlertType = 'NAV' | 'Seuil' | 'Marché' | 'Presse'

interface Alert {
  id: string
  severity: AlertSeverity
  type: AlertType
  title: string
  message: string
  fund: string
  timestamp: string
  read: boolean
  fullMessage: string
  actions: string[]
}

interface AlertRule {
  id: string
  label: string
  active: boolean
}

interface MarketEvent {
  id: string
  time: string
  label: string
}

// --- Données mockées ---

const ALERTS: Alert[] = [
  { id: 'a1', severity: 'critical', type: 'NAV', title: 'Chute NAV Alpha Growth Fund III', message: 'La NAV a baissé de 7.2% sur les 5 derniers jours.', fund: 'Alpha Growth III', timestamp: 'Il y a 15 min', read: false, fullMessage: 'La valeur liquidative du fonds Alpha Growth Fund III a enregistré une baisse de 7.2% sur les 5 derniers jours ouvrés, passant de 142.30€ à 132.05€. Cette variation dépasse le seuil d\'alerte configuré de ±5%. Les principales causes identifiées sont la correction du secteur technologique (-8.3%) et la dépréciation de la livre sterling (-2.1%).', actions: ['Voir le fonds', 'Analyser l\'impact'] },
  { id: 'a2', severity: 'critical', type: 'Seuil', title: 'Seuil de concentration dépassé', message: 'L\'exposition au secteur tech dépasse 40% du portefeuille.', fund: 'Portefeuille Global', timestamp: 'Il y a 45 min', read: false, fullMessage: 'L\'exposition sectorielle au secteur technologique a atteint 42.3%, dépassant le seuil maximum autorisé de 40%. Cette surexposition est principalement liée à la surperformance relative des positions Eurotech Venture V et Digital Infra. Une réallocation est recommandée.', actions: ['Voir l\'allocation', 'Rééquilibrer'] },
  { id: 'a3', severity: 'critical', type: 'Marché', title: 'Volatilité exceptionnelle détectée', message: 'Le VIX a franchi le seuil de 30 points.', fund: 'Tous fonds', timestamp: 'Il y a 1h', read: false, fullMessage: 'L\'indice VIX a atteint 31.5 points, signalant une volatilité de marché exceptionnelle. Les marchés actions européens sont en baisse de 3.2% en moyenne. Impact estimé sur le portefeuille : -1.8% à -2.5%.', actions: ['Voir le marché', 'Stress test'] },
  { id: 'a4', severity: 'important', type: 'NAV', title: 'NAV Beta Credit Opps en hausse', message: 'La NAV a progressé de 3.1% ce mois-ci.', fund: 'Beta Credit', timestamp: 'Il y a 2h', read: false, fullMessage: 'Performance mensuelle positive de 3.1% pour le fonds Beta Credit Opportunities, surpassant le benchmark de 1.4%. Les moteurs principaux sont le resserrement des spreads HY (-25bps) et les positions en dettes d\'infrastructure.', actions: ['Voir le fonds'] },
  { id: 'a5', severity: 'important', type: 'Presse', title: 'Article négatif - GP Iberia Real Estate', message: 'Mention presse négative détectée dans El País.', fund: 'Iberia RE II', timestamp: 'Il y a 3h', read: true, fullMessage: 'Un article publié dans El País mentionne des difficultés de refinancement pour plusieurs projets immobiliers commerciaux gérés par le GP Iberia Real Estate Partners. L\'article cite des sources bancaires évoquant un taux de vacance de 18% sur le portefeuille madrilène.', actions: ['Voir l\'article', 'Contacter le GP'] },
  { id: 'a6', severity: 'important', type: 'Seuil', title: 'Appel de fonds imminent', message: 'US Buyout Fund XI : appel de fonds de 15M€ prévu le 20/02.', fund: 'US Buyout XI', timestamp: 'Il y a 4h', read: true, fullMessage: 'Un appel de fonds de 15M€ est prévu pour le 20 février 2026 par US Buyout Fund XI. Cela représente 12.5% de l\'engagement total de 120M€. Liquidités disponibles actuelles : 45M€.', actions: ['Voir les liquidités'] },
  { id: 'a7', severity: 'important', type: 'Marché', title: 'Décision BCE - Taux directeur', message: 'La BCE maintient ses taux à 3.25%, conforme aux attentes.', fund: 'Tous fonds', timestamp: 'Il y a 5h', read: true, fullMessage: 'La BCE a maintenu son taux directeur à 3.25% lors de sa réunion du 10 février. Le communiqué suggère une possible baisse de 25bps au T2 2026 si l\'inflation continue à ralentir. Impact modéré sur le portefeuille obligataire.', actions: ['Analyse impact'] },
  { id: 'a8', severity: 'info', type: 'NAV', title: 'Mise à jour NAV trimestrielle', message: 'Nordic Infra Partners a publié sa NAV Q4 2025.', fund: 'Nordic Infra', timestamp: 'Il y a 6h', read: true, fullMessage: 'La NAV Q4 2025 de Nordic Infra Partners s\'établit à 108.5, en hausse de 2.1% sur le trimestre. La performance est portée par les actifs éoliens nordiques.', actions: ['Voir le rapport'] },
  { id: 'a9', severity: 'info', type: 'Presse', title: 'Interview GP Asia PE Fund', message: 'Interview du gérant dans le Financial Times.', fund: 'Asia PE VII', timestamp: 'Hier', read: true, fullMessage: 'Le gérant principal de Asia PE Fund VII a accordé une interview au Financial Times, soulignant les opportunités dans le secteur de la consommation chinoise post-restrictions.', actions: ['Voir l\'article'] },
  { id: 'a10', severity: 'info', type: 'Marché', title: 'Rapport FMI publié', message: 'Nouvelles perspectives économiques mondiales pour 2026.', fund: 'Tous fonds', timestamp: 'Hier', read: true, fullMessage: 'Le FMI a publié ses perspectives actualisées : croissance mondiale à 3.1%, zone euro à 1.4%, US à 2.2%. Les risques baissiers incluent les tensions géopolitiques et l\'inflation persistante dans les services.', actions: ['Voir le rapport'] },
  { id: 'a11', severity: 'info', type: 'Seuil', title: 'Rebalancement automatique effectué', message: 'Le portefeuille a été rééquilibré selon les règles définies.', fund: 'Portefeuille Global', timestamp: 'Hier', read: true, fullMessage: 'Le rebalancement trimestriel automatique a été exécuté. 3 positions ont été ajustées pour revenir dans les bornes d\'allocation cibles. Coût de transaction estimé : 12K€.', actions: ['Voir le détail'] },
  { id: 'a12', severity: 'info', type: 'Presse', title: 'Classement PEI 300 publié', message: 'Impact Health Fund I entre dans le top 50 des fonds impact.', fund: 'Impact Health I', timestamp: 'Il y a 2j', read: true, fullMessage: 'Le classement PEI 300 de 2026 positionne Impact Health Fund I au 47e rang des fonds d\'impact mondiaux, en progression de 15 places par rapport à 2025.', actions: ['Voir le classement'] },
]

const ALERT_RULES: AlertRule[] = [
  { id: 'r1', label: 'NAV > ±5% sur 30 jours', active: true },
  { id: 'r2', label: 'Nouveau document data room', active: true },
  { id: 'r3', label: 'Mention presse négative', active: true },
  { id: 'r4', label: 'Appel de fonds > 10M€', active: false },
  { id: 'r5', label: 'Concentration sectorielle > 35%', active: true },
]

const MARKET_EVENTS: MarketEvent[] = [
  { id: 'e1', time: '09:00', label: 'Ouverture marchés européens' },
  { id: 'e2', time: '10:30', label: 'Publication PMI manufacturier' },
  { id: 'e3', time: '14:30', label: 'Données emploi US' },
  { id: 'e4', time: '15:30', label: 'Ouverture Wall Street' },
  { id: 'e5', time: '20:00', label: 'Minutes FOMC' },
]

const BRIEFING_POINTS = [
  'Les marchés européens ouvrent en baisse de 0.8% après la correction asiatique.',
  'Le VIX remonte à 28 points, signalant une nervosité accrue.',
  'L\'euro se stabilise à 1.085 face au dollar, la BCE maintient ses taux.',
  'Les flux sortants des fonds equity atteignent 2.1Md€ cette semaine.',
]

const FUND_BRIEFING = [
  { fund: 'Alpha Growth III', status: 'NAV -7.2%', variant: 'danger' as const },
  { fund: 'Beta Credit', status: 'NAV +3.1%', variant: 'success' as const },
  { fund: 'Nordic Infra', status: 'NAV Q4 publiée', variant: 'info' as const },
  { fund: 'Iberia RE II', status: 'Presse négative', variant: 'warning' as const },
  { fund: 'US Buyout XI', status: 'RAS', variant: 'default' as const },
]

const TYPE_ICONS: Record<AlertType, typeof TrendingUp> = {
  NAV: TrendingUp,
  Seuil: Activity,
  Marché: AlertCircle,
  Presse: Newspaper,
}

const SEVERITY_STYLES: Record<AlertSeverity, { border: string; bg: string; icon: typeof AlertTriangle; iconColor: string }> = {
  critical: { border: 'border-l-red-500', bg: '', icon: AlertTriangle, iconColor: 'text-danger' },
  important: { border: 'border-l-yellow-500', bg: '', icon: AlertCircle, iconColor: 'text-warning' },
  info: { border: 'border-l-blue-500', bg: '', icon: Info, iconColor: 'text-info' },
}

const ALL_TYPES: AlertType[] = ['NAV', 'Seuil', 'Marché', 'Presse']
const ALL_SEVERITIES: AlertSeverity[] = ['critical', 'important', 'info']
const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  critical: 'Critique',
  important: 'Important',
  info: 'Info',
}

// --- Composant principal ---

export function AlertsExperiment() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [rules, setRules] = useState(ALERT_RULES)
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [activeTypes, setActiveTypes] = useState<Set<AlertType>>(new Set(ALL_TYPES))
  const [activeSeverities, setActiveSeverities] = useState<Set<AlertSeverity>>(new Set(ALL_SEVERITIES))
  const [showBriefing, setShowBriefing] = useState(true)
  const [showNewRule, setShowNewRule] = useState(false)

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const importantCount = alerts.filter((a) => a.severity === 'important').length
  const infoCount = alerts.filter((a) => a.severity === 'info').length

  const filteredAlerts = alerts.filter(
    (a) => activeTypes.has(a.type) && activeSeverities.has(a.severity),
  )

  function handleToggleType(type: AlertType): void {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  function handleToggleSeverity(severity: AlertSeverity): void {
    setActiveSeverities((prev) => {
      const next = new Set(prev)
      if (next.has(severity)) {
        next.delete(severity)
      } else {
        next.add(severity)
      }
      return next
    })
  }

  function handleMarkRead(alertId: string): void {
    setAlerts((prev) =>
      prev.map((a) => a.id === alertId ? { ...a, read: true } : a),
    )
  }

  function handleDismiss(alertId: string): void {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }

  function handleToggleRule(ruleId: string): void {
    setRules((prev) =>
      prev.map((r) => r.id === ruleId ? { ...r, active: !r.active } : r),
    )
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Panneau gauche - Dashboard */}
      <div className="flex-[65] flex flex-col min-w-0 border-r border-border">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-glacier-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-body font-semibold text-text-primary">Alertes</h2>
              <p className="text-small text-text-muted">Surveillance en temps réel</p>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-surface-secondary">
          <SummaryBadge count={criticalCount} label="Critiques" variant="danger" pulse />
          <SummaryBadge count={importantCount} label="Importantes" variant="warning" />
          <SummaryBadge count={infoCount} label="Info" variant="info" />
          <div className="ml-auto text-small text-text-muted">{alerts.length} Total</div>
        </div>

        {/* Briefing */}
        <AnimatePresence>
          {showBriefing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border"
            >
              <div className="px-6 py-4 bg-warning-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-warning" />
                    <span className="text-caption font-semibold text-text-primary">Briefing du 11 février 2026</span>
                  </div>
                  <button
                    onClick={() => setShowBriefing(false)}
                    className="p-1 rounded hover:bg-surface-secondary cursor-pointer"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {BRIEFING_POINTS.map((point) => (
                    <li key={point} className="text-small text-text-secondary flex items-start gap-2">
                      <span className="text-warning mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {FUND_BRIEFING.map((fund) => (
                    <Badge key={fund.fund} variant={fund.variant} size="sm">
                      {fund.fund}: {fund.status}
                    </Badge>
                  ))}
                </div>
                <button className="text-small text-accent font-medium mt-2 hover:underline cursor-pointer">
                  Voir le rapport complet →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtres */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border">
          <Filter className="w-4 h-4 text-text-muted" />
          {ALL_TYPES.map((type) => {
            const TypeIcon = TYPE_ICONS[type]
            return (
              <button
                key={type}
                onClick={() => handleToggleType(type)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-small font-medium transition-colors cursor-pointer border ${
                  activeTypes.has(type)
                    ? 'bg-accent-muted text-accent border-accent/30'
                    : 'text-text-muted border-border hover:bg-surface-secondary'
                }`}
              >
                <TypeIcon className="w-3.5 h-3.5" />
                {type}
              </button>
            )
          })}
          <div className="h-4 w-px bg-border mx-1" />
          {ALL_SEVERITIES.map((severity) => (
            <button
              key={severity}
              onClick={() => handleToggleSeverity(severity)}
              className={`px-2.5 py-1 rounded-full text-small font-medium transition-colors cursor-pointer border ${
                activeSeverities.has(severity)
                  ? 'bg-surface-tertiary text-text-primary border-border'
                  : 'text-text-muted border-transparent hover:bg-surface-secondary'
              }`}
            >
              {SEVERITY_LABELS[severity]}
            </button>
          ))}
        </div>

        {/* Liste d'alertes */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isExpanded={expandedAlert === alert.id}
                onToggle={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                onMarkRead={() => handleMarkRead(alert.id)}
                onDismiss={() => handleDismiss(alert.id)}
              />
            ))}
          </AnimatePresence>
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-caption">Aucune alerte ne correspond aux filtres.</p>
            </div>
          )}
        </div>
      </div>

      {/* Panneau droit - Configuration */}
      <div className="flex-[35] flex flex-col min-w-0 bg-surface-secondary">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-caption font-semibold text-text-primary">Configuration</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Règles actives */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-small font-semibold text-text-primary">Règles d'alertes</span>
              <button
                onClick={() => setShowNewRule(!showNewRule)}
                className="flex items-center gap-1 text-small text-accent font-medium hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouvelle règle
              </button>
            </div>

            <AnimatePresence>
              {showNewRule && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
                    <select className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-primary">
                      <option>Type : NAV</option>
                      <option>Type : Seuil</option>
                      <option>Type : Marché</option>
                      <option>Type : Presse</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Seuil (ex: ±5%)"
                      className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-primary placeholder:text-text-muted"
                    />
                    <select className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-primary">
                      <option>Fonds : Tous</option>
                      <option>Alpha Growth III</option>
                      <option>Beta Credit</option>
                      <option>Nordic Infra</option>
                    </select>
                    <select className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-primary">
                      <option>Sévérité : Critique</option>
                      <option>Sévérité : Important</option>
                      <option>Sévérité : Info</option>
                    </select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setShowNewRule(false)}>Créer</Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowNewRule(false)}>Annuler</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between bg-surface rounded-lg border border-border px-3 py-2">
                  <span className="text-small text-text-primary">{rule.label}</span>
                  <Toggle checked={rule.active} onChange={() => handleToggleRule(rule.id)} />
                </div>
              ))}
            </div>
          </div>

          {/* Digest hebdomadaire */}
          <div>
            <span className="text-small font-semibold text-text-primary">Digest hebdomadaire</span>
            <div className="mt-2 bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-caption font-medium text-text-primary">Résumé semaine 06</span>
              </div>
              <div className="space-y-2 text-small text-text-secondary">
                <p>3 alertes critiques traitées</p>
                <p>7 alertes importantes, 4 résolues</p>
                <p>Performance portefeuille : +0.8%</p>
                <p>Prochain comité : 18/02/2026</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-small text-text-muted">Envoyé chaque lundi à 8h00</span>
              </div>
            </div>
          </div>

          {/* Timeline événements marché */}
          <div>
            <span className="text-small font-semibold text-text-primary">Événements du jour</span>
            <div className="mt-2 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-3">
                {MARKET_EVENTS.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 relative pl-7">
                    <div className="absolute left-1.5 w-3 h-3 rounded-full bg-surface-tertiary border-2 border-border" />
                    <span className="text-small font-mono text-text-muted w-12 shrink-0">{event.time}</span>
                    <span className="text-small text-text-secondary">{event.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sous-composants ---

function SummaryBadge({
  count,
  label,
  variant,
  pulse = false,
}: {
  count: number
  label: string
  variant: 'danger' | 'warning' | 'info'
  pulse?: boolean
}) {
  const bgColors: Record<string, string> = {
    danger: 'bg-danger-muted',
    warning: 'bg-warning-muted',
    info: 'bg-info-muted',
  }
  const textColors: Record<string, string> = {
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
  }
  const solidBgColors: Record<string, string> = {
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${bgColors[variant]}`}>
      {pulse && (
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColors[variant]} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${solidBgColors[variant]}`} />
        </span>
      )}
      <span className={`text-body font-bold ${textColors[variant]}`}>{count}</span>
      <span className={`text-small ${textColors[variant]}`}>{label}</span>
    </div>
  )
}

function AlertCard({
  alert,
  isExpanded,
  onToggle,
  onMarkRead,
  onDismiss,
}: {
  alert: Alert
  isExpanded: boolean
  onToggle: () => void
  onMarkRead: () => void
  onDismiss: () => void
}) {
  const style = SEVERITY_STYLES[alert.severity]
  const SeverityIcon = style.icon
  const TypeIcon = TYPE_ICONS[alert.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`bg-surface border border-border border-l-4 ${style.border} rounded-lg ${
        !alert.read ? 'ring-1 ring-accent/20' : ''
      }`}
    >
      <button onClick={onToggle} className="w-full text-left px-4 py-3 cursor-pointer">
        <div className="flex items-start gap-3">
          <SeverityIcon className={`w-5 h-5 ${style.iconColor} shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-caption font-semibold text-text-primary">{alert.title}</span>
              {!alert.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
            </div>
            <p className="text-small text-text-secondary">{alert.message}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="default" size="sm">
                <TypeIcon className="w-3 h-3 mr-1" />
                {alert.type}
              </Badge>
              <Badge variant="accent" size="sm">{alert.fund}</Badge>
              <span className="text-small text-text-muted ml-auto">{alert.timestamp}</span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-2 border-t border-border space-y-3">
              <p className="text-small text-text-secondary leading-relaxed">{alert.fullMessage}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {alert.actions.map((action) => (
                  <Button key={action} variant="secondary" size="sm">
                    <Eye className="w-3.5 h-3.5" />
                    {action}
                  </Button>
                ))}
                <div className="ml-auto flex gap-2">
                  {!alert.read && (
                    <Button variant="ghost" size="sm" onClick={onMarkRead}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Lu
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={onDismiss}>
                    <Clock className="w-3.5 h-3.5" />
                    Snooze
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onDismiss}>
                    <X className="w-3.5 h-3.5" />
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
