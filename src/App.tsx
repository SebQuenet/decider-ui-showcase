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
import { RealEstateAttributionExperiment } from './experiments/RealEstateAttributionExperiment'
import { MatrixExperiment } from './experiments/MatrixExperiment'
import { ChartChatExperiment } from './experiments/ChartChatExperiment'
import { DataStorytellingExperiment } from './experiments/DataStorytellingExperiment'
import type { TabView } from './types/navigation'

const TABS: TabView[] = [
  // Chat — l'expérience conversationnelle core
  { id: 'chain-of-thought', label: 'Chain of Thought', component: ChainOfThoughtExperiment, group: 'chat' },
  { id: 'streaming', label: 'Streaming', component: ChatStreamingExperiment, group: 'chat' },
  { id: 'interactions', label: 'Interactions IA', component: InteractionsExperiment, group: 'chat' },
  { id: 'composition', label: 'Composition', component: CompositionExperiment, group: 'chat' },
  { id: 'demo', label: 'Chat Démo', component: DemoChat, group: 'chat' },

  // Contenu — artifacts et création
  { id: 'code', label: 'Code', component: CodeExperiment, group: 'contenu' },
  { id: 'canvas', label: 'Canvas', component: CanvasExperiment, group: 'contenu' },
  { id: 'websearch', label: 'Recherche Web', component: WebSearchExperiment, group: 'contenu' },
  { id: 'images', label: 'Images', component: ImagesExperiment, group: 'contenu' },

  // Analyse — données et intelligence analytique
  { id: 'matrix', label: 'Matrix', component: MatrixExperiment, group: 'analyse' },
  { id: 'chart-chat', label: 'Chat Graphiques', component: ChartChatExperiment, group: 'analyse' },
  { id: 'data-storytelling', label: 'Data Storytelling', component: DataStorytellingExperiment, group: 'analyse' },
  { id: 'dataviz', label: 'Dataviz', component: DatavizExperiment, group: 'analyse' },
  { id: 'interrogation', label: 'Interrogation', component: InterrogationExperiment, group: 'analyse' },
  { id: 'comparison', label: 'Comparaison', component: ComparisonExperiment, group: 'analyse' },
  { id: 'contradictions', label: 'Contradictions', component: ContradictionsExperiment, group: 'analyse' },

  // Finance — métier PE/AM
  { id: 'finance-home', label: 'Accueil Finance', component: FinanceHomeExperiment, group: 'finance' },
  { id: 'datarooms', label: 'Data Rooms', component: DataRoomsExperiment, group: 'finance' },
  { id: 'documents', label: 'Documents', component: DocumentsExperiment, group: 'finance' },
  { id: 'scoring', label: 'Scoring', component: ScoringExperiment, group: 'finance' },
  { id: 'attribution-immo', label: 'Attribution Immo', component: RealEstateAttributionExperiment, group: 'finance' },
  { id: 'workflows', label: 'Workflows', component: WorkflowsExperiment, group: 'finance' },
  { id: 'alerts', label: 'Alertes', component: AlertsExperiment, group: 'finance' },

  // Plateforme — configuration et transverse
  { id: 'home', label: 'Accueil', component: HomeScreenExperiment, group: 'plateforme' },
  { id: 'sidebar', label: 'Sidebar', component: SidebarExperiment, group: 'plateforme' },
  { id: 'models', label: 'Modèles', component: ModelsExperiment, group: 'plateforme' },
  { id: 'personalization', label: 'Personnalisation', component: PersonalizationExperiment, group: 'plateforme' },
  { id: 'collaboration', label: 'Collaboration', component: CollaborationExperiment, group: 'plateforme' },
  { id: 'security', label: 'Sécurité', component: SecurityExperiment, group: 'plateforme' },
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
