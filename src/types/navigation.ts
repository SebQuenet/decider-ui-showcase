export interface TabView {
  id: string
  label: string
  component: React.ComponentType
  group: 'general' | 'finance' | 'advanced'
}

export interface TabGroup {
  id: string
  label: string
  tabs: TabView[]
}
