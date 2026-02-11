# 01 — Composition des messages

Fonctionnalités liées à la saisie, la mise en forme et l'envoi des messages par l'utilisateur.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Perplexity, Copilot, Mistral Le Chat, Grok, DeepSeek, Pi, Poe, HuggingChat

---

### US-001 : Textarea auto-expansible `P0`

**Description** : En tant qu'utilisateur, je veux que la zone de saisie s'agrandisse automatiquement en hauteur à mesure que je tape, afin de toujours voir l'intégralité de mon message sans avoir à scroller dans le champ.

**Critères d'acceptation** :
- [ ] La textarea démarre avec une hauteur d'une ligne
- [ ] La hauteur augmente automatiquement à chaque retour à la ligne ou lorsque le texte dépasse la largeur
- [ ] Une hauteur maximale est définie (ex. 50% du viewport) au-delà de laquelle un scroll interne apparaît
- [ ] La textarea revient à sa hauteur initiale après l'envoi du message
- [ ] Le comportement est fluide, sans saut visuel

---

### US-002 : Envoi par Enter, retour ligne par Shift+Enter `P0`

**Description** : En tant qu'utilisateur, je veux envoyer mon message en appuyant sur Enter et insérer un retour à la ligne avec Shift+Enter, afin d'avoir un envoi rapide tout en pouvant formater mes messages.

**Critères d'acceptation** :
- [ ] Appuyer sur Enter envoie le message immédiatement
- [ ] Appuyer sur Shift+Enter insère un saut de ligne dans la textarea
- [ ] Le message n'est pas envoyé si la textarea est vide ou ne contient que des espaces
- [ ] Le focus reste sur la textarea après l'envoi
- [ ] Le comportement est cohérent sur tous les navigateurs supportés

---

### US-003 : Bouton d'envoi `P0`

**Description** : En tant qu'utilisateur, je veux un bouton d'envoi visible à côté de la textarea, afin de pouvoir envoyer mon message en cliquant, notamment sur mobile.

**Critères d'acceptation** :
- [ ] Un bouton d'envoi est affiché à droite de la textarea
- [ ] Le bouton est désactivé visuellement quand la textarea est vide
- [ ] Cliquer sur le bouton envoie le message (même comportement que Enter)
- [ ] Le bouton affiche une icône reconnaissable (flèche ou avion en papier)
- [ ] Le bouton est suffisamment grand pour être facilement cliquable sur mobile (min 44×44px)

---

### US-004 : Placeholder dynamique `P1`

**Description** : En tant qu'utilisateur, je veux voir un placeholder contextuel dans la textarea, afin d'avoir une indication sur ce que je peux faire ou demander.

**Critères d'acceptation** :
- [ ] Un texte placeholder est affiché quand la textarea est vide
- [ ] Le placeholder disparaît dès que l'utilisateur commence à taper
- [ ] Le texte du placeholder peut varier selon le contexte (nouveau chat, conversation en cours, modèle sélectionné)
- [ ] Le placeholder est stylisé de façon distincte du texte saisi (couleur atténuée)

---

### US-005 : Mentions @ (modèles/agents) `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir mentionner des modèles ou agents avec @, afin de les invoquer ou de les référencer directement dans ma conversation.

**Critères d'acceptation** :
- [ ] Taper @ ouvre un menu de suggestions filtrable
- [ ] La liste affiche les modèles et agents disponibles avec leur icône
- [ ] La sélection d'un élément insère une mention formatée dans la textarea
- [ ] Le filtrage est en temps réel au fur et à mesure de la frappe après @
- [ ] La mention est visuellement distincte du texte normal (badge ou couleur)
- [ ] Le menu se ferme si l'utilisateur appuie sur Escape ou clique en dehors

---

### US-006 : Slash commands (/) `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir utiliser des commandes slash (/), afin d'accéder rapidement à des actions spéciales sans quitter la zone de saisie.

**Critères d'acceptation** :
- [ ] Taper / en début de message ouvre un menu de commandes disponibles
- [ ] Chaque commande affiche un nom, une description courte et éventuellement un raccourci
- [ ] Le menu se filtre au fur et à mesure de la frappe
- [ ] Sélectionner une commande l'exécute ou pré-remplit la textarea
- [ ] Le menu se ferme si l'utilisateur appuie sur Escape ou clique en dehors
- [ ] Les commandes disponibles dépendent du contexte (modèle, plugins actifs)

---

### US-007 : Upload d'images `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir uploader des images à joindre à mon message, afin de les partager avec l'assistant pour analyse ou discussion.

**Critères d'acceptation** :
- [ ] Un bouton d'upload (icône trombone ou image) est accessible près de la textarea
- [ ] Cliquer ouvre un sélecteur de fichiers filtré sur les formats image (JPG, PNG, GIF, WebP)
- [ ] Les images sélectionnées apparaissent en preview miniature avant l'envoi
- [ ] L'utilisateur peut supprimer une image attachée avant l'envoi
- [ ] Une limite de taille par fichier est appliquée avec un message d'erreur clair en cas de dépassement
- [ ] Le nombre maximum d'images par message est défini et communiqué

---

### US-008 : Upload de fichiers et PDF `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir uploader des fichiers (PDF, documents texte, etc.), afin que l'assistant puisse les analyser et répondre à mes questions à leur sujet.

**Critères d'acceptation** :
- [ ] Le sélecteur de fichiers accepte les formats courants (PDF, TXT, CSV, DOCX, XLSX, etc.)
- [ ] Le fichier uploadé est affiché avec son nom, sa taille et une icône de type
- [ ] L'utilisateur peut supprimer un fichier attaché avant l'envoi
- [ ] Une barre de progression est affichée pendant l'upload
- [ ] Les erreurs (format non supporté, taille excessive) sont communiquées clairement
- [ ] Plusieurs fichiers peuvent être attachés à un même message

---

### US-009 : Drag & drop de fichiers `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir glisser-déposer des fichiers directement dans la zone de chat, afin de les attacher sans passer par le sélecteur de fichiers.

**Critères d'acceptation** :
- [ ] Une zone de drop visuelle apparaît quand un fichier est glissé au-dessus de la fenêtre de chat
- [ ] Les fichiers déposés sont traités comme des uploads classiques (mêmes validations)
- [ ] Le drag & drop fonctionne pour les images et les documents
- [ ] Un feedback visuel clair indique que le drop est possible (bordure, overlay)
- [ ] Le drop de fichiers non supportés affiche un message d'erreur

---

### US-010 : Coller une image depuis le presse-papiers `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir coller une image depuis mon presse-papiers (Ctrl+V / Cmd+V) directement dans la textarea, afin d'attacher rapidement des captures d'écran.

**Critères d'acceptation** :
- [ ] Coller une image depuis le presse-papiers l'ajoute en pièce jointe
- [ ] Une preview miniature de l'image collée est affichée
- [ ] Le comportement est compatible avec les captures d'écran système
- [ ] Coller du texte fonctionne toujours normalement quand il n'y a pas d'image dans le presse-papiers
- [ ] L'image collée peut être supprimée avant l'envoi

---

### US-011 : Entrée vocale (speech-to-text) `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir dicter mon message par la voix, afin de saisir du texte plus rapidement ou en mode mains libres.

**Critères d'acceptation** :
- [ ] Un bouton micro est affiché dans ou à côté de la textarea
- [ ] Cliquer sur le micro démarre la reconnaissance vocale avec un feedback visuel (animation, changement de couleur)
- [ ] Le texte reconnu s'insère en temps réel dans la textarea
- [ ] Un second clic ou un silence prolongé arrête la reconnaissance
- [ ] L'utilisateur est informé si la reconnaissance vocale n'est pas supportée par le navigateur
- [ ] La permission microphone est demandée au premier usage

---

### US-012 : Mode voix conversationnel `P3`

**Description** : En tant qu'utilisateur, je veux pouvoir avoir une conversation entièrement vocale avec l'assistant, afin d'interagir de façon naturelle sans clavier.

**Critères d'acceptation** :
- [ ] Un mode voix dédié est accessible depuis l'interface principale
- [ ] L'entrée vocale est automatiquement transcrite et envoyée
- [ ] La réponse de l'assistant est lue à voix haute (TTS)
- [ ] L'utilisateur peut interrompre la réponse vocale
- [ ] Un indicateur visuel montre qui parle (utilisateur ou assistant)
- [ ] Le mode peut être quitté à tout moment pour revenir au mode texte

---

### US-013 : Caméra temps réel `P3`

**Description** : En tant qu'utilisateur, je veux pouvoir partager mon flux caméra en temps réel avec l'assistant, afin qu'il puisse analyser ce que je montre visuellement.

**Critères d'acceptation** :
- [ ] Un bouton caméra permet d'activer le flux vidéo
- [ ] La permission caméra est demandée au premier usage
- [ ] Un aperçu du flux caméra est affiché à l'utilisateur
- [ ] L'assistant peut analyser les frames envoyées et répondre en contexte
- [ ] L'utilisateur peut désactiver la caméra à tout moment
- [ ] Un indicateur clair montre quand la caméra est active

---

### US-014 : Preview des fichiers attachés `P1`

**Description** : En tant qu'utilisateur, je veux voir une prévisualisation des fichiers que j'ai attachés avant de les envoyer, afin de vérifier que j'ai sélectionné les bons fichiers.

**Critères d'acceptation** :
- [ ] Les images attachées sont affichées en miniature
- [ ] Les documents non-image affichent une icône de type, le nom et la taille du fichier
- [ ] Chaque fichier attaché a un bouton de suppression (×)
- [ ] Les previews sont affichées dans une zone dédiée entre la textarea et les messages
- [ ] Cliquer sur une preview d'image l'ouvre en taille réelle (lightbox)

---

### US-015 : Compteur de caractères/tokens `P2`

**Description** : En tant qu'utilisateur avancé, je veux voir un compteur de caractères ou de tokens estimés pour mon message, afin de savoir si je m'approche d'une limite contextuelle.

**Critères d'acceptation** :
- [ ] Un compteur est affiché discrètement près de la textarea (ex. coin inférieur droit)
- [ ] Le compteur se met à jour en temps réel pendant la frappe
- [ ] Le compteur affiche le nombre de caractères et/ou une estimation de tokens
- [ ] Un indicateur visuel (couleur) signale l'approche de la limite
- [ ] Le compteur inclut le contenu des fichiers attachés dans l'estimation si applicable
