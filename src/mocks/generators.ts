const genericResponses = [
  `Voici ce que je peux vous dire a ce sujet.

C'est une question interessante qui merite d'etre abordee sous plusieurs angles. En general, il est important de considerer a la fois le contexte et les contraintes specifiques de votre situation.

Les points cles a retenir sont :
- Bien definir les objectifs avant de choisir une approche
- Evaluer les compromis entre simplicite et flexibilite
- Tester et iterer regulierement`,

  `Bonne question ! Voici une synthese.

D'apres mon analyse, plusieurs approches sont possibles. La plus courante consiste a decomposer le probleme en sous-parties et a traiter chacune independamment.

Je recommande de commencer par un prototype simple, puis d'enrichir progressivement la solution en fonction des retours.`,

  `Voici mon analyse detaillee.

## Contexte
Il faut d'abord comprendre les enjeux sous-jacents. Plusieurs facteurs entrent en jeu et meritent attention.

## Recommandation
L'approche la plus pragmatique serait de proceder par etapes, en validant chaque hypothese avant de passer a la suivante.

N'hesitez pas a me poser des questions complementaires si vous souhaitez approfondir un aspect specifique.`,
]

const financeResponses = [
  `## Analyse financiere

D'apres les donnees disponibles, voici les elements cles :

- **NAV** : 612 M EUR (+8.3% sur le trimestre)
- **IRR net** : 18.5% depuis inception
- **TVPI** : 1.65x (quartile superieur)

Le portefeuille montre une bonne diversification sectorielle avec une surponderation technologie coherente avec la these d'investissement. Le multiple d'entree moyen de 8.2x EBITDA reste dans la fourchette cible.

### Risques identifies
1. Concentration sur les 3 premieres positions (45% du portefeuille)
2. Exposition devises USD non couverte (12%)
3. Echeances de dette sur 2 positions en 2025`,

  `## Revue du portefeuille

La performance du fonds est en ligne avec les attentes pour un vintage de cette maturite.

| Metrique | Fonds | Benchmark |
|----------|-------|-----------|
| IRR | 18.5% | 14.2% |
| TVPI | 1.65x | 1.41x |
| DPI | 0.42x | 0.58x |

Le DPI inferieur au benchmark s'explique par la strategie de creation de valeur long terme. Les premieres sorties prevues en 2025 devraient normaliser cet indicateur.

Les cash flows projetes indiquent un potentiel de distribution de 200-250 M EUR sur les 18 prochains mois.`,
]

const codeResponses = [
  `Voici une implementation possible :

\`\`\`typescript
interface DataProcessor<T> {
  transform: (input: T) => T
  validate: (input: T) => boolean
}

function createPipeline<T>(...processors: DataProcessor<T>[]): DataProcessor<T> {
  return {
    transform(input: T): T {
      return processors.reduce(
        (result, processor) => processor.transform(result),
        input,
      )
    },
    validate(input: T): boolean {
      return processors.every((processor) => processor.validate(input))
    },
  }
}
\`\`\`

Ce pattern permet de composer des transformations de maniere declarative et testable.`,

  `Voici comment structurer cela proprement :

\`\`\`typescript
async function fetchWithRetry(
  url: string,
  maxRetries = 3,
  delayMs = 1000,
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url)

    if (response.ok) {
      return response
    }

    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)))
    }
  }

  throw new Error(\`Echec apres \${maxRetries} tentatives pour \${url}\`)
}
\`\`\`

Le backoff lineaire est suffisant pour la plupart des cas. Pour des situations critiques, envisagez un backoff exponentiel avec jitter.`,
]

const analysisResponses = [
  `## Analyse detaillee

### Methodologie
L'analyse repose sur une comparaison croisee de 3 sources documentaires et des donnees de marche actualisees [1].

### Resultats

**Point principal** : Les donnees convergent vers une tendance positive, avec un taux de croissance annuel moyen de 12.4% sur la periode analysee.

Les facteurs contributifs sont :
1. Amelioration des marges operationnelles (+2.3 pts)
2. Croissance organique soutenue (8.1% YoY)
3. Integration reussie des acquisitions recentes

### Limites
Cette analyse se base sur des donnees publiques et les documents fournis. Certains facteurs qualitatifs (qualite du management, dynamique d'equipe) ne sont pas captures [2].

---
*[1] Source : Reporting Q4 2024, p.12*
*[2] Source : Due Diligence Memo, p.5*`,

  `## Synthese analytique

Apres examen des documents disponibles, voici les conclusions principales.

### Forces
- Position de marche dominante sur le segment cible
- Recurrence des revenus (78% de revenus recurrents) [1]
- Pipeline commercial solide (3.2x le CA annuel)

### Faiblesses
- Dependance a un client representant 22% du CA [2]
- Marge EBITDA en compression (-1.5 pts vs N-1)
- Turnover des equipes tech au-dessus de la moyenne sectorielle

### Score global : 7.2/10

La societe presente un profil attractif malgre les points de vigilance identifies. La diversification client est le chantier prioritaire.

---
*[1] Source : Financial Statements 2023, p.34*
*[2] Source : Management Presentation, p.18*`,
]

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function generateGenericResponse(_prompt: string): string {
  return pickRandom(genericResponses)
}

export function generateFinanceResponse(_prompt: string): string {
  return pickRandom(financeResponses)
}

export function generateCodeResponse(_prompt: string): string {
  return pickRandom(codeResponses)
}

export function generateAnalysisResponse(_prompt: string): string {
  return pickRandom(analysisResponses)
}
