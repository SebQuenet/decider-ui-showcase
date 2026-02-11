# 09 — Personnalisation

Fonctionnalités liées aux instructions personnalisées, aux styles de réponse, aux bots/GPTs custom et aux personas.

**Plateformes de référence** : ChatGPT (GPTs, Custom Instructions), Claude (Projects, Styles), Gemini (Gems), Poe, Character.AI, Copilot

---

### US-117 : Instructions personnalisées globales `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir définir des instructions personnalisées appliquées à toutes mes conversations, afin que l'assistant connaisse mon contexte et mes préférences sans avoir à les répéter.

**Critères d'acceptation** :
- [ ] Un formulaire accessible depuis les paramètres permet de saisir des instructions personnalisées
- [ ] Les instructions sont divisées en deux champs : "À propos de moi" et "Comment répondre"
- [ ] Les instructions sont appliquées automatiquement à chaque nouvelle conversation
- [ ] Les instructions sont modifiables à tout moment
- [ ] Un compteur indique la longueur restante disponible

---

### US-118 : Styles de réponse prédéfinis `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir choisir un style de réponse parmi des presets, afin d'adapter le ton et le format des réponses à mon besoin sans rédiger des instructions manuelles.

**Critères d'acceptation** :
- [ ] Des styles prédéfinis sont proposés (concis, détaillé, formel, décontracté, technique, pédagogique)
- [ ] Le style sélectionné influence le ton, la longueur et le format des réponses
- [ ] Le style peut être changé par conversation ou globalement
- [ ] Le style actif est indiqué dans l'interface
- [ ] L'utilisateur peut prévisualiser l'effet d'un style sur un exemple de réponse

---

### US-119 : Création de style de réponse personnalisé `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir créer mes propres styles de réponse à partir d'exemples ou de descriptions, afin d'avoir un contrôle fin sur le ton de l'assistant.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer un style en fournissant une description ou des exemples de réponses souhaitées
- [ ] Le système génère un style à partir de l'analyse des exemples fournis
- [ ] Le style personnalisé est sauvegardé et réutilisable
- [ ] L'utilisateur peut nommer et modifier ses styles personnalisés
- [ ] Les styles personnalisés sont accessibles dans le même sélecteur que les styles prédéfinis

---

### US-120 : Création de GPT/bot personnalisé `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir créer des assistants personnalisés avec des instructions, un nom et un avatar spécifiques, afin de disposer de bots spécialisés pour différents cas d'usage.

**Critères d'acceptation** :
- [ ] Un formulaire de création permet de définir un nom, une description, un avatar et des instructions
- [ ] Le bot personnalisé utilise les instructions définies comme system prompt
- [ ] Des fichiers de connaissances peuvent être uploadés pour enrichir le bot
- [ ] Le bot est accessible depuis le menu de nouvelle conversation
- [ ] Le bot peut être dupliqué et modifié

---

### US-121 : Store/galerie de GPTs/bots `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir parcourir et utiliser des bots créés par d'autres utilisateurs, afin de bénéficier de l'expertise de la communauté.

**Critères d'acceptation** :
- [ ] Une galerie affiche les bots publics classés par catégories
- [ ] Chaque bot affiche son nom, sa description, sa note et son nombre d'utilisations
- [ ] L'utilisateur peut lancer une conversation avec un bot en un clic
- [ ] Un moteur de recherche permet de trouver des bots par mots-clés
- [ ] Les bots peuvent être ajoutés aux favoris

---

### US-122 : Langue de réponse préférée `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir définir la langue dans laquelle l'assistant doit répondre, afin d'obtenir des réponses dans ma langue préférée indépendamment de la langue de ma question.

**Critères d'acceptation** :
- [ ] Un sélecteur de langue est disponible dans les paramètres
- [ ] La langue sélectionnée est appliquée par défaut à toutes les réponses
- [ ] La langue peut être changée par conversation
- [ ] Un mode "auto-détection" répond dans la langue du message de l'utilisateur
- [ ] Les langues principales sont supportées (français, anglais, espagnol, allemand, etc.)

---

### US-123 : Persona de l'assistant `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir attribuer une persona à l'assistant (expert, coach, tuteur, etc.), afin qu'il adopte un rôle spécifique dans la conversation.

**Critères d'acceptation** :
- [ ] Des personas prédéfinies sont disponibles (expert technique, coach, tuteur, rédacteur, etc.)
- [ ] Chaque persona influence le ton, le niveau de détail et l'approche des réponses
- [ ] L'utilisateur peut créer ses propres personas
- [ ] La persona active est indiquée dans l'interface
- [ ] La persona peut être changée en cours de conversation

---

### US-124 : Base de connaissances par projet `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir créer des projets avec des fichiers de connaissances associés, afin que l'assistant ait accès à un contexte spécifique pour chaque projet.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer des projets avec un nom et une description
- [ ] Des fichiers peuvent être uploadés dans chaque projet comme base de connaissances
- [ ] Les conversations liées à un projet utilisent automatiquement ses fichiers
- [ ] Les fichiers du projet sont listés et gérables (ajout, suppression)
- [ ] La taille totale des fichiers par projet est limitée avec un indicateur d'utilisation

---

### US-125 : Format de réponse préféré `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir définir un format de réponse préféré, afin que l'assistant structure systématiquement ses réponses selon mes préférences.

**Critères d'acceptation** :
- [ ] Des formats sont proposés (texte libre, listes à puces, tableaux, step-by-step)
- [ ] Le format peut être défini globalement ou par conversation
- [ ] Le format est respecté sauf quand il est inadapté au contenu
- [ ] L'utilisateur peut demander un changement de format ponctuellement
- [ ] Le format préféré est persisté dans les préférences

---

### US-126 : Niveau de détail configurable `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir régler le niveau de détail des réponses, afin d'obtenir des réponses plus ou moins approfondies selon mon besoin.

**Critères d'acceptation** :
- [ ] Un réglage permet de choisir le niveau de détail (bref, normal, détaillé, exhaustif)
- [ ] Le niveau influence la longueur et la profondeur des réponses
- [ ] Le réglage est accessible rapidement (widget dans la barre de composition ou paramètres)
- [ ] Le niveau peut être changé à tout moment sans affecter les messages précédents
- [ ] L'assistant respecte le niveau même pour des sujets complexes

---

### US-127 : Starter prompts pour GPTs/bots `P1`

**Description** : En tant que créateur de bot, je veux pouvoir définir des prompts de démarrage pour mon bot, afin de guider les utilisateurs sur les cas d'usage possibles.

**Critères d'acceptation** :
- [ ] Le créateur peut définir 2 à 6 starter prompts
- [ ] Les prompts sont affichés comme des boutons cliquables au démarrage de la conversation
- [ ] Cliquer sur un starter prompt l'envoie comme premier message
- [ ] Les prompts sont édités dans le formulaire de configuration du bot
- [ ] Les prompts sont contextuels et représentatifs des capacités du bot

---

### US-128 : Préférences de disclaimer et avertissements `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir configurer le niveau d'avertissements et de disclaimers dans les réponses, afin d'adapter la prudence de l'assistant à mon niveau d'expertise.

**Critères d'acceptation** :
- [ ] Un réglage permet de choisir le niveau de disclaimers (standard, minimal, détaillé)
- [ ] En mode minimal, les avertissements courants sont masqués
- [ ] En mode détaillé, des avertissements supplémentaires sont ajoutés
- [ ] Le réglage est accessible dans les préférences
- [ ] Les avertissements critiques (sécurité, santé) sont toujours affichés

---

### US-129 : Import/export de configuration `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter et importer mes configurations (instructions, styles, bots), afin de les sauvegarder ou les partager avec d'autres utilisateurs.

**Critères d'acceptation** :
- [ ] Un bouton d'export génère un fichier JSON avec toutes les configurations
- [ ] L'import accepte un fichier JSON et restaure les configurations
- [ ] Un avertissement est affiché si l'import écrase des configurations existantes
- [ ] Les configurations peuvent être exportées sélectivement
- [ ] Le format d'export est documenté et versionné

---

### US-130 : Outils/actions personnalisés pour GPTs `P2`

**Description** : En tant que créateur de bot, je veux pouvoir connecter des APIs externes comme outils de mon bot, afin de lui donner des capacités spécifiques (requêtes HTTP, bases de données, etc.).

**Critères d'acceptation** :
- [ ] Le créateur peut définir des actions via un schéma OpenAPI
- [ ] Les actions sont appelées automatiquement par le bot quand nécessaire
- [ ] L'authentification pour les APIs externes est configurable (API key, OAuth)
- [ ] Les résultats des actions sont intégrés dans les réponses du bot
- [ ] Un log des appels d'actions est disponible pour le débogage
