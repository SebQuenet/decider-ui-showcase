import type { ModelInfo } from '../types/chat.ts'

export const mockModels: ModelInfo[] = [
  {
    id: 'decider-pro',
    name: 'Decider Pro',
    provider: 'Decider AI',
    capabilities: ['text', 'reasoning', 'code', 'analysis', 'web-search'],
    costPerToken: 0.00003,
    maxTokens: 200000,
    description:
      'Modele phare avec raisonnement avance et capacites multi-domaines.',
  },
  {
    id: 'decider-flash',
    name: 'Decider Flash',
    provider: 'Decider AI',
    capabilities: ['text', 'code', 'analysis'],
    costPerToken: 0.000005,
    maxTokens: 128000,
    description:
      'Modele rapide et economique pour les taches courantes.',
  },
  {
    id: 'decider-finance',
    name: 'Decider Finance',
    provider: 'Decider AI',
    capabilities: [
      'text',
      'financial-analysis',
      'document-parsing',
      'compliance',
      'risk-assessment',
    ],
    costPerToken: 0.00005,
    maxTokens: 200000,
    description:
      'Specialise dans l\'analyse financiere, le parsing de documents et la conformite reglementaire.',
  },
  {
    id: 'decider-vision',
    name: 'Decider Vision',
    provider: 'Decider AI',
    capabilities: ['text', 'image-analysis', 'ocr', 'chart-reading', 'document-parsing'],
    costPerToken: 0.00004,
    maxTokens: 128000,
    description:
      'Analyse d\'images, OCR et lecture de graphiques avec comprehension visuelle avancee.',
  },
  {
    id: 'decider-code',
    name: 'Decider Code',
    provider: 'Decider AI',
    capabilities: [
      'code-generation',
      'code-review',
      'debugging',
      'refactoring',
      'testing',
    ],
    costPerToken: 0.00002,
    maxTokens: 64000,
    description:
      'Optimise pour la generation, l\'analyse et le refactoring de code.',
  },
]
