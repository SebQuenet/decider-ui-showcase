# 04 — Interaction avec l'IA

Fonctionnalités liées au contrôle de la génération, aux retours utilisateur et aux modes d'interaction avancés avec l'assistant.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Perplexity, Copilot, DeepSeek, Grok, Mistral Le Chat, You.com

---

### US-052 : Streaming des réponses `P0`

**Description** : En tant qu'utilisateur, je veux que les réponses de l'assistant soient transmises en streaming, afin de commencer à lire immédiatement sans attendre la génération complète.

**Critères d'acceptation** :
- [ ] La connexion SSE/WebSocket est établie pour recevoir les tokens en temps réel
- [ ] Le premier token est affiché dès sa réception
- [ ] Le flux est robuste aux interruptions réseau avec reconnexion automatique
- [ ] Les métadonnées de fin de stream (tokens utilisés, durée) sont traitées
- [ ] Le streaming fonctionne de façon identique pour tous les modèles supportés

---

### US-053 : Bouton Stop generation `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir arrêter la génération en cours, afin de ne pas attendre une réponse qui ne me convient pas ou qui est trop longue.

**Critères d'acceptation** :
- [ ] Un bouton "Stop" est affiché pendant la génération, remplaçant le bouton d'envoi
- [ ] Cliquer sur le bouton arrête immédiatement le streaming
- [ ] Le texte déjà généré est conservé et affiché
- [ ] Après l'arrêt, l'utilisateur peut envoyer un nouveau message ou régénérer
- [ ] Le raccourci clavier Escape fonctionne pour stopper la génération

---

### US-054 : Régénérer la dernière réponse `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir régénérer la dernière réponse de l'assistant, afin d'obtenir une réponse alternative si la première ne me satisfait pas.

**Critères d'acceptation** :
- [ ] Un bouton "Régénérer" est disponible sur le dernier message de l'assistant
- [ ] Cliquer lance une nouvelle génération avec le même prompt
- [ ] La réponse précédente est remplacée ou conservée dans un historique de versions
- [ ] Le bouton est désactivé pendant une génération en cours
- [ ] L'utilisateur est informé que la réponse peut différer

---

### US-055 : Éditer un message envoyé `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir éditer un message que j'ai déjà envoyé, afin de corriger une erreur ou reformuler ma question sans recommencer la conversation.

**Critères d'acceptation** :
- [ ] Un bouton "Éditer" est disponible sur les messages de l'utilisateur
- [ ] Cliquer ouvre le message dans un champ d'édition avec le texte original
- [ ] Valider l'édition relance la génération de la réponse de l'assistant
- [ ] Les messages suivants dans la conversation sont supprimés ou un nouveau branch est créé
- [ ] L'utilisateur peut annuler l'édition

---

### US-056 : Branching/arbre de conversation `P2`

**Description** : En tant qu'utilisateur avancé, je veux que l'édition d'un message crée une branche dans l'arbre de conversation, afin de pouvoir explorer plusieurs pistes sans perdre les échanges précédents.

**Critères d'acceptation** :
- [ ] Éditer un message crée un nouveau branch plutôt que de supprimer les messages suivants
- [ ] L'arbre de conversation est navigable via des contrôles (flèches gauche/droite)
- [ ] Un indicateur montre le nombre de branches à chaque point de divergence
- [ ] L'utilisateur peut naviguer entre les branches librement
- [ ] La structure de branches est persistée

---

### US-057 : Navigation entre versions d'une réponse `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir naviguer entre les différentes versions d'une réponse régénérée, afin de comparer et choisir la meilleure.

**Critères d'acceptation** :
- [ ] Des flèches de navigation (← →) sont affichées quand plusieurs versions existent
- [ ] Un indicateur montre la version courante et le nombre total (ex. "2/3")
- [ ] La navigation entre versions est instantanée (pas de rechargement)
- [ ] Chaque version conserve son contenu complet
- [ ] L'utilisateur peut régénérer depuis n'importe quelle version

---

### US-058 : Feedback pouce haut/bas `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir donner un feedback rapide sur les réponses de l'assistant via des boutons pouce haut/bas, afin de signaler la qualité des réponses.

**Critères d'acceptation** :
- [ ] Des boutons 👍/👎 sont affichés sur chaque message de l'assistant
- [ ] Les boutons sont accessibles au survol ou en permanence selon le design
- [ ] Un seul feedback est possible par message (le second clic annule le premier)
- [ ] Le feedback sélectionné est visuellement mis en évidence
- [ ] Le feedback est enregistré et persisté

---

### US-059 : Commentaire de feedback `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir ajouter un commentaire textuel à mon feedback, afin d'expliquer pourquoi une réponse est bonne ou mauvaise.

**Critères d'acceptation** :
- [ ] Après avoir cliqué sur 👎, un champ de commentaire optionnel s'ouvre
- [ ] L'utilisateur peut sélectionner des catégories prédéfinies (incorrect, incomplet, dangereux, etc.)
- [ ] Un champ texte libre permet d'ajouter des détails
- [ ] Le commentaire peut être soumis ou annulé
- [ ] Le feedback complet (vote + commentaire) est enregistré

---

### US-060 : Mode thinking/raisonnement étendu `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir activer un mode de raisonnement étendu, afin que l'assistant réfléchisse plus longuement avant de répondre pour des questions complexes.

**Critères d'acceptation** :
- [ ] Un toggle ou bouton permet d'activer le mode "thinking" avant d'envoyer un message
- [ ] En mode thinking, l'assistant affiche sa réflexion dans un bloc dédié avant la réponse
- [ ] Le temps de réflexion supplémentaire est communiqué à l'utilisateur
- [ ] Le mode peut être activé/désactivé à tout moment
- [ ] Le mode thinking est compatible avec le streaming

---

### US-061 : Deep research `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir lancer une recherche approfondie (deep research), afin que l'assistant analyse un sujet en profondeur en consultant plusieurs sources.

**Critères d'acceptation** :
- [ ] Un mode "Deep Research" est activable pour un message
- [ ] L'assistant indique les étapes de sa recherche (plan, sources consultées, synthèse)
- [ ] Un indicateur de progression montre l'avancement de la recherche
- [ ] Le résultat final est structuré avec des sections et des sources
- [ ] L'utilisateur peut arrêter la recherche en cours
- [ ] Le temps estimé ou une indication de durée est fourni

---

### US-062 : Suggestions de follow-up `P1`

**Description** : En tant qu'utilisateur, je veux que l'assistant me propose des questions de suivi pertinentes après sa réponse, afin de poursuivre l'exploration du sujet facilement.

**Critères d'acceptation** :
- [ ] 2 à 4 suggestions sont affichées sous la réponse de l'assistant
- [ ] Les suggestions sont contextuelles et pertinentes par rapport à l'échange
- [ ] Cliquer sur une suggestion l'envoie comme nouveau message
- [ ] Les suggestions sont affichées sous forme de chips/boutons cliquables
- [ ] Les suggestions disparaissent quand l'utilisateur commence à taper un nouveau message

---

### US-063 : Questions de clarification `P2`

**Description** : En tant qu'utilisateur, je veux que l'assistant me pose des questions de clarification quand ma requête est ambiguë, afin d'obtenir une réponse plus pertinente.

**Critères d'acceptation** :
- [ ] L'assistant détecte les requêtes ambiguës et pose des questions avant de répondre
- [ ] Les questions de clarification sont présentées de façon distincte (style différent)
- [ ] L'utilisateur peut répondre aux clarifications ou reformuler sa question
- [ ] Des options de réponse rapide sont proposées quand applicable
- [ ] L'assistant peut quand même tenter une réponse tout en demandant des précisions

---

### US-064 : Quick actions/chips d'action `P1`

**Description** : En tant qu'utilisateur, je veux avoir accès à des actions rapides contextuelles, afin d'interagir avec la réponse de l'assistant sans rédiger un nouveau message.

**Critères d'acceptation** :
- [ ] Des chips d'action sont affichés sous certaines réponses (ex. "Résumer", "Traduire", "Approfondir")
- [ ] Les actions sont contextuelles et varient selon le contenu de la réponse
- [ ] Cliquer sur un chip exécute l'action immédiatement
- [ ] Les actions sont présentées de façon discrète et non intrusive
- [ ] Les résultats des actions s'affichent comme des messages dans la conversation

---

### US-065 : Indicateur de progression pour tâches longues `P2`

**Description** : En tant qu'utilisateur, je veux voir un indicateur de progression quand l'assistant effectue une tâche longue (recherche, analyse de fichier, etc.), afin de savoir où en est le traitement.

**Critères d'acceptation** :
- [ ] Un indicateur de progression est affiché pour les tâches qui prennent plus de quelques secondes
- [ ] L'indicateur montre l'étape en cours (ex. "Recherche en cours...", "Analyse du document...")
- [ ] Une barre de progression ou un stepper indique l'avancement si les étapes sont connues
- [ ] L'indicateur est animé pour montrer que le traitement est actif
- [ ] L'utilisateur peut annuler la tâche en cours
