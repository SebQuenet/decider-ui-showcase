# 02 — Affichage des messages

Fonctionnalités liées au rendu, à la mise en forme et à la présentation des messages dans le fil de conversation.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Perplexity, Copilot, Mistral Le Chat, DeepSeek, Phind, Cursor

---

### US-016 : Bulles de messages user/assistant `P0`

**Description** : En tant qu'utilisateur, je veux que les messages de l'utilisateur et de l'assistant soient visuellement distincts, afin de suivre facilement le fil de la conversation.

**Critères d'acceptation** :
- [ ] Les messages utilisateur et assistant ont des styles visuellement différents (couleur, alignement ou forme)
- [ ] L'auteur de chaque message est identifiable sans ambiguïté
- [ ] Les messages sont affichés dans l'ordre chronologique
- [ ] La largeur des messages s'adapte au contenu avec une largeur maximale
- [ ] Le style est cohérent en dark mode et light mode

---

### US-017 : Rendu Markdown complet `P0`

**Description** : En tant qu'utilisateur, je veux que les réponses de l'assistant soient rendues en Markdown, afin de bénéficier d'une mise en forme riche et lisible.

**Critères d'acceptation** :
- [ ] Les titres (h1-h6), le gras, l'italique, le barré et le souligné sont rendus correctement
- [ ] Les listes ordonnées et non ordonnées sont rendues
- [ ] Les blocs de citation (blockquote) sont stylisés
- [ ] Les séparateurs horizontaux sont rendus
- [ ] Le Markdown invalide ou partiel est géré gracieusement sans casser l'affichage
- [ ] Le rendu est fidèle à la spécification CommonMark

---

### US-018 : Code blocks avec syntax highlighting `P0`

**Description** : En tant qu'utilisateur, je veux que les blocs de code soient affichés avec une coloration syntaxique, afin de lire et comprendre facilement le code partagé par l'assistant.

**Critères d'acceptation** :
- [ ] Les blocs de code (triple backtick) sont rendus dans un conteneur dédié avec fond distinct
- [ ] La coloration syntaxique est appliquée selon le langage spécifié
- [ ] Au moins 20 langages courants sont supportés (JS, TS, Python, Java, C++, Go, Rust, HTML, CSS, SQL, etc.)
- [ ] Le code inline (simple backtick) est stylisé distinctement du texte normal
- [ ] La police utilisée est monospace
- [ ] Le langage détecté est affiché dans l'en-tête du bloc de code

---

### US-019 : Bouton copier sur les code blocks `P0`

**Description** : En tant qu'utilisateur, je veux un bouton pour copier le contenu d'un bloc de code en un clic, afin de le réutiliser facilement dans mon éditeur ou terminal.

**Critères d'acceptation** :
- [ ] Un bouton "Copier" est affiché dans le coin supérieur droit de chaque bloc de code
- [ ] Cliquer sur le bouton copie le contenu brut du code dans le presse-papiers
- [ ] Un feedback visuel confirme la copie (icône check, tooltip "Copié !")
- [ ] Le feedback revient à l'état initial après 2 secondes
- [ ] Le bouton n'apparaît qu'au survol du bloc ou est toujours visible selon le design choisi

---

### US-020 : Rendu LaTeX/KaTeX `P1`

**Description** : En tant qu'utilisateur, je veux que les formules mathématiques en LaTeX soient rendues visuellement, afin de lire des équations complexes de façon lisible.

**Critères d'acceptation** :
- [ ] Les formules inline ($...$) sont rendues dans le flux du texte
- [ ] Les formules en bloc ($$...$$) sont rendues centrées sur leur propre ligne
- [ ] Le rendu est fidèle aux standards LaTeX pour les symboles, fractions, matrices, etc.
- [ ] Les formules invalides affichent le source LaTeX brut sans casser le rendu
- [ ] Le rendu est performant même avec de nombreuses formules

---

### US-021 : Tableaux Markdown `P1`

**Description** : En tant qu'utilisateur, je veux que les tableaux Markdown soient rendus sous forme de tableaux HTML stylisés, afin de lire les données structurées confortablement.

**Critères d'acceptation** :
- [ ] Les tableaux Markdown sont rendus en tableaux HTML avec bordures et padding
- [ ] L'alignement des colonnes (gauche, centre, droite) est respecté
- [ ] Les tableaux larges sont scrollables horizontalement sans casser le layout
- [ ] Le style des tableaux est cohérent avec le thème (dark/light)
- [ ] Le Markdown dans les cellules (gras, code inline, liens) est rendu correctement

---

### US-022 : Diagrammes Mermaid `P2`

**Description** : En tant qu'utilisateur avancé, je veux que les blocs de code Mermaid soient rendus en diagrammes visuels, afin de visualiser des flux, graphes et séquences directement dans le chat.

**Critères d'acceptation** :
- [ ] Les blocs de code avec le langage "mermaid" sont rendus en SVG
- [ ] Les types de diagrammes courants sont supportés (flowchart, sequence, class, gantt, pie)
- [ ] Le diagramme est lisible et correctement dimensionné
- [ ] Un fallback vers le code source est affiché si le rendu échoue
- [ ] Le diagramme est zoomable ou ouvrable en plein écran

---

### US-023 : Images inline dans les réponses `P1`

**Description** : En tant qu'utilisateur, je veux que les images incluses dans les réponses de l'assistant soient affichées inline, afin de voir les résultats visuels directement dans la conversation.

**Critères d'acceptation** :
- [ ] Les images référencées en Markdown (![alt](url)) sont affichées inline
- [ ] Les images générées par l'assistant sont affichées dans le message
- [ ] Les images sont redimensionnées pour s'adapter à la largeur du message
- [ ] Cliquer sur une image l'ouvre en taille réelle (lightbox)
- [ ] Un texte alternatif est affiché si l'image ne charge pas

---

### US-024 : Listes imbriquées `P1`

**Description** : En tant qu'utilisateur, je veux que les listes imbriquées soient correctement rendues avec indentation, afin de lire des contenus hiérarchiques clairement.

**Critères d'acceptation** :
- [ ] Les listes non ordonnées imbriquées affichent des puces différentes par niveau
- [ ] Les listes ordonnées imbriquées gèrent la numérotation par niveau
- [ ] L'imbrication fonctionne jusqu'à au moins 4 niveaux
- [ ] Le mélange listes ordonnées/non ordonnées est supporté
- [ ] L'indentation visuelle est claire et cohérente

---

### US-025 : Liens cliquables `P0`

**Description** : En tant qu'utilisateur, je veux que les URLs dans les réponses soient cliquables, afin de pouvoir naviguer vers les ressources référencées.

**Critères d'acceptation** :
- [ ] Les liens Markdown [texte](url) sont rendus comme des liens cliquables
- [ ] Les URLs brutes dans le texte sont automatiquement transformées en liens cliquables
- [ ] Les liens s'ouvrent dans un nouvel onglet (target="_blank")
- [ ] Les liens sont stylisés de façon distincte (couleur, soulignement)
- [ ] L'attribut rel="noopener noreferrer" est ajouté pour la sécurité

---

### US-026 : Typing indicator `P0`

**Description** : En tant qu'utilisateur, je veux voir un indicateur visuel quand l'assistant est en train de réfléchir ou de préparer sa réponse, afin de savoir que ma requête est en cours de traitement.

**Critères d'acceptation** :
- [ ] Un indicateur animé est affiché pendant que l'assistant traite la requête (avant le premier token)
- [ ] L'indicateur est positionné à l'endroit où le message de l'assistant apparaîtra
- [ ] L'animation est subtile et non distrayante (points animés, pulsation)
- [ ] L'indicateur disparaît dès que le premier token de la réponse arrive
- [ ] L'indicateur est accessible (aria-label décrivant l'état)

---

### US-027 : Streaming token par token `P0`

**Description** : En tant qu'utilisateur, je veux voir la réponse de l'assistant s'afficher progressivement token par token, afin de commencer à lire immédiatement sans attendre la fin de la génération.

**Critères d'acceptation** :
- [ ] Les tokens sont affichés au fur et à mesure de leur réception
- [ ] Le rendu est fluide sans saccade visible
- [ ] Le curseur ou indicateur de fin de texte est visible pendant le streaming
- [ ] L'auto-scroll suit le dernier token affiché
- [ ] L'utilisateur peut scroller vers le haut pendant le streaming sans être ramené en bas
- [ ] La latence entre la réception d'un token et son affichage est inférieure à 50ms

---

### US-028 : Bouton copier le message entier `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir copier l'intégralité d'un message de l'assistant, afin de le réutiliser ailleurs (email, document, etc.).

**Critères d'acceptation** :
- [ ] Un bouton "Copier" est disponible sur chaque message de l'assistant
- [ ] Le contenu copié est en Markdown brut (pas le HTML rendu)
- [ ] Un feedback visuel confirme la copie
- [ ] Le bouton est accessible au survol ou via un menu d'actions du message
- [ ] Les blocs de code dans le message sont inclus dans la copie

---

### US-029 : Bloc thinking/raisonnement repliable `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir voir le processus de réflexion de l'assistant dans un bloc repliable, afin de comprendre son raisonnement quand je le souhaite sans encombrer la vue.

**Critères d'acceptation** :
- [ ] Le bloc de réflexion est affiché dans un conteneur distinct et repliable
- [ ] Le bloc est replié par défaut avec un résumé ou un label "Réflexion"
- [ ] Cliquer sur le bloc le déplie pour révéler le contenu complet
- [ ] Le contenu du thinking supporte le Markdown
- [ ] Le streaming du thinking est visible en temps réel quand le bloc est déplié
- [ ] La durée de réflexion est affichée (ex. "15 secondes de réflexion")

---

### US-030 : Citations numérotées `P1`

**Description** : En tant qu'utilisateur, je veux que les sources citées par l'assistant soient numérotées et cliquables, afin de vérifier facilement les informations.

**Critères d'acceptation** :
- [ ] Les citations sont affichées comme des numéros cliquables dans le texte [1], [2], etc.
- [ ] Cliquer sur un numéro scrolle vers la source correspondante ou ouvre un popover
- [ ] Les citations sont visuellement distinctes du texte (style badge ou exposant)
- [ ] La liste complète des sources est disponible en bas du message
- [ ] Chaque source affiche un titre, un domaine et éventuellement un favicon

---

### US-031 : Panneau de sources `P2`

**Description** : En tant qu'utilisateur, je veux un panneau dédié listant toutes les sources utilisées par l'assistant, afin de parcourir et vérifier les références de façon structurée.

**Critères d'acceptation** :
- [ ] Un panneau latéral ou un accordion liste toutes les sources d'une réponse
- [ ] Chaque source affiche le titre, l'URL, un extrait et éventuellement une date
- [ ] Les sources sont cliquables et ouvrent l'URL dans un nouvel onglet
- [ ] Le panneau est scrollable si beaucoup de sources sont présentes
- [ ] Le panneau est fermable et ne gêne pas la lecture de la conversation

---

### US-032 : Previews de liens (link cards) `P2`

**Description** : En tant qu'utilisateur, je veux que les liens partagés affichent un aperçu riche (titre, description, image), afin de comprendre le contenu d'un lien avant de cliquer.

**Critères d'acceptation** :
- [ ] Les URLs partagées génèrent automatiquement un aperçu (Open Graph / meta tags)
- [ ] L'aperçu affiche au minimum le titre et le domaine
- [ ] L'image OG est affichée si disponible
- [ ] L'aperçu est cliquable et ouvre le lien
- [ ] Un fallback est affiché si les métadonnées ne sont pas disponibles

---

### US-033 : Horodatage des messages `P1`

**Description** : En tant qu'utilisateur, je veux voir l'heure d'envoi de chaque message, afin de situer temporellement les échanges.

**Critères d'acceptation** :
- [ ] L'heure est affichée de façon discrète sur chaque message (ex. au survol ou en petit sous le message)
- [ ] Le format est adapté au contexte (heure si aujourd'hui, date+heure sinon)
- [ ] L'heure est affichée dans le fuseau horaire local de l'utilisateur
- [ ] Le format de date respecte les conventions locales

---

### US-034 : Avatar utilisateur et assistant `P1`

**Description** : En tant qu'utilisateur, je veux voir des avatars pour l'utilisateur et l'assistant à côté de chaque message, afin d'identifier visuellement l'auteur d'un coup d'œil.

**Critères d'acceptation** :
- [ ] L'assistant a un avatar/icône reconnaissable
- [ ] L'utilisateur a un avatar (initiales, gravatar ou photo de profil)
- [ ] Les avatars sont affichés de façon cohérente à côté de chaque message
- [ ] L'avatar de l'assistant peut varier selon le modèle sélectionné
- [ ] Les avatars sont de taille appropriée et ne dominent pas le contenu

---

### US-035 : Rendu progressif du Markdown pendant le streaming `P0`

**Description** : En tant qu'utilisateur, je veux que le Markdown soit rendu progressivement pendant le streaming, afin de voir la mise en forme en temps réel plutôt que du texte brut.

**Critères d'acceptation** :
- [ ] Le Markdown est parsé et rendu incrémentalement au fur et à mesure du streaming
- [ ] Les blocs de code sont colorés syntaxiquement dès que le langage est identifié
- [ ] Les éléments incomplets (bloc de code non fermé, liste en cours) sont gérés sans casser le rendu
- [ ] Le rendu est performant et ne cause pas de scintillement (flickering)
- [ ] La transition entre le streaming et le rendu final est imperceptible
- [ ] Les tableaux, listes et formules LaTeX se construisent progressivement
