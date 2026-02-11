import { useState, useMemo } from 'react'
import { TabNavigation } from './components/TabNavigation'
import { DemoChat } from './experiments/DemoChat'
import { ChatStreamingExperiment } from './experiments/ChatStreamingExperiment'
import { InteractionsExperiment } from './experiments/InteractionsExperiment'
import { CompositionExperiment } from './experiments/CompositionExperiment'
import { SidebarExperiment } from './experiments/SidebarExperiment'
import { ModelsExperiment } from './experiments/ModelsExperiment'
import { WebSearchExperiment } from './experiments/WebSearchExperiment'
import { ImagesExperiment } from './experiments/ImagesExperiment'
import { CodeExperiment } from './experiments/CodeExperiment'
import { CanvasExperiment } from './experiments/CanvasExperiment'
import { HomeScreenExperiment } from './experiments/HomeScreenExperiment'
import { PersonalizationExperiment } from './experiments/PersonalizationExperiment'
import { DataRoomsExperiment } from './experiments/DataRoomsExperiment'
import { InterrogationExperiment } from './experiments/InterrogationExperiment'
import { ComparisonExperiment } from './experiments/ComparisonExperiment'
import { DatavizExperiment } from './experiments/DatavizExperiment'
import { ContradictionsExperiment } from './experiments/ContradictionsExperiment'
import { DocumentsExperiment } from './experiments/DocumentsExperiment'
import { ScoringExperiment } from './experiments/ScoringExperiment'
import { FinanceHomeExperiment } from './experiments/FinanceHomeExperiment'
import { WorkflowsExperiment } from './experiments/WorkflowsExperiment'
import { AlertsExperiment } from './experiments/AlertsExperiment'
import { CollaborationExperiment } from './experiments/CollaborationExperiment'
import { SecurityExperiment } from './experiments/SecurityExperiment'
import { ChainOfThoughtExperiment } from './experiments/ChainOfThoughtExperiment'
import type { TabView } from './types/navigation'

const TABS: TabView[] = [
  // Général
  { id: 'demo', label: 'Chat Démo', component: DemoChat, group: 'general' },
  { id: 'streaming', label: 'Streaming', component: ChatStreamingExperiment, group: 'general' },
  { id: 'interactions', label: 'Interactions IA', component: InteractionsExperiment, group: 'general' },
  { id: 'composition', label: 'Composition', component: CompositionExperiment, group: 'general' },
  { id: 'sidebar', label: 'Sidebar', component: SidebarExperiment, group: 'general' },
  { id: 'models', label: 'Modèles', component: ModelsExperiment, group: 'general' },
  { id: 'websearch', label: 'Recherche Web', component: WebSearchExperiment, group: 'general' },
  { id: 'images', label: 'Images', component: ImagesExperiment, group: 'general' },
  { id: 'code', label: 'Code', component: CodeExperiment, group: 'general' },
  { id: 'canvas', label: 'Canvas', component: CanvasExperiment, group: 'general' },
  { id: 'home', label: 'Accueil', component: HomeScreenExperiment, group: 'general' },
  { id: 'personalization', label: 'Personnalisation', component: PersonalizationExperiment, group: 'general' },
  { id: 'collaboration', label: 'Collaboration', component: CollaborationExperiment, group: 'general' },
  { id: 'chain-of-thought', label: 'Chain of Thought', component: ChainOfThoughtExperiment, group: 'general' },

  // Finance
  { id: 'finance-home', label: 'Accueil Finance', component: FinanceHomeExperiment, group: 'finance' },
  { id: 'datarooms', label: 'Data Rooms', component: DataRoomsExperiment, group: 'finance' },
  { id: 'interrogation', label: 'Interrogation', component: InterrogationExperiment, group: 'finance' },
  { id: 'comparison', label: 'Comparaison', component: ComparisonExperiment, group: 'finance' },
  { id: 'dataviz', label: 'Dataviz', component: DatavizExperiment, group: 'finance' },
  { id: 'contradictions', label: 'Contradictions', component: ContradictionsExperiment, group: 'finance' },
  { id: 'documents', label: 'Documents', component: DocumentsExperiment, group: 'finance' },
  { id: 'scoring', label: 'Scoring', component: ScoringExperiment, group: 'finance' },
  { id: 'workflows', label: 'Workflows', component: WorkflowsExperiment, group: 'finance' },

  // Avancé
  { id: 'alerts', label: 'Alertes', component: AlertsExperiment, group: 'advanced' },
  { id: 'security', label: 'Sécurité', component: SecurityExperiment, group: 'advanced' },
]

export default function App() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id)

  const tabInstances = useMemo(
    () => TABS.map((tab) => ({ id: tab.id, Component: tab.component })),
    [],
  )

  return (
    <div className="h-screen bg-surface-secondary flex flex-col">
      <header className="shrink-0 flex justify-center pt-4 px-4 relative z-10">
        <TabNavigation
          tabs={TABS}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />
      </header>

      <main className="flex-1 min-h-0 p-4 overflow-hidden">
        {tabInstances.map(({ id, Component }) => (
          <div
            key={id}
            className={`h-full ${id === activeTabId ? 'block' : 'hidden'}`}
          >
            <Component />
          </div>
        ))}
      </main>
    </div>
  )
}
