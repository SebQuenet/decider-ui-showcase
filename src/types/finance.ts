export interface Fund {
  id: string
  name: string
  strategy: string
  vintage: number
  aum: number
  currency: string
  status: 'active' | 'closed' | 'fundraising'
  manager: string
  geography: string
  sector: string
  metrics: FundMetrics
}

export interface FundMetrics {
  irr: number
  tvpi: number
  dpi: number
  rvpi: number
  nav: number
  committed: number
  called: number
  distributed: number
  navHistory: { date: string; value: number }[]
}

export interface FinancialDocument {
  id: string
  name: string
  type:
    | 'prospectus'
    | 'factsheet'
    | 'reporting'
    | 'term_sheet'
    | 'financial_statement'
    | 'memo'
    | 'other'
  fundId: string
  uploadedAt: Date
  size: number
  pages: number
  indexed: boolean
  indexingProgress?: number
  tags: string[]
}

export interface DataRoom {
  id: string
  name: string
  fundId: string
  documents: FinancialDocument[]
  createdAt: Date
  status: 'importing' | 'indexing' | 'ready' | 'error'
}

export interface Alert {
  id: string
  type: 'nav' | 'threshold' | 'market' | 'press'
  title: string
  message: string
  severity: 'critical' | 'major' | 'minor' | 'info'
  fundId?: string
  createdAt: Date
  isRead: boolean
}

export interface Contradiction {
  id: string
  severity: 'critical' | 'major' | 'minor'
  sourceA: { document: string; page: number; text: string }
  sourceB: { document: string; page: number; text: string }
  description: string
  category: string
}

export interface ScorecardItem {
  category: string
  score: number
  maxScore: number
  weight: number
  details: string
}
