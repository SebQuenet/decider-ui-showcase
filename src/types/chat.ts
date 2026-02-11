export type Role = 'user' | 'assistant' | 'system' | 'tool'

export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'error'

export interface Citation {
  id: string
  source: string
  page?: number
  text: string
  url?: string
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'pdf' | 'csv' | 'code' | 'document'
  size: number
  url: string
  previewUrl?: string
}

export interface ModelInfo {
  id: string
  name: string
  provider: string
  capabilities: string[]
  costPerToken?: number
  maxTokens: number
  description: string
}

export interface ThinkingBlock {
  id: string
  content: string
  durationMs: number
  isCollapsed: boolean
}

export interface Suggestion {
  id: string
  label: string
  prompt: string
}

export interface MessageBranch {
  id: string
  messages: Message[]
  createdAt: Date
}

export interface MessageMetadata {
  model?: ModelInfo
  tokensUsed?: number
  latencyMs?: number
  webSearchResults?: WebSearchResult[]
}

export interface WebSearchResult {
  title: string
  url: string
  snippet: string
  favicon?: string
}

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: Date
  status: MessageStatus
  metadata?: MessageMetadata
  attachments?: Attachment[]
  citations?: Citation[]
  thinking?: ThinkingBlock[]
  suggestions?: Suggestion[]
  branches?: MessageBranch[]
  currentBranchIndex?: number
  isEdited?: boolean
  feedback?: 'positive' | 'negative' | null
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isPinned?: boolean
  isArchived?: boolean
  folderId?: string
  model?: ModelInfo
  systemPrompt?: string
  tags?: string[]
}

export interface ConversationFolder {
  id: string
  name: string
  conversationIds: string[]
  isExpanded: boolean
}
