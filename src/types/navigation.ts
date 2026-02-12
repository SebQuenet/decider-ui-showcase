export interface TabView {
  id: string
  label: string
  component: React.ComponentType
  group: 'chat' | 'contenu' | 'analyse' | 'finance' | 'attribution' | 'plateforme'
}

export interface TabGroup {
  id: string
  label: string
  tabs: TabView[]
}
