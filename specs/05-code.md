# 05 — Code

Fonctionnalités liées à l'affichage, l'édition, l'exécution et la gestion du code dans le chat.

**Plateformes de référence** : ChatGPT (Canvas), Claude (Artifacts), Cursor, Replit, Phind, Copilot, Mistral Le Chat

---

### US-066 : Numéros de lignes dans les blocs de code `P1`

**Description** : En tant qu'utilisateur, je veux voir des numéros de lignes dans les blocs de code, afin de référencer facilement une ligne spécifique lors de mes échanges avec l'assistant.

**Critères d'acceptation** :
- [ ] Les numéros de lignes sont affichés à gauche du code dans les blocs multi-lignes
- [ ] Les numéros sont stylisés de façon discrète (couleur atténuée) pour ne pas gêner la lecture
- [ ] Les numéros ne sont pas inclus lors de la copie du code
- [ ] L'affichage des numéros peut être optionnel (toggle dans les préférences)
- [ ] Les numéros sont alignés correctement même pour les blocs de centaines de lignes

---

### US-067 : Exécution de code en sandbox `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exécuter du code directement dans le chat dans un environnement sandboxé, afin de tester rapidement le code proposé par l'assistant.

**Critères d'acceptation** :
- [ ] Un bouton "Exécuter" est disponible sur les blocs de code des langages supportés
- [ ] Le code s'exécute dans un environnement isolé (sandbox navigateur ou backend)
- [ ] Le résultat (stdout, stderr) est affiché sous le bloc de code
- [ ] Les langages Python et JavaScript sont supportés au minimum
- [ ] Un timeout est appliqué pour éviter les boucles infinies
- [ ] L'exécution ne peut pas accéder au système de fichiers ou au réseau

---

### US-068 : Artifacts/Canvas panneau latéral `P1`

**Description** : En tant qu'utilisateur, je veux que les contenus substantiels (code, documents, etc.) soient affichés dans un panneau latéral dédié, afin de les consulter et les éditer sans perdre le fil de la conversation.

**Critères d'acceptation** :
- [ ] Un panneau latéral s'ouvre pour afficher les artifacts/canvas
- [ ] Le panneau est redimensionnable
- [ ] Le panneau peut être ouvert/fermé sans perdre son contenu
- [ ] La conversation reste visible et scrollable à côté du panneau
- [ ] Plusieurs artifacts peuvent être navigués dans le même panneau (tabs ou navigation)
- [ ] Le panneau fonctionne correctement sur différentes tailles d'écran

---

### US-069 : Preview HTML/React live `P2`

**Description** : En tant qu'utilisateur, je veux voir un rendu live du code HTML/React généré, afin de visualiser le résultat immédiatement sans quitter le chat.

**Critères d'acceptation** :
- [ ] Le code HTML est rendu dans une iframe sandboxée
- [ ] Le code React/JSX est compilé et rendu en temps réel
- [ ] Le rendu se met à jour automatiquement quand le code est modifié
- [ ] Les erreurs de rendu sont affichées de façon lisible
- [ ] La preview est redimensionnable et peut être ouverte en plein écran
- [ ] Le CSS du code prévisualisé est isolé du CSS de l'application

---

### US-070 : Diff view pour modifications `P2`

**Description** : En tant qu'utilisateur, je veux voir les modifications de code sous forme de diff, afin de comprendre exactement ce que l'assistant a changé entre deux versions.

**Critères d'acceptation** :
- [ ] Les lignes ajoutées sont affichées en vert, les supprimées en rouge
- [ ] Le diff est affiché dans un format side-by-side ou inline au choix
- [ ] Le contexte autour des changements est affiché (lignes inchangées)
- [ ] Les modifications sont numérotées et navigables
- [ ] Un résumé des changements est affiché (X lignes ajoutées, Y supprimées)

---

### US-071 : Application directe des modifications `P3`

**Description** : En tant que développeur, je veux pouvoir appliquer directement les modifications de code suggérées par l'assistant dans mon projet, afin de gagner du temps sur les copier-coller manuels.

**Critères d'acceptation** :
- [ ] Un bouton "Appliquer" est disponible sur les diffs et les blocs de code
- [ ] L'application est précédée d'une confirmation
- [ ] Les modifications sont appliquées au fichier correct dans le contexte du projet
- [ ] Un mécanisme d'annulation (undo) est disponible après application
- [ ] Les conflits éventuels sont signalés avant application

---

### US-072 : Multi-fichiers dans les artifacts `P2`

**Description** : En tant que développeur, je veux que les artifacts puissent contenir plusieurs fichiers, afin de travailler sur des projets multi-fichiers dans le panneau latéral.

**Critères d'acceptation** :
- [ ] Le panneau artifact affiche un explorateur de fichiers ou des onglets pour plusieurs fichiers
- [ ] Chaque fichier a son propre éditeur avec coloration syntaxique
- [ ] L'assistant peut créer, modifier et supprimer des fichiers dans l'artifact
- [ ] Les imports entre fichiers sont résolus dans la preview
- [ ] L'arborescence est affichée de façon claire

---

### US-073 : Historique des versions d'un artifact `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir naviguer dans l'historique des versions d'un artifact, afin de comparer les itérations ou revenir à une version précédente.

**Critères d'acceptation** :
- [ ] Chaque modification de l'artifact crée une nouvelle version
- [ ] Une timeline ou un sélecteur de version est disponible
- [ ] L'utilisateur peut visualiser n'importe quelle version passée
- [ ] Un diff entre versions est disponible
- [ ] L'utilisateur peut restaurer une version précédente

---

### US-074 : Export/téléchargement d'un artifact `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir télécharger un artifact, afin de sauvegarder le code ou le document généré sur mon ordinateur.

**Critères d'acceptation** :
- [ ] Un bouton "Télécharger" est disponible dans le panneau artifact
- [ ] Le fichier est téléchargé avec le bon nom et la bonne extension
- [ ] Pour les artifacts multi-fichiers, un téléchargement en ZIP est proposé
- [ ] Le contenu téléchargé correspond exactement au contenu affiché
- [ ] Le téléchargement fonctionne pour tous les types d'artifacts (code, texte, HTML)

---

### US-075 : Terminal intégré `P3`

**Description** : En tant que développeur, je veux un terminal intégré dans l'interface, afin de pouvoir exécuter des commandes sans quitter le chat.

**Critères d'acceptation** :
- [ ] Un terminal est accessible via un panneau ou un onglet dédié
- [ ] Le terminal supporte les commandes shell standard
- [ ] L'historique des commandes est conservé pendant la session
- [ ] Le terminal est redimensionnable
- [ ] Le copier-coller fonctionne dans le terminal
- [ ] L'assistant peut suggérer des commandes à exécuter dans le terminal

---

### US-076 : Revue de code inline `P3`

**Description** : En tant que développeur, je veux que l'assistant puisse faire une revue de code avec des commentaires inline, afin d'avoir un feedback précis ligne par ligne.

**Critères d'acceptation** :
- [ ] Les commentaires de revue sont affichés en marge du code, à côté de la ligne concernée
- [ ] Chaque commentaire indique le type (bug, suggestion, amélioration, style)
- [ ] Les commentaires sont repliables individuellement
- [ ] Un résumé de la revue est affiché en haut (nombre de commentaires par type)
- [ ] L'utilisateur peut marquer un commentaire comme "résolu"

---

### US-077 : Portage de code entre langages `P2`

**Description** : En tant que développeur, je veux pouvoir demander le portage d'un bloc de code vers un autre langage, afin de réutiliser une logique dans un contexte technique différent.

**Critères d'acceptation** :
- [ ] Un bouton ou une action "Convertir vers..." est disponible sur les blocs de code
- [ ] Un sélecteur de langage cible est proposé
- [ ] Le code converti est affiché dans un nouveau bloc ou dans le panneau artifact
- [ ] Le code source et le code cible sont comparables côte à côte
- [ ] Les idiomes du langage cible sont respectés (pas de traduction littérale)

---

### US-078 : Debug automatisé `P3`

**Description** : En tant que développeur, je veux que l'assistant puisse analyser et debugger automatiquement du code contenant des erreurs, afin de comprendre et corriger les bugs plus rapidement.

**Critères d'acceptation** :
- [ ] L'assistant peut analyser un message d'erreur collé avec le code correspondant
- [ ] Les erreurs sont localisées avec un pointage précis dans le code
- [ ] Une explication de la cause de l'erreur est fournie
- [ ] Une correction est proposée avec un diff
- [ ] Les erreurs communes (syntaxe, types, null reference) sont détectées automatiquement

---

### US-079 : Wrap de code long (scroll horizontal vs wrap) `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir choisir entre le scroll horizontal et le retour à la ligne automatique pour les longues lignes de code, afin d'adapter l'affichage à ma préférence.

**Critères d'acceptation** :
- [ ] Par défaut, les lignes longues déclenchent un scroll horizontal
- [ ] Un toggle permet de basculer en mode wrap (retour à la ligne)
- [ ] Le toggle est accessible sur chaque bloc de code ou globalement dans les préférences
- [ ] En mode wrap, l'indentation visuelle est préservée pour les lignes wrappées
- [ ] Le choix est persisté dans les préférences utilisateur
