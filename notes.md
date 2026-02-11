# I. Produit

## Vision

**La vision** : L'assistant personnel quotidien des professionnels.

**Première profession visée** : L'analyste financier.

**Pourquoi cette profession** : les analystes financiers disposent de budgets pour expérimenter, et leur métier consiste souvent à interroger des data rooms, comparer des données et générer des documents d'analyse — notre point différenciant.

## 1. Premier enjeu client : le KPI d'adoption

### Ce que nous ne voulons pas

Installer un sous-produit qui serait sous-utilisé. Cela nuirait à notre réputation interne et à la trajectoire attendue par nos investisseurs. **Nous sommes là pour impressionner.** Si le produit ne provoque pas des effets « wow », mieux vaut continuer à le développer.

*Scénario à éviter :*

> **CEO BRED** : Salut Stéphane, alors tu utilises l'agent Decider ?
> 

> **Stéphane** : Oui, de temps en temps pour générer un document de synthèse, mais c'est tout. Pour le reste c'est trop lent, pas pratique, ça ne me sert pas à grand-chose par rapport à ce que je fais déjà.
> 

*Scénario visé :*

> **CEO BRED** : Salut Stéphane, alors tu utilises l'agent Decider ?
> 

> **Stéphane** : Tous les jours, je ne peux plus m'en passer. Dès que j'ai une analyse à faire ou une donnée à rechercher, je l'utilise. J'arrive à faire beaucoup plus de choses maintenant. Par exemple, j'ai un suivi de l'historique de nos investissements, ce qui nous permet de mieux ajuster nos futurs placements.
> 

## 2. To do produit

*Après discussion, indiquer un planning et un responsable pour chaque ligne.*

| # | Action | Fonction | Responsable / Planning |
| --- | --- | --- | --- |
| 1 | Installer Decider en ligne avec accès pour chaque membre de l'équipe | — | À définir |
| 2 | Recherche de contenu via le chatbot sans temps de latence | Interrogation | À définir |
| 3 | Interrogation de contenus + génération de tableaux et comparaisons simples | Interrogation | À définir |
| 4 | Génération de la liste des documents manquants | Interrogation | À définir |
| 5 | Comparaison entre data rooms (plusieurs data rooms par projet) | Interrogation | À définir |
| 6 | Génération de documents | Génération | À définir |
| 7 | Démontrer la scalabilité : petite DR (fait), moyenne (centaines de docs), grande (milliers de docs) | Toutes | À définir |
| 8 | Démontrer la capacité à générer des documents plus complexes que la synthèse | Génération | À définir |

---

# II. Installation & Hébergement

## Enjeu

Être totalement professionnel et préparé face à la DSI, qui peut chercher à nous décrédibiliser. Maîtriser l'ensemble des questions techniques et juridiques possibles et fournir un document explicatif en amont. Cet exercice constituera un excellent entraînement pour les déploiements futurs.

### Ce qu'on doit faire

Préparer un document présentant les différentes options d'hébergement, chiffrées, avec les charges associées (coût machine et coût homme).

### Ce qu'on ne doit pas faire

*« Salut, on voulait voir comment on pouvait installer notre agent sur votre infra. » — Absolument pas.*

## Options d'hébergement à chiffrer

| Option | Description | Détails à préciser |
| --- | --- | --- |
| Option 1 | Cloud Decider (amazon) avec anonymiseur | Coût d'usage par agent |
| Option 2 | On-premise (simulation) | Simuler pour 1 agent et 5 agents |
| Option 3 | Cloud interne certifié SOC 2 | Coûts d'infrastructure |

### Simulations à réaliser

- Prix par utilisateur (différentes options d'usage)
- Prix par agent
- Coût de génération d'un document
- Coût par requête

### Livrable

Une fois validé en interne, préparer un document formel pour la DSI présentant les 3 options.

NB : j’ai bien conscience que nous n’avons pas tous les éléments, nous devons donc fonctionner par hypothèse

---

# III. Expansion : Nouveaux Data Packs

## Objectifs

**Objectif primaire** : Prouver l'horizontalité de la solution avant déploiement. Permettre au client de se projeter avec nous de manière transverse.

**Objectif ultime** : Devenir la solution de recherche de référence chez nos clients.

## Actions

1. Envoyer un mail au département crédit
2. Organiser le rendez-vous « Énergie »
3. Organiser le rendez-vous « Achat »

---

# IV. Benchmarks

## Benchmark 1 : RAG

Comparer les 3 grands LLM (Gemini, Claude, ChatGPT) sur notre pipeline RAG.

| Test | Condition | Objectif |
| --- | --- | --- |
| Test A | À iso-contenu : RAG sans nos algorithmes | Démontrer les documents non importés, erreurs, hallucinations |
| Test B | À petit volume de contenu | Démontrer les limites d'importation et la présence d'erreurs |

## Benchmark 2 : LLM

Avec de petits volumes de contenu, démontrer que les LLM leaders : (i) n'arrivent pas à retrouver et réimporter la bonne donnée dans un document, et (ii) renvoient des réponses inventées ou fausses (idéalement des chiffres faux).

## Benchmark 3 : UX

Lors du benchmark LLM, chaque employé Decider prend des captures d'écran des comportements d'interface appréciés et reproductibles.

- Collecter les meilleures pratiques UX observées
- Organiser une réunion de synthèse avec Cyril C.
