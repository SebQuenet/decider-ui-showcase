# 07 — Recherche web

Fonctionnalités liées à la recherche web intégrée, aux modes focus et à l'accès aux données temps réel.

**Plateformes de référence** : Perplexity, Copilot, Gemini, ChatGPT, You.com, Phind, Grok

---

### US-092 : Toggle de recherche web `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir activer ou désactiver la recherche web pour un message, afin de contrôler si l'assistant doit consulter internet pour répondre.

**Critères d'acceptation** :
- [ ] Un toggle ou bouton "Recherche web" est accessible dans la barre de composition
- [ ] L'état activé/désactivé est clairement visible
- [ ] L'activation déclenche une recherche web avant la génération de la réponse
- [ ] Le toggle peut être activé par défaut dans les préférences
- [ ] Le toggle est désactivé pendant une génération en cours

---

### US-093 : Affichage des sources web `P0`

**Description** : En tant qu'utilisateur, je veux voir les sources web citées dans la réponse, afin de vérifier les informations et approfondir mes recherches.

**Critères d'acceptation** :
- [ ] Les sources sont affichées sous forme de cartes ou de liens numérotés
- [ ] Chaque source affiche le titre de la page, l'URL et un extrait pertinent
- [ ] Les numéros de citation dans le texte sont cliquables et pointent vers la source
- [ ] Un favicon ou une icône de domaine est affiché pour chaque source
- [ ] Les sources sont regroupées en bas de la réponse ou dans un panneau dédié

---

### US-094 : Indicateur de recherche en cours `P0`

**Description** : En tant qu'utilisateur, je veux voir un indicateur quand l'assistant effectue une recherche web, afin de comprendre pourquoi la réponse prend plus de temps.

**Critères d'acceptation** :
- [ ] Une animation ou un message indique "Recherche en cours..."
- [ ] Les requêtes de recherche effectuées sont affichées en temps réel
- [ ] Le nombre de sources trouvées est indiqué au fur et à mesure
- [ ] L'indicateur disparaît quand la recherche est terminée et la génération commence
- [ ] L'utilisateur peut annuler la recherche en cours

---

### US-095 : Modes focus de recherche `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir choisir un mode focus pour orienter la recherche, afin d'obtenir des résultats plus pertinents selon mon besoin.

**Critères d'acceptation** :
- [ ] Des modes focus sont proposés (Tous, Académique, Actualités, Vidéos, Réseaux sociaux, Code)
- [ ] Le mode sélectionné oriente les sources consultées
- [ ] Le mode actif est visuellement indiqué
- [ ] Le mode peut être changé entre les messages
- [ ] Chaque mode a une icône distincte et une description courte

---

### US-096 : Recherche avec date de fraîcheur `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir filtrer les résultats de recherche par date, afin d'obtenir des informations récentes ou historiques selon mon besoin.

**Critères d'acceptation** :
- [ ] Un filtre de date est disponible (dernière heure, jour, semaine, mois, année)
- [ ] Le filtre est applicable avant l'envoi du message
- [ ] Les résultats respectent la contrainte temporelle choisie
- [ ] La date de publication de chaque source est affichée
- [ ] Un mode "temps réel" priorise les informations les plus récentes

---

### US-097 : Preview de liens dans les sources `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir prévisualiser une source web sans quitter le chat, afin de vérifier rapidement si la source est pertinente.

**Critères d'acceptation** :
- [ ] Survoler un lien source affiche une preview (titre, description, image)
- [ ] Cliquer ouvre la source dans un panneau latéral intégré ou dans un nouvel onglet
- [ ] Le panneau de preview est fermable sans perdre la conversation
- [ ] Les images et le texte principal de la source sont affichés lisiblement
- [ ] Un bouton permet d'ouvrir la source dans un onglet externe

---

### US-098 : Recherche locale dans les fichiers uploadés `P2`

**Description** : En tant qu'utilisateur, je veux que l'assistant puisse rechercher dans mes fichiers uploadés en complément de la recherche web, afin de combiner mes documents et les informations du web.

**Critères d'acceptation** :
- [ ] L'assistant peut chercher dans les fichiers uploadés pendant la conversation
- [ ] Les résultats de recherche locale sont distingués des résultats web
- [ ] Les passages pertinents des fichiers sont cités avec leur source
- [ ] La recherche combine intelligemment les sources locales et web
- [ ] Un indicateur montre quelles sources locales ont été consultées

---

### US-099 : Suivi d'un sujet en temps réel `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir suivre un sujet et recevoir des mises à jour automatiques, afin de rester informé sans relancer manuellement des recherches.

**Critères d'acceptation** :
- [ ] Un bouton "Suivre ce sujet" est disponible après une recherche
- [ ] Des notifications sont envoyées quand de nouvelles informations pertinentes sont disponibles
- [ ] La fréquence de suivi est configurable (temps réel, quotidien, hebdomadaire)
- [ ] L'utilisateur peut gérer ses sujets suivis depuis les paramètres
- [ ] Chaque mise à jour est accompagnée des nouvelles sources

---

### US-100 : Résumé automatique de page web `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir demander un résumé d'une page web en collant son URL, afin d'obtenir rapidement l'essentiel d'un article ou d'un document en ligne.

**Critères d'acceptation** :
- [ ] Coller une URL dans le chat déclenche une proposition de résumé
- [ ] Le résumé est structuré avec les points clés de la page
- [ ] La source originale est citée et accessible
- [ ] Le résumé indique la date de publication si disponible
- [ ] L'utilisateur peut demander d'approfondir des sections spécifiques du résumé

---

### US-101 : Comparaison de sources multiples `P2`

**Description** : En tant qu'utilisateur, je veux que l'assistant compare les informations provenant de plusieurs sources, afin d'identifier les consensus et les divergences sur un sujet.

**Critères d'acceptation** :
- [ ] L'assistant identifie les points de convergence et de divergence entre les sources
- [ ] Un tableau ou une synthèse comparative est généré
- [ ] Chaque affirmation est attribuée à sa source
- [ ] Le niveau de fiabilité de chaque source est estimé si possible
- [ ] L'utilisateur peut demander d'approfondir un point de désaccord

---

### US-102 : Citation et bibliographie formatée `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter les sources d'une recherche dans un format de citation académique, afin de les utiliser dans mes travaux.

**Critères d'acceptation** :
- [ ] Un bouton "Exporter les sources" est disponible sur les réponses avec citations
- [ ] Les formats de citation courants sont supportés (APA, MLA, Chicago, BibTeX)
- [ ] Les métadonnées de chaque source sont extraites (auteur, date, titre, éditeur)
- [ ] La bibliographie est copiable dans le presse-papiers ou téléchargeable
- [ ] Les citations manquant de métadonnées sont signalées

---

### US-103 : Recherche d'images et de vidéos `P2`

**Description** : En tant qu'utilisateur, je veux que la recherche web puisse retourner des images et des vidéos pertinentes, afin d'enrichir les réponses visuellement.

**Critères d'acceptation** :
- [ ] Les images pertinentes sont affichées dans les résultats de recherche
- [ ] Les vidéos sont présentées avec une miniature, un titre et la durée
- [ ] Les images sont affichées en grille ou en galerie dans la réponse
- [ ] Cliquer sur une image l'ouvre en lightbox ou affiche la source
- [ ] Les vidéos peuvent être prévisualisées dans le chat (embed)

---

### US-104 : Carte et données géolocalisées `P3`

**Description** : En tant qu'utilisateur, je veux que l'assistant puisse afficher des résultats géolocalisés sur une carte, afin de visualiser les informations spatiales dans mes recherches.

**Critères d'acceptation** :
- [ ] Les résultats avec des coordonnées géographiques sont affichés sur une carte interactive
- [ ] La carte est zoomable et pannable
- [ ] Les points d'intérêt sont cliquables pour afficher des détails
- [ ] Les itinéraires et distances peuvent être calculés
- [ ] La carte est intégrée dans le fil de conversation sans popup externe
