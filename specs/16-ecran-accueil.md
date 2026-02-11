# 16 — Écran d'accueil

Fonctionnalités liées à l'écran d'accueil, aux suggestions de prompts et à l'onboarding des nouveaux utilisateurs.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Perplexity, DeepSeek, Mistral Le Chat, Pi

---

### US-206 : Écran d'accueil avec branding `P0`

**Description** : En tant qu'utilisateur, je veux voir un écran d'accueil identifiable au lancement d'un nouveau chat, afin de savoir que l'application est prête et quel assistant je vais utiliser.

**Critères d'acceptation** :
- [ ] L'écran d'accueil affiche le logo et/ou le nom de l'assistant
- [ ] Un message de bienvenue est affiché
- [ ] Le modèle actuellement sélectionné est indiqué
- [ ] L'écran est centré verticalement dans la zone de conversation
- [ ] L'écran disparaît dès que le premier message est envoyé

---

### US-207 : Suggestions de prompts sur l'écran d'accueil `P0`

**Description** : En tant qu'utilisateur, je veux voir des suggestions de prompts sur l'écran d'accueil, afin de démarrer rapidement une conversation sans savoir quoi demander.

**Critères d'acceptation** :
- [ ] 4 à 6 suggestions sont affichées sous forme de cartes ou boutons cliquables
- [ ] Les suggestions couvrent des cas d'usage variés (rédaction, code, analyse, création)
- [ ] Cliquer sur une suggestion l'insère dans la textarea ou l'envoie directement
- [ ] Les suggestions sont renouvelées aléatoirement à chaque visite
- [ ] Les suggestions sont adaptées au contexte (modèle sélectionné, préférences utilisateur)

---

### US-208 : Suggestions personnalisées basées sur l'historique `P2`

**Description** : En tant qu'utilisateur régulier, je veux que les suggestions de l'écran d'accueil soient personnalisées en fonction de mon historique, afin de voir des propositions pertinentes par rapport à mes usages.

**Critères d'acceptation** :
- [ ] Les suggestions tiennent compte des sujets fréquemment abordés
- [ ] Les conversations récentes non terminées sont proposées pour reprise
- [ ] Les suggestions évoluent au fil du temps avec l'apprentissage des préférences
- [ ] Un mix de suggestions personnalisées et de découverte est proposé
- [ ] L'utilisateur peut rafraîchir les suggestions pour en voir de nouvelles

---

### US-209 : Catégories de prompts `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir parcourir des catégories de prompts, afin de trouver de l'inspiration par domaine d'utilisation.

**Critères d'acceptation** :
- [ ] Les catégories sont affichées comme des onglets ou des filtres (Écriture, Code, Analyse, Créativité, etc.)
- [ ] Chaque catégorie contient 4 à 8 prompts exemples
- [ ] Les prompts sont cliquables et prêts à l'emploi
- [ ] Les catégories sont personnalisables ou extensibles
- [ ] Les catégories sont accessibles depuis l'écran d'accueil ou un menu dédié

---

### US-210 : Onboarding pour nouveaux utilisateurs `P1`

**Description** : En tant que nouvel utilisateur, je veux être guidé lors de ma première utilisation, afin de comprendre les fonctionnalités principales de l'application.

**Critères d'acceptation** :
- [ ] Un parcours guidé démarre automatiquement à la première connexion
- [ ] Les étapes clés sont présentées (saisir un message, utiliser les pièces jointes, changer de modèle)
- [ ] Chaque étape est accompagnée d'une courte explication et d'une animation
- [ ] L'utilisateur peut passer l'onboarding à tout moment
- [ ] L'onboarding peut être relancé depuis les paramètres

---

### US-211 : Prompt du jour / mise en avant `P2`

**Description** : En tant qu'utilisateur, je veux voir un "prompt du jour" ou une mise en avant sur l'écran d'accueil, afin de découvrir de nouvelles façons d'utiliser l'assistant.

**Critères d'acceptation** :
- [ ] Un prompt ou une fonctionnalité mis en avant est affiché sur l'écran d'accueil
- [ ] Le contenu change quotidiennement ou hebdomadairement
- [ ] La mise en avant est visuellement distinguée des suggestions classiques
- [ ] L'utilisateur peut masquer ou ignorer la mise en avant
- [ ] Le contenu mis en avant est éditorialisé et de qualité

---

### US-212 : Raccourcis vers les conversations récentes `P1`

**Description** : En tant qu'utilisateur, je veux voir mes conversations récentes accessibles depuis l'écran d'accueil, afin de reprendre rapidement où j'en étais.

**Critères d'acceptation** :
- [ ] Les 3 à 5 dernières conversations sont affichées sur l'écran d'accueil
- [ ] Chaque conversation affiche son titre et un aperçu du dernier message
- [ ] Cliquer sur une conversation l'ouvre directement
- [ ] Les conversations récentes sont distinctes des suggestions de prompts
- [ ] L'affichage s'adapte si l'utilisateur n'a pas encore de conversations

---

### US-213 : Message de capacités du modèle `P1`

**Description** : En tant qu'utilisateur, je veux voir les capacités du modèle sélectionné sur l'écran d'accueil, afin de savoir ce que l'assistant peut faire avec ce modèle.

**Critères d'acceptation** :
- [ ] Les capacités principales sont listées sous forme d'icônes et de labels
- [ ] Les capacités s'adaptent au modèle sélectionné (vision, code, web, etc.)
- [ ] Les limitations connues sont mentionnées de manière discrète
- [ ] Les capacités sont cliquables pour lancer un exemple d'utilisation
- [ ] L'affichage est compact et ne surcharge pas l'écran d'accueil

---

### US-214 : État de la connexion et disponibilité `P1`

**Description** : En tant qu'utilisateur, je veux voir l'état de la connexion au service sur l'écran d'accueil, afin de savoir si l'assistant est disponible avant de rédiger un message.

**Critères d'acceptation** :
- [ ] Un indicateur de connexion est affiché (vert = connecté, rouge = déconnecté)
- [ ] Un message explicatif est affiché en cas de problème de connexion
- [ ] L'état se met à jour automatiquement
- [ ] Les pannes de service connues sont communiquées
- [ ] L'utilisateur est redirigé vers le formulaire de reconnexion si nécessaire

---

### US-215 : Quick actions sur l'écran d'accueil `P2`

**Description** : En tant qu'utilisateur, je veux accéder à des actions rapides sur l'écran d'accueil, afin de lancer directement des workflows courants.

**Critères d'acceptation** :
- [ ] Des actions rapides sont proposées (générer une image, analyser un fichier, rechercher sur le web)
- [ ] Chaque action déclenche le workflow approprié en un clic
- [ ] Les actions sont adaptées aux capacités du modèle sélectionné
- [ ] Les actions utilisent des icônes reconnaissables
- [ ] Les actions sont personnalisables selon les préférences utilisateur

---

### US-216 : Annonces et changelog `P2`

**Description** : En tant qu'utilisateur, je veux être informé des nouvelles fonctionnalités et mises à jour, afin de tirer parti des dernières améliorations.

**Critères d'acceptation** :
- [ ] Un badge ou une notification signale les nouvelles fonctionnalités
- [ ] Un panneau d'annonces est accessible depuis l'écran d'accueil ou le menu
- [ ] Chaque annonce est datée et décrit brièvement la nouveauté
- [ ] L'utilisateur peut marquer les annonces comme lues
- [ ] Les annonces n'apparaissent pas de manière intrusive pendant l'utilisation
