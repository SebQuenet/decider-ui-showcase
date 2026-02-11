# 30 — Onboarding & Expérience finance

Fonctionnalités liées à l'expérience utilisateur spécifique aux professionnels de la finance : écran d'accueil, prompts métier, glossaire et mode démo.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv Workspace, Morningstar Direct, PitchBook

**Axe stratégique** : Vélocité

---

### US-393 : Écran d'accueil finance `P0`

**Description** : En tant qu'analyste financier, je veux que l'écran d'accueil soit adapté à mon métier avec des raccourcis vers les actions clés (importer une data room, interroger un fonds, générer un document), afin de commencer à travailler immédiatement.

**Critères d'acceptation** :
- [ ] L'écran d'accueil affiche les projets fonds récents avec leur statut
- [ ] Des raccourcis rapides sont visibles : « Importer une data room », « Nouvelle analyse », « Générer un document »
- [ ] Les alertes non lues sont affichées en résumé
- [ ] L'écran respecte le theming Decider (sobre, professionnel, « C'est propre »)
- [ ] L'écran est personnalisable (widgets déplaçables ou masquables)

---

### US-394 : Parcours d'onboarding guidé `P1`

**Description** : En tant que nouvel utilisateur, je veux être guidé pas à pas lors de ma première connexion pour comprendre les fonctionnalités clés de Decider, afin d'être autonome rapidement.

**Critères d'acceptation** :
- [ ] Un parcours guidé se déclenche à la première connexion
- [ ] Le parcours couvre les étapes clés : import de data room, interrogation, comparaison, génération
- [ ] Chaque étape est illustrée avec un exemple concret
- [ ] L'utilisateur peut sauter le parcours et y revenir plus tard
- [ ] Le parcours est adapté au rôle de l'utilisateur (analyste vs gestionnaire)

---

### US-395 : Mode démo avec données fictives `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir accéder à un mode démo avec des data rooms fictives préremplies, afin de découvrir les fonctionnalités sans importer mes propres données.

**Critères d'acceptation** :
- [ ] Deux projets fonds fictifs sont disponibles (ex. : Fonds Alpha et Fonds Beta) avec des documents réalistes
- [ ] Toutes les fonctionnalités sont utilisables en mode démo (interrogation, comparaison, graphiques, contradictions, génération)
- [ ] Le mode démo est clairement identifié visuellement pour éviter toute confusion avec les données réelles
- [ ] Le mode démo est accessible en un clic depuis l'écran d'accueil
- [ ] Les données de démo ne sont pas modifiables par l'utilisateur

---

### US-396 : Prompts métier prédéfinis `P1`

**Description** : En tant qu'analyste financier, je veux disposer de prompts prédéfinis adaptés à mon métier, afin de poser les bonnes questions sans avoir à formuler des requêtes complexes.

**Critères d'acceptation** :
- [ ] Des prompts métier sont proposés dans l'interface de chat (ex. : « Extrais les métriques clés », « Compare les track records », « Détecte les contradictions »)
- [ ] Les prompts sont contextuels et adaptés au type de projet et aux documents disponibles
- [ ] Les prompts sont cliquables et pré-remplissent le champ de saisie
- [ ] L'utilisateur peut personnaliser et sauvegarder ses propres prompts
- [ ] Les prompts les plus utilisés sont mis en avant

---

### US-397 : Glossaire financier intégré `P1`

**Description** : En tant qu'analyste financier junior, je veux pouvoir accéder à un glossaire des termes financiers utilisés par l'assistant, afin de comprendre les métriques et concepts sans quitter l'interface.

**Critères d'acceptation** :
- [ ] Les termes techniques dans les réponses de l'assistant sont cliquables et affichent une définition
- [ ] Le glossaire couvre les termes financiers courants (TRI, NAV, TVPI, DPI, Sharpe, drawdown, carry, hurdle, etc.)
- [ ] Les définitions sont concises et accompagnées d'un exemple
- [ ] Un glossaire complet est consultable depuis le menu principal
- [ ] Le glossaire est enrichissable par l'administrateur

---

### US-398 : Aide contextuelle sur les fonctionnalités `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir accéder à une aide contextuelle expliquant chaque fonctionnalité directement depuis l'interface, afin de comprendre les capacités de l'outil sans consulter une documentation externe.

**Critères d'acceptation** :
- [ ] Un icône d'aide est disponible à côté de chaque fonctionnalité principale
- [ ] L'aide affiche une explication concise avec un exemple d'utilisation
- [ ] L'aide contextuelle est consultable sans quitter la page courante
- [ ] Les liens vers la documentation détaillée sont inclus si disponibles
- [ ] L'aide est disponible en français et en anglais

---

### US-399 : Raccourcis métier pour analystes `P1`

**Description** : En tant qu'analyste financier, je veux disposer de raccourcis clavier spécifiques à mon métier, afin d'accélérer mes tâches quotidiennes sans toucher la souris.

**Critères d'acceptation** :
- [ ] Des raccourcis sont définis pour les actions fréquentes : changer de projet, lancer une extraction, générer un document
- [ ] Les raccourcis sont affichés dans un panneau accessible via Ctrl+/
- [ ] Les raccourcis sont personnalisables par l'utilisateur
- [ ] Les raccourcis ne conflictent pas avec les raccourcis du navigateur
- [ ] Un mode d'apprentissage affiche les raccourcis disponibles en contexte

---

### US-400 : Personnalisation du dashboard finance `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir personnaliser la disposition et le contenu de mon dashboard, afin d'adapter l'interface à mes priorités quotidiennes.

**Critères d'acceptation** :
- [ ] Les widgets du dashboard sont réorganisables par glisser-déposer
- [ ] L'utilisateur peut ajouter ou retirer des widgets (projets récents, alertes, métriques, graphiques)
- [ ] La disposition personnalisée est sauvegardée entre les sessions
- [ ] Des dispositions prédéfinies sont disponibles (analyste, gestionnaire, compliance)
- [ ] Un bouton « Réinitialiser » permet de revenir à la disposition par défaut

---

### US-401 : Tutoriels interactifs par fonctionnalité `P2`

**Description** : En tant que nouvel utilisateur, je veux pouvoir suivre des tutoriels interactifs sur chaque fonctionnalité avancée (contradictions, scoring, génération), afin de maîtriser les capacités de l'outil progressivement.

**Critères d'acceptation** :
- [ ] Chaque fonctionnalité majeure dispose d'un tutoriel interactif (3-5 étapes)
- [ ] Le tutoriel guide l'utilisateur avec des données de démo
- [ ] Le progrès est sauvegardé pour pouvoir reprendre plus tard
- [ ] Les tutoriels sont accessibles depuis le menu d'aide
- [ ] Un badge de complétion est affiché quand un tutoriel est terminé

---

### US-402 : Feedback utilisateur intégré `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir donner un feedback sur la qualité des réponses et des documents générés, afin de contribuer à l'amélioration continue de l'outil.

**Critères d'acceptation** :
- [ ] Un bouton de feedback (pouce haut/bas) est disponible sur chaque réponse de l'assistant
- [ ] Un commentaire optionnel peut accompagner le feedback
- [ ] Le feedback sur les documents générés évalue la qualité, la complétude et la mise en forme
- [ ] Les feedbacks sont agrégés pour le suivi de la qualité
- [ ] Le feedback est anonyme sauf si l'utilisateur choisit de s'identifier

---

### US-403 : Indicateurs d'usage et de progression `P2`

**Description** : En tant qu'administrateur, je veux disposer de statistiques d'utilisation de la plateforme, afin de mesurer l'adoption et d'identifier les fonctionnalités les plus utilisées.

**Critères d'acceptation** :
- [ ] Les métriques d'usage sont disponibles : nombre de connexions, de questions, de documents générés, par utilisateur et par période
- [ ] Les fonctionnalités les plus et les moins utilisées sont identifiées
- [ ] Les tendances d'utilisation sont affichées sur des graphiques temporels
- [ ] Les données sont exportables en CSV
- [ ] Le tableau de bord d'usage est réservé aux administrateurs

---

### US-404 : Adaptation au niveau d'expertise `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir configurer mon niveau d'expertise (junior, confirmé, senior) pour adapter le niveau de détail et les explications de l'assistant, afin d'obtenir des réponses adaptées à mes connaissances.

**Critères d'acceptation** :
- [ ] Trois niveaux sont disponibles : junior (explications détaillées, glossaire), confirmé (standard), senior (concis, technique)
- [ ] Le niveau influence le vocabulaire, le niveau de détail et la présence d'explications
- [ ] Le niveau est configurable dans les préférences utilisateur
- [ ] L'assistant peut suggérer un niveau basé sur les premières interactions
- [ ] Le niveau est modifiable à tout moment sans impact sur l'historique
