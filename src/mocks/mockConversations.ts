import type { Conversation, Message } from '../types/chat.ts'

import { mockModels } from './mockModels.ts'

const deciderPro = mockModels[0]
const deciderFinance = mockModels[2]

function createMessage(
  overrides: Partial<Message> & Pick<Message, 'role' | 'content'>,
  index: number,
): Message {
  return {
    id: `msg-${overrides.role}-${index}`,
    timestamp: new Date(2024, 5, 15, 10, index * 2),
    status: 'complete',
    ...overrides,
  }
}

const genericMessages: Message[] = [
  createMessage(
    {
      role: 'user',
      content: 'Peux-tu m\'expliquer les principales differences entre REST et GraphQL ?',
    },
    0,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## REST vs GraphQL

**REST** utilise des endpoints multiples, chacun retournant une structure fixe. Le client recoit parfois plus de donnees que necessaire (over-fetching) ou doit faire plusieurs requetes (under-fetching).

**GraphQL** expose un seul endpoint. Le client specifie exactement les champs souhaites dans sa requete, ce qui elimine l'over-fetching et permet de recuperer des donnees de plusieurs ressources en une seule requete.

### Points cles

| Critere | REST | GraphQL |
|---------|------|---------|
| Endpoints | Multiples | Unique |
| Structure reponse | Fixe | Flexible |
| Cache | HTTP natif | Plus complexe |
| Courbe d'apprentissage | Faible | Moderee |`,
      metadata: {
        model: deciderPro,
        tokensUsed: 245,
        latencyMs: 1200,
      },
      suggestions: [
        { id: 'sug-1', label: 'Exemples concrets', prompt: 'Montre-moi des exemples concrets de requetes REST vs GraphQL' },
        { id: 'sug-2', label: 'Performance', prompt: 'Lequel est le plus performant pour une application mobile ?' },
      ],
    },
    1,
  ),
  createMessage(
    {
      role: 'user',
      content: 'Lequel recommandes-tu pour une API interne avec beaucoup de relations entre entites ?',
    },
    2,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `Pour une API interne avec des relations complexes, **GraphQL est generalement le meilleur choix** :

1. **Requetes imbriquees** : recuperez un utilisateur avec ses projets, equipes et permissions en une seule requete
2. **Schema type** : le schema sert de documentation vivante pour les equipes internes
3. **Evolution sans versionning** : ajoutez des champs sans casser les clients existants

\`\`\`graphql
query {
  user(id: "123") {
    name
    projects {
      title
      team { name }
    }
  }
}
\`\`\`

Cependant, prevoyez un mecanisme de **dataloading** (ex: DataLoader) pour eviter le probleme N+1 sur les requetes imbriquees.`,
      metadata: {
        model: deciderPro,
        tokensUsed: 310,
        latencyMs: 1850,
      },
    },
    3,
  ),
]

const fundAnalysisMessages: Message[] = [
  createMessage(
    {
      role: 'user',
      content: 'Analyse la performance du Alpha Growth Fund sur les 12 derniers mois.',
    },
    0,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## Analyse de performance - Alpha Growth Fund

### Metriques cles
- **IRR** : 18.5% (au-dessus du benchmark PE a 14.2%)
- **TVPI** : 1.65x
- **DPI** : 0.42x (distributions en cours)
- **NAV** : 612 M EUR

### Observations

Le fonds affiche une **performance superieure au quartile superieur** de sa categorie. La NAV a progresse de maniere reguliere avec une volatilite limitee, coherente avec une strategie PE buy-out.

Le ratio DPI/TVPI de 0.25 indique que le fonds est encore en phase de creation de valeur, avec l'essentiel des distributions a venir. C'est coherent avec un vintage 2020.

### Points d'attention
- Le taux d'appel (80%) est eleve pour un fonds de 4 ans
- La concentration sectorielle sur la tech presente un risque si le marche se retourne`,
      metadata: {
        model: deciderFinance,
        tokensUsed: 420,
        latencyMs: 2100,
      },
      citations: [
        {
          id: 'cit-1',
          source: 'Alpha Growth Fund - Q4 2024 Report',
          page: 12,
          text: 'Le fonds a realise un IRR net de 18.5% depuis inception.',
        },
        {
          id: 'cit-2',
          source: 'Preqin PE Benchmark Q4 2024',
          page: 5,
          text: 'Median PE Buyout IRR pour vintage 2020 : 14.2%.',
        },
      ],
    },
    1,
  ),
  createMessage(
    {
      role: 'user',
      content: 'Compare avec le Beta Income Fund.',
    },
    2,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## Comparaison Alpha Growth Fund vs Beta Income Fund

| Metrique | Alpha Growth | Beta Income |
|----------|-------------|-------------|
| Strategie | PE Buyout | Credit |
| IRR | 18.5% | 8.2% |
| TVPI | 1.65x | 1.35x |
| DPI | 0.42x | 0.85x |
| NAV | 612 M EUR | 420 M EUR |

### Analyse

Les deux fonds repondent a des objectifs differents :

- **Alpha Growth** : profil rendement/risque plus eleve, distributions differees, potentiel de hausse significatif
- **Beta Income** : rendement stable et previsible, distributions regulieres (DPI 0.85x), adapte a un besoin de revenus

Le ratio risque/rendement ajuste favorise Beta Income pour un investisseur institutionnel cherchant de la regularite, mais Alpha Growth pour ceux acceptant plus de volatilite en echange d'un multiple superieur.`,
      metadata: {
        model: deciderFinance,
        tokensUsed: 380,
        latencyMs: 1950,
      },
      thinking: [
        {
          id: 'think-1',
          content: 'Comparaison de strategies differentes (PE vs Credit) - ajuster les metriques en consequence. Le DPI est naturellement plus bas en PE...',
          durationMs: 850,
          isCollapsed: true,
        },
      ],
    },
    3,
  ),
  createMessage(
    {
      role: 'user',
      content: 'Quel serait ton scoring ESG pour Alpha Growth ?',
    },
    4,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## Scoring ESG - Alpha Growth Fund

Basé sur les documents disponibles dans la data room :

| Categorie | Score | Poids | Pondere |
|-----------|-------|-------|---------|
| Environnement | 7/10 | 30% | 2.1 |
| Social | 6/10 | 35% | 2.1 |
| Gouvernance | 8/10 | 35% | 2.8 |
| **Total** | | | **7.0/10** |

### Detail

- **Environnement** (7/10) : Politique climat en place, reporting carbone sur 60% du portefeuille. Pas d'objectif Net Zero formalize.
- **Social** (6/10) : Politique diversite naissante, pas de metriques sociales harmonisees sur le portefeuille.
- **Gouvernance** (8/10) : Comite ESG actif, politique de vote et d'engagement documentee, reporting SFDR Article 8.

> *Note : scoring base sur les documents disponibles. Un audit terrain permettrait d'affiner les scores.*`,
      metadata: {
        model: deciderFinance,
        tokensUsed: 510,
        latencyMs: 2400,
      },
      citations: [
        {
          id: 'cit-3',
          source: 'Alpha Growth - ESG Policy 2024',
          page: 3,
          text: 'Le fonds s\'engage a reporter les emissions carbone de 100% du portefeuille d\'ici 2025.',
        },
      ],
    },
    5,
  ),
]

const documentComparisonMessages: Message[] = [
  createMessage(
    {
      role: 'user',
      content: 'Compare le prospectus et le dernier reporting du Alpha Growth Fund. Y a-t-il des incoherences ?',
    },
    0,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## Analyse croisee - Prospectus vs Reporting Q4 2024

J'ai analyse les deux documents et identifie **3 points d'attention** :

### Contradiction detectee
La strategie d'investissement decrite dans le prospectus mentionne un focus sur les entreprises de **50-200 M EUR de chiffre d'affaires**, mais le reporting Q4 montre que 2 investissements sur 8 concernent des entreprises au-dessus de 300 M EUR.

### Ecarts mineurs
1. **Levier maximum** : Le prospectus indique un levier max de 4x EBITDA. Le reporting montre un investissement a 4.2x mais precise que c'est temporaire (refinancement en cours).
2. **Allocation geographique** : Le prospectus vise 80% Europe, le portefeuille actuel est a 72% avec une exposition US non prevue initialement (8%).

### Conforme
- Taille de tickets : conforme aux fourchettes annoncees
- Secteurs : coherent avec le mandat technologie/digital
- Gouvernance : representation au board sur 100% des investissements (conforme)`,
      metadata: {
        model: deciderFinance,
        tokensUsed: 620,
        latencyMs: 3200,
      },
      citations: [
        {
          id: 'cit-4',
          source: 'Alpha Growth Fund - Prospectus 2020',
          page: 15,
          text: 'Le fonds cible des entreprises dont le chiffre d\'affaires est compris entre 50 et 200 millions d\'euros.',
        },
        {
          id: 'cit-5',
          source: 'Alpha Growth Fund - Q4 2024 Report',
          page: 8,
          text: 'TechCorp (CA: 340 M EUR) et DataFlow (CA: 310 M EUR) representent 25% du portefeuille.',
        },
      ],
      thinking: [
        {
          id: 'think-2',
          content: 'Analyse croisee des sections "strategie d\'investissement" du prospectus (p.12-18) avec le portefeuille detaille du reporting (p.6-11). Verification des parametres : taille, levier, geographie, secteur.',
          durationMs: 1500,
          isCollapsed: true,
        },
      ],
    },
    1,
  ),
  createMessage(
    {
      role: 'user',
      content: 'La contradiction sur la taille des entreprises est-elle problematique ?',
    },
    2,
  ),
  createMessage(
    {
      role: 'assistant',
      content: `## Evaluation du risque - Ecart sur la taille cible

### Severite : **Majeure**

Ce type d'ecart entre prospectus et pratique est **courant mais doit etre documente**. Voici l'analyse :

**Arguments attenuants :**
- Les prospectus PE incluent generalement une clause de flexibilite (typiquement 15-20% du portefeuille)
- Les entreprises ont pu croitre au-dessus du seuil apres investissement initial
- La strategie peut evoluer avec l'accord du comite consultatif (LPAC)

**Points de vigilance :**
- Verifier si le LPAC a approuve la deviation
- Confirmer que les investisseurs ont ete informes via le reporting
- S'assurer que la clause de flexibilite du prospectus couvre ce cas

### Recommandation

Demander au GP une **note explicative** justifiant ces investissements hors mandat, et verifier les comptes-rendus du LPAC sur la periode concernee.`,
      metadata: {
        model: deciderFinance,
        tokensUsed: 440,
        latencyMs: 2000,
      },
      suggestions: [
        { id: 'sug-3', label: 'Verifier le LPAC', prompt: 'Quels documents dois-je demander au GP pour valider cette deviation ?' },
        { id: 'sug-4', label: 'Clause de flexibilite', prompt: 'Montre-moi la clause de flexibilite du prospectus' },
      ],
    },
    3,
  ),
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-generic',
    title: 'REST vs GraphQL',
    messages: genericMessages,
    createdAt: new Date(2024, 5, 15, 10, 0),
    updatedAt: new Date(2024, 5, 15, 10, 6),
    model: deciderPro,
    tags: ['tech', 'api'],
  },
  {
    id: 'conv-fund-analysis',
    title: 'Analyse Alpha Growth Fund',
    messages: fundAnalysisMessages,
    createdAt: new Date(2024, 5, 16, 14, 0),
    updatedAt: new Date(2024, 5, 16, 14, 10),
    isPinned: true,
    model: deciderFinance,
    tags: ['finance', 'pe', 'performance'],
  },
  {
    id: 'conv-doc-comparison',
    title: 'Comparaison Prospectus vs Reporting',
    messages: documentComparisonMessages,
    createdAt: new Date(2024, 5, 17, 9, 0),
    updatedAt: new Date(2024, 5, 17, 9, 8),
    model: deciderFinance,
    tags: ['finance', 'due-diligence', 'contradictions'],
  },
]
