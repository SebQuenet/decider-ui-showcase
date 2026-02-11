import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Kanban, ChevronDown, ChevronRight, Bell, Clock,
  CheckCircle2, Circle, AlertTriangle, ArrowRight, X,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Avatar } from '../components/ui/Avatar.tsx'
import { ProgressBar } from '../components/ui/ProgressBar.tsx'

// --- Types ---

interface PipelineCard {
  id: string
  name: string
  amount: string
  date: string
  assignee: string
  priority: 'Haute' | 'Moyenne' | 'Basse'
  status: 'on-track' | 'attention' | 'retard'
  column: string
  description: string
  metrics: string[]
  nextSteps: string
}

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  role: string
  dueDate: string
  status: 'todo' | 'in-progress' | 'done' | 'blocked'
  priority: 'Haute' | 'Moyenne' | 'Basse'
  checklist: { label: string; done: boolean }[]
}

interface Decision {
  id: string
  date: string
  title: string
  outcome: 'Approuvé' | 'Rejeté' | 'En attente'
  participants: string[]
  summary: string
  minutes: string
  votes: { pour: number; contre: number; abstention: number }
  conditions: string
}

interface Notification {
  id: string
  message: string
  time: string
  read: boolean
}

// --- Données mockées ---

const COLUMNS = ['Sourcing', 'Due Diligence', 'Comité', 'Négociation', 'Closing']

const PIPELINE_CARDS: PipelineCard[] = [
  { id: 'p1', name: 'Alpha Growth Fund III', amount: '45M€', date: '15/01/2026', assignee: 'Sophie L.', priority: 'Haute', status: 'on-track', column: 'Sourcing', description: 'Fonds de croissance mid-cap européen, focus technologie et santé.', metrics: ['TRI cible: 18%', 'Multiple: 2.5x', 'Durée: 7 ans'], nextSteps: 'Première rencontre GP prévue le 20/02' },
  { id: 'p2', name: 'Nordic Infra Partners', amount: '80M€', date: '08/01/2026', assignee: 'Marc D.', priority: 'Moyenne', status: 'attention', column: 'Sourcing', description: 'Infrastructure nordique, énergie renouvelable et transport.', metrics: ['TRI cible: 12%', 'Yield: 6%', 'Durée: 12 ans'], nextSteps: 'Demande de data room en cours' },
  { id: 'p3', name: 'Eurotech Venture V', amount: '25M€', date: '20/12/2025', assignee: 'Élodie R.', priority: 'Haute', status: 'on-track', column: 'Due Diligence', description: 'Venture capital early-stage, deep tech et IA.', metrics: ['TRI cible: 25%', 'Multiple: 3.5x', 'Portefeuille: 20-25 sociétés'], nextSteps: 'Analyse des frais en cours, revue juridique planifiée' },
  { id: 'p4', name: 'Iberia Real Estate II', amount: '60M€', date: '05/12/2025', assignee: 'Sophie L.', priority: 'Basse', status: 'retard', column: 'Due Diligence', description: 'Immobilier commercial Espagne et Portugal.', metrics: ['TRI cible: 14%', 'LTV: 55%', 'Durée: 8 ans'], nextSteps: 'Attente documents fiscaux du GP' },
  { id: 'p5', name: 'Global Credit Opps IV', amount: '100M€', date: '15/11/2025', assignee: 'Marc D.', priority: 'Haute', status: 'on-track', column: 'Due Diligence', description: 'Crédit alternatif, stratégie opportuniste global.', metrics: ['Yield cible: 9%', 'Duration: 3.5 ans', 'Spread: +450bps'], nextSteps: 'Call avec le risk manager prévu le 12/02' },
  { id: 'p6', name: 'Asia PE Fund VII', amount: '50M€', date: '01/11/2025', assignee: 'Élodie R.', priority: 'Moyenne', status: 'on-track', column: 'Comité', description: 'Private equity Asie-Pacifique, focus consommation.', metrics: ['TRI cible: 20%', 'Multiple: 2.8x', 'Vintage: 2026'], nextSteps: 'Présentation comité le 18/02' },
  { id: 'p7', name: 'Green Energy Trans. III', amount: '35M€', date: '20/10/2025', assignee: 'Sophie L.', priority: 'Haute', status: 'attention', column: 'Comité', description: 'Transition énergétique, infrastructure verte européenne.', metrics: ['TRI cible: 15%', 'Impact: Article 9', 'Durée: 10 ans'], nextSteps: 'Questions complémentaires du comité en cours' },
  { id: 'p8', name: 'US Buyout Fund XI', amount: '120M€', date: '01/10/2025', assignee: 'Marc D.', priority: 'Moyenne', status: 'on-track', column: 'Négociation', description: 'Buyout large-cap US, stratégie sectorielle diversifiée.', metrics: ['TRI cible: 16%', 'Multiple: 2.2x', 'Commitment: 120M€'], nextSteps: 'Side letter en négociation, closing prévu Q1 2026' },
  { id: 'p9', name: 'Secondary Opps Fund V', amount: '40M€', date: '15/09/2025', assignee: 'Élodie R.', priority: 'Basse', status: 'on-track', column: 'Négociation', description: 'Fonds de secondaires, décote sur NAV.', metrics: ['Décote: 12%', 'Multiple: 1.6x', 'J-curve: limitée'], nextSteps: 'Finalisation des termes cette semaine' },
  { id: 'p10', name: 'Impact Health Fund I', amount: '30M€', date: '01/09/2025', assignee: 'Sophie L.', priority: 'Haute', status: 'on-track', column: 'Closing', description: 'Impact investing, santé et accès aux soins.', metrics: ['TRI cible: 13%', 'Impact score: A+', 'SDGs: 3, 10'], nextSteps: 'Signature finale prévue le 28/02' },
  { id: 'p11', name: 'Digital Infra Co-Inv', amount: '15M€', date: '20/08/2025', assignee: 'Marc D.', priority: 'Moyenne', status: 'on-track', column: 'Closing', description: 'Co-investissement data centers Europe.', metrics: ['Multiple cible: 2.0x', 'EBITDA margin: 45%', 'Capex: complété'], nextSteps: 'Documentation juridique en revue finale' },
]

const TASKS: Task[] = [
  { id: 't1', title: 'Analyse des frais Eurotech V', description: 'Revue détaillée de la structure de frais et carried interest.', assignee: 'Sophie L.', role: 'Analyste', dueDate: '14/02/2026', status: 'in-progress', priority: 'Haute', checklist: [{ label: 'Management fees', done: true }, { label: 'Carried interest waterfall', done: true }, { label: 'Frais de transaction', done: false }, { label: 'Clawback provisions', done: false }, { label: 'Comparaison peer group', done: false }] },
  { id: 't2', title: 'Revue juridique Asia PE VII', description: 'Analyse du LPA et des side letters.', assignee: 'Marc D.', role: 'Senior', dueDate: '16/02/2026', status: 'todo', priority: 'Haute', checklist: [{ label: 'LPA review', done: false }, { label: 'Side letter négociation', done: false }, { label: 'Compliance check', done: false }] },
  { id: 't3', title: 'Due diligence opérationnelle Global Credit', description: 'Évaluation des processus opérationnels et du risk management.', assignee: 'Élodie R.', role: 'Manager', dueDate: '18/02/2026', status: 'in-progress', priority: 'Moyenne', checklist: [{ label: 'Processus investissement', done: true }, { label: 'Risk management', done: true }, { label: 'Valorisation', done: false }, { label: 'Reporting', done: false }] },
  { id: 't4', title: 'Modèle financier Nordic Infra', description: 'Construction du modèle de cash flows et sensibilités.', assignee: 'Sophie L.', role: 'Analyste', dueDate: '20/02/2026', status: 'todo', priority: 'Moyenne', checklist: [{ label: 'Hypothèses macro', done: false }, { label: 'Cash flow projections', done: false }, { label: 'Sensibilités', done: false }, { label: 'Comparaison scénarios', done: false }] },
  { id: 't5', title: 'Rapport ESG Green Energy III', description: 'Évaluation de la politique ESG et de l\'impact.', assignee: 'Marc D.', role: 'Senior', dueDate: '12/02/2026', status: 'done', priority: 'Haute', checklist: [{ label: 'Politique ESG', done: true }, { label: 'Mesure d\'impact', done: true }, { label: 'Reporting SFDR', done: true }] },
  { id: 't6', title: 'Background check GP Iberia RE', description: 'Vérification des références et track record du GP.', assignee: 'Élodie R.', role: 'Manager', dueDate: '10/02/2026', status: 'blocked', priority: 'Haute', checklist: [{ label: 'Références investisseurs', done: true }, { label: 'Track record vérifié', done: false }, { label: 'Conflits d\'intérêts', done: false }] },
  { id: 't7', title: 'Analyse de marché US Buyout', description: 'Revue du marché buyout US et positionnement du fonds.', assignee: 'Sophie L.', role: 'Analyste', dueDate: '22/02/2026', status: 'in-progress', priority: 'Basse', checklist: [{ label: 'Taille du marché', done: true }, { label: 'Concurrence', done: false }, { label: 'Tendances', done: false }] },
  { id: 't8', title: 'Préparer mémo comité Asia PE', description: 'Rédaction du mémo de recommandation pour le comité.', assignee: 'Marc D.', role: 'Senior', dueDate: '17/02/2026', status: 'todo', priority: 'Haute', checklist: [{ label: 'Executive summary', done: false }, { label: 'Analyse détaillée', done: false }, { label: 'Recommandation', done: false }, { label: 'Annexes', done: false }] },
]

const DECISIONS: Decision[] = [
  { id: 'd1', date: '05/02/2026', title: 'Engagement Green Energy Transition III', outcome: 'Approuvé', participants: ['Élodie R.', 'Marc D.', 'Sophie L.', 'Dir. Investissement', 'Dir. Risques'], summary: 'Le comité a approuvé un engagement de 35M€ sous conditions.', minutes: 'Après présentation du mémo et discussion des risques, le comité valide l\'engagement. Le track record du GP et l\'alignement Article 9 sont des points forts.', votes: { pour: 4, contre: 0, abstention: 1 }, conditions: 'Obtention de la side letter sur les droits de co-investissement et plafonnement des frais de transaction à 1%.' },
  { id: 'd2', date: '22/01/2026', title: 'Engagement US Buyout Fund XI', outcome: 'Approuvé', participants: ['Élodie R.', 'Marc D.', 'Dir. Investissement', 'Dir. Risques', 'DG'], summary: 'Engagement de 120M€ approuvé à l\'unanimité.', minutes: 'Le GP présente un track record exceptionnel sur les 4 derniers vintages. La diversification sectorielle et la taille du fonds justifient l\'allocation.', votes: { pour: 5, contre: 0, abstention: 0 }, conditions: 'Négociation d\'une MFN side letter et reporting trimestriel détaillé.' },
  { id: 'd3', date: '10/01/2026', title: 'Engagement Iberia Real Estate II', outcome: 'Rejeté', participants: ['Élodie R.', 'Sophie L.', 'Dir. Investissement', 'Dir. Risques'], summary: 'Le comité a rejeté l\'engagement en raison de risques macro.', minutes: 'Les risques liés au marché immobilier ibérique et le manque de transparence du GP sur les valorisations ont conduit au rejet. Le comité recommande de suivre le fonds pour un éventuel ré-examen en cas d\'amélioration.', votes: { pour: 1, contre: 3, abstention: 0 }, conditions: '' },
  { id: 'd4', date: '18/02/2026', title: 'Engagement Asia PE Fund VII', outcome: 'En attente', participants: ['Élodie R.', 'Marc D.', 'Sophie L.', 'Dir. Investissement'], summary: 'Présentation prévue au prochain comité.', minutes: 'Le mémo est en préparation. Des questions complémentaires ont été soulevées sur l\'exposition au marché chinois et les risques réglementaires.', votes: { pour: 0, contre: 0, abstention: 0 }, conditions: 'Analyse complémentaire de l\'exposition géographique requise.' },
]

const COMMITTEE_STEPS = ['Pré-comité', 'Comité', 'Post-comité', 'Validation finale']

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', message: 'Sophie a terminé la tâche "Analyse des frais Eurotech V"', time: 'Il y a 2h', read: false },
  { id: 'n2', message: 'Comité d\'investissement prévu le 18/02/2026', time: 'Il y a 4h', read: false },
  { id: 'n3', message: 'Marc a ajouté un commentaire sur "US Buyout Fund XI"', time: 'Hier', read: true },
  { id: 'n4', message: 'Nouvelle version du LPA reçue pour Asia PE Fund VII', time: 'Hier', read: false },
  { id: 'n5', message: 'Élodie a validé le rapport ESG Green Energy III', time: 'Il y a 2j', read: true },
  { id: 'n6', message: 'Deadline approche : Background check GP Iberia RE (10/02)', time: 'Il y a 2j', read: true },
]

const INNER_TABS = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'tasks', label: 'Tâches DD' },
  { id: 'decisions', label: 'Décisions' },
]

const STATUS_COLORS: Record<string, string> = {
  'on-track': 'border-l-green-500',
  attention: 'border-l-yellow-500',
  retard: 'border-l-red-500',
}

const PRIORITY_VARIANTS: Record<string, 'danger' | 'warning' | 'default'> = {
  Haute: 'danger',
  Moyenne: 'warning',
  Basse: 'default',
}

const TASK_STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'info' | 'success' | 'danger' }> = {
  todo: { label: 'À faire', variant: 'default' },
  'in-progress': { label: 'En cours', variant: 'info' },
  done: { label: 'Terminé', variant: 'success' },
  blocked: { label: 'Bloqué', variant: 'danger' },
}

const TASK_FILTERS = ['Mes tâches', 'Équipe', 'Toutes'] as const

const OUTCOME_VARIANTS: Record<string, 'success' | 'danger' | 'warning'> = {
  'Approuvé': 'success',
  'Rejeté': 'danger',
  'En attente': 'warning',
}

const OUTCOME_DOT_COLORS: Record<string, string> = {
  'Approuvé': 'bg-success',
  'Rejeté': 'bg-danger',
  'En attente': 'bg-warning',
}

// --- Composant principal ---

export function WorkflowsExperiment() {
  const [activeTab, setActiveTab] = useState('pipeline')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<string>('Toutes')
  const [tasks, setTasks] = useState(TASKS)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [committeeStep] = useState(1)

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleMarkNotificationRead(notificationId: string): void {
    setNotifications((prev) =>
      prev.map((n) => n.id === notificationId ? { ...n, read: true } : n),
    )
  }

  function handleToggleChecklistItem(taskId: string, itemIndex: number): void {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        const updatedChecklist = task.checklist.map((item, index) =>
          index === itemIndex ? { ...item, done: !item.done } : item,
        )
        return { ...task, checklist: updatedChecklist }
      }),
    )
  }

  function getFilteredTasks(): Task[] {
    if (taskFilter === 'Mes tâches') return tasks.filter((t) => t.assignee === 'Sophie L.')
    if (taskFilter === 'Équipe') return tasks.filter((t) => t.status !== 'done')
    return tasks
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-glacier-600 flex items-center justify-center">
            <Kanban className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Workflows</h2>
            <p className="text-small text-text-muted">Pipeline, tâches & décisions</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tabs
            tabs={INNER_TABS}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            layoutId="workflows-tabs"
          />

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-surface border border-border rounded-lg shadow-xl z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-caption font-semibold text-text-primary">Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded hover:bg-surface-secondary cursor-pointer"
                    >
                      <X className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleMarkNotificationRead(notification.id)}
                        className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-surface-secondary transition-colors cursor-pointer ${
                          notification.read ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!notification.read && (
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                          )}
                          <div>
                            <p className="text-small text-text-primary">{notification.message}</p>
                            <p className="text-small text-text-muted mt-0.5">{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'pipeline' && (
          <PipelineView
            expandedCard={expandedCard}
            onToggleCard={(id) => setExpandedCard(expandedCard === id ? null : id)}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksView
            tasks={getFilteredTasks()}
            filter={taskFilter}
            onFilterChange={setTaskFilter}
            expandedTask={expandedTask}
            onToggleTask={(id) => setExpandedTask(expandedTask === id ? null : id)}
            onToggleChecklist={handleToggleChecklistItem}
          />
        )}
        {activeTab === 'decisions' && (
          <DecisionsView
            committeeStep={committeeStep}
            expandedDecision={expandedDecision}
            onToggleDecision={(id) => setExpandedDecision(expandedDecision === id ? null : id)}
          />
        )}
      </div>
    </div>
  )
}

// --- Pipeline ---

function PipelineView({
  expandedCard,
  onToggleCard,
}: {
  expandedCard: string | null
  onToggleCard: (id: string) => void
}) {
  return (
    <div className="h-full overflow-x-auto p-4">
      <div className="flex gap-4 h-full min-w-max">
        {COLUMNS.map((column) => {
          const cards = PIPELINE_CARDS.filter((c) => c.column === column)
          return (
            <div key={column} className="w-72 flex flex-col bg-surface-secondary rounded-lg shrink-0">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                <span className="text-caption font-semibold text-text-primary">{column}</span>
                <Badge variant="accent" size="sm">{cards.length}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {cards.map((card) => (
                  <PipelineCardView
                    key={card.id}
                    card={card}
                    isExpanded={expandedCard === card.id}
                    onToggle={() => onToggleCard(card.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PipelineCardView({
  card,
  isExpanded,
  onToggle,
}: {
  card: PipelineCard
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      className={`bg-surface rounded-lg border border-border border-l-4 ${STATUS_COLORS[card.status]} shadow-sm hover:shadow-md transition-shadow cursor-grab`}
    >
      <button onClick={onToggle} className="w-full text-left p-3 cursor-pointer">
        <div className="flex items-start justify-between mb-1.5">
          <span className="text-caption font-semibold text-text-primary leading-tight">{card.name}</span>
          <Badge variant={PRIORITY_VARIANTS[card.priority]} size="sm">{card.priority}</Badge>
        </div>
        <div className="flex items-center gap-2 text-small text-text-muted">
          <span className="font-medium text-text-secondary">{card.amount}</span>
          <span>·</span>
          <span>{card.date}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Avatar name={card.assignee} size="sm" />
          <span className="text-small text-text-secondary">{card.assignee}</span>
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
            <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
              <p className="text-small text-text-secondary">{card.description}</p>
              <div className="space-y-1">
                {card.metrics.map((metric) => (
                  <div key={metric} className="text-small text-text-muted flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    {metric}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-small text-accent">
                <ArrowRight className="w-3 h-3" />
                {card.nextSteps}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Tâches DD ---

function TasksView({
  tasks,
  filter,
  onFilterChange,
  expandedTask,
  onToggleTask,
  onToggleChecklist,
}: {
  tasks: Task[]
  filter: string
  onFilterChange: (filter: string) => void
  expandedTask: string | null
  onToggleTask: (id: string) => void
  onToggleChecklist: (taskId: string, itemIndex: number) => void
}) {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        {TASK_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1.5 rounded-lg text-small font-medium transition-colors cursor-pointer ${
              filter === f
                ? 'bg-accent-muted text-accent'
                : 'text-text-muted hover:bg-surface-secondary'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-small text-text-muted">{tasks.length} tâche(s)</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCardView
              key={task.id}
              task={task}
              isExpanded={expandedTask === task.id}
              onToggle={() => onToggleTask(task.id)}
              onToggleChecklist={onToggleChecklist}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TaskCardView({
  task,
  isExpanded,
  onToggle,
  onToggleChecklist,
}: {
  task: Task
  isExpanded: boolean
  onToggle: () => void
  onToggleChecklist: (taskId: string, itemIndex: number) => void
}) {
  const doneCount = task.checklist.filter((item) => item.done).length
  const totalCount = task.checklist.length
  const statusInfo = TASK_STATUS_LABELS[task.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-surface border border-border rounded-lg"
    >
      <button onClick={onToggle} className="w-full text-left p-4 cursor-pointer">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold text-text-primary">{task.title}</span>
            <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
            <Badge variant={PRIORITY_VARIANTS[task.priority]} size="sm">{task.priority}</Badge>
          </div>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-small text-text-muted mb-2">{task.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar name={task.assignee} size="sm" />
            <span className="text-small text-text-secondary">{task.assignee}</span>
            <span className="text-small text-text-muted">({task.role})</span>
          </div>
          <div className="flex items-center gap-1 text-small text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            {task.dueDate}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-small text-text-muted">{doneCount}/{totalCount}</span>
            <div className="w-24">
              <ProgressBar value={doneCount} max={totalCount} />
            </div>
          </div>
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
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-2">
              {task.checklist.map((item, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer group">
                  <button
                    onClick={() => onToggleChecklist(task.id, index)}
                    className="cursor-pointer"
                  >
                    {item.done
                      ? <CheckCircle2 className="w-4 h-4 text-success" />
                      : <Circle className="w-4 h-4 text-text-muted group-hover:text-accent" />
                    }
                  </button>
                  <span className={`text-small ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Décisions ---

function DecisionsView({
  committeeStep,
  expandedDecision,
  onToggleDecision,
}: {
  committeeStep: number
  expandedDecision: string | null
  onToggleDecision: (id: string) => void
}) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex items-center gap-2 bg-surface-secondary rounded-lg p-3">
        {COMMITTEE_STEPS.map((step, index) => {
          const isActive = index === committeeStep
          const isDone = index < committeeStep

          let stepStyle = 'bg-surface-tertiary text-text-muted'
          if (isDone) stepStyle = 'bg-success text-white'
          else if (isActive) stepStyle = 'bg-accent text-white'

          return (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-semibold shrink-0 ${stepStyle}`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-small font-medium ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                {step}
              </span>
              {index < COMMITTEE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${isDone ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {DECISIONS.map((decision) => {
            const outcomeVariant = OUTCOME_VARIANTS[decision.outcome]
            const isExpanded = expandedDecision === decision.id

            return (
              <motion.div
                key={decision.id}
                layout
                className="relative pl-10"
              >
                <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 border-surface ${OUTCOME_DOT_COLORS[decision.outcome]}`} />

                <div className="bg-surface border border-border rounded-lg">
                  <button onClick={() => onToggleDecision(decision.id)} className="w-full text-left p-4 cursor-pointer">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="text-small text-text-muted">{decision.date}</span>
                        <h4 className="text-caption font-semibold text-text-primary">{decision.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={outcomeVariant}>{decision.outcome}</Badge>
                        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <p className="text-small text-text-secondary mb-2">{decision.summary}</p>
                    <div className="flex items-center gap-1">
                      {decision.participants.slice(0, 3).map((participant) => (
                        <Avatar key={participant} name={participant} size="sm" />
                      ))}
                      {decision.participants.length > 3 && (
                        <span className="text-small text-text-muted ml-1">
                          +{decision.participants.length - 3}
                        </span>
                      )}
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
                        <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                          <div>
                            <span className="text-small font-medium text-text-primary">Compte-rendu</span>
                            <p className="text-small text-text-secondary mt-1">{decision.minutes}</p>
                          </div>

                          {decision.votes.pour + decision.votes.contre + decision.votes.abstention > 0 && (
                            <div className="flex items-center gap-4">
                              <span className="text-small font-medium text-text-primary">Votes :</span>
                              <Badge variant="success">Pour : {decision.votes.pour}</Badge>
                              <Badge variant="danger">Contre : {decision.votes.contre}</Badge>
                              <Badge variant="default">Abstention : {decision.votes.abstention}</Badge>
                            </div>
                          )}

                          {decision.conditions && (
                            <div className="flex items-start gap-2 bg-warning-muted rounded-lg p-3">
                              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                              <div>
                                <span className="text-small font-medium text-warning">Conditions</span>
                                <p className="text-small text-text-secondary">{decision.conditions}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
