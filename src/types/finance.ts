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

// --- Fund Lifecycle ---

export type FundLifecyclePhase =
  | 'fundraising'
  | 'investment_period'
  | 'harvest'
  | 'extension'
  | 'liquidation'
  | 'terminated'

export type FundStrategy =
  | 'Buyout'
  | 'Venture Capital'
  | 'Growth'
  | 'Real Estate'
  | 'Infrastructure'
  | 'Private Debt'
  | 'Secondaries'
  | 'Fund of Funds'

export interface FundLifecycle {
  fundId: string
  name: string
  shortName: string
  phase: FundLifecyclePhase
  strategy: FundStrategy
  geography: string
  currency: string
  vintageYear: number
  fundTermYears: number
  investmentPeriodYears: number
  committed: number
  firstCloseDate: string
  finalCloseDate: string | null
  investmentPeriodEndDate: string | null
  expectedTermDate: string
  actualTermDate: string | null
  managementFeeRate: number
  carriedInterestRate: number
  preferredReturn: number
  legalStructure: string
  gpName: string
}

export type CashFlowType =
  | 'capital_call'
  | 'management_fee'
  | 'fund_expense'
  | 'return_of_capital'
  | 'capital_gain'
  | 'income_distribution'
  | 'recallable_distribution'

export interface FundCashFlow {
  id: string
  fundId: string
  date: string
  type: CashFlowType
  amount: number
  description: string
  isEstimate: boolean
}

export interface FundMetricSnapshot {
  fundId: string
  date: string
  calledAmount: number
  distributedAmount: number
  nav: number
  unfundedCommitment: number
  tvpiNet: number
  dpiNet: number
  rvpiNet: number
  irrNetInception: number
}

export type LifecycleEventType =
  | 'first_close'
  | 'final_close'
  | 'capital_call'
  | 'distribution'
  | 'exit'
  | 'investment_period_end'
  | 'extension'
  | 'key_person_event'
  | 'liquidation'

export interface FundLifecycleEvent {
  id: string
  fundId: string
  date: string
  type: LifecycleEventType
  label: string
  description: string
  amount?: number
}

export interface AllocationTarget {
  dimension: 'strategy' | 'geography' | 'vintage'
  category: string
  targetPct: number
  actualPct: number
  navAmount: number
  commitmentAmount: number
}
