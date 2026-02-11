# 20 — Canvas avancé

Raccourcis d'écriture et d'assistance code dans le canvas, en complément du panneau artifacts décrit dans `05-code.md`.

**Plateformes de référence** : ChatGPT (Canvas), Claude (Artifacts), Cursor, Copilot, Replit

---

### US-253 : Sélection de texte avec action contextuelle `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir sélectionner du texte dans le canvas et accéder à des actions contextuelles, afin de modifier ou transformer une portion spécifique du contenu.

**Critères d'acceptation** :
- [ ] Sélectionner du texte dans le canvas fait apparaître une barre d'outils flottante
- [ ] La barre propose des actions contextuelles (reformuler, traduire, simplifier, développer)
- [ ] L'action s'applique uniquement à la sélection, le reste est préservé
- [ ] La barre disparaît quand la sélection est perdue
- [ ] Les actions sont exécutées via l'IA et le résultat remplace la sélection

---

### US-254 : Raccourci "Raccourcir le texte" `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir raccourcir une sélection de texte en un clic, afin de rendre mes contenus plus concis sans réécrire manuellement.

**Critères d'acceptation** :
- [ ] Un bouton "Raccourcir" est disponible dans la barre d'outils contextuelle
- [ ] Le texte est condensé tout en conservant les informations essentielles
- [ ] Le résultat respecte le ton et le style du texte original
- [ ] L'utilisateur peut annuler la modification (undo)
- [ ] La longueur cible peut être indiquée (ex. réduire de 50%)

---

### US-255 : Raccourci "Développer le texte" `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir développer une sélection de texte en un clic, afin d'ajouter des détails et des explications à un passage trop succinct.

**Critères d'acceptation** :
- [ ] Un bouton "Développer" est disponible dans la barre d'outils contextuelle
- [ ] Le texte est enrichi avec des détails, exemples ou explications supplémentaires
- [ ] Le développement est cohérent avec le contexte environnant
- [ ] L'utilisateur peut annuler la modification (undo)
- [ ] L'ampleur du développement est contrôlable

---

### US-256 : Raccourci "Reformuler" `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir reformuler une sélection de texte, afin d'améliorer la clarté ou le style sans changer le sens.

**Critères d'acceptation** :
- [ ] Un bouton "Reformuler" est disponible dans la barre d'outils contextuelle
- [ ] La reformulation préserve le sens original
- [ ] Plusieurs alternatives de reformulation peuvent être proposées
- [ ] Le registre de langue est maintenu (formel, décontracté)
- [ ] L'utilisateur peut annuler la modification (undo)

---

### US-257 : Raccourci "Traduire la sélection" `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir traduire une sélection de texte dans une autre langue, afin de produire rapidement du contenu multilingue.

**Critères d'acceptation** :
- [ ] Un bouton "Traduire" est disponible dans la barre d'outils contextuelle
- [ ] Un sélecteur de langue cible est proposé
- [ ] La traduction remplace ou s'affiche à côté de la sélection
- [ ] Les langues courantes sont accessibles rapidement
- [ ] La qualité de traduction est comparable à un outil dédié

---

### US-258 : Ajustement du ton d'écriture `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir changer le ton d'un passage (formel, décontracté, professionnel, etc.), afin d'adapter le contenu à son audience.

**Critères d'acceptation** :
- [ ] Un menu "Changer le ton" propose des options (formel, décontracté, professionnel, académique, amical)
- [ ] Le changement de ton s'applique à la sélection ou à tout le document
- [ ] Le contenu est réécrit en préservant l'information originale
- [ ] L'utilisateur peut prévisualiser le résultat avant de l'appliquer
- [ ] L'action est annulable (undo)

---

### US-259 : Correction grammaticale et orthographique `P0`

**Description** : En tant qu'utilisateur, je veux que le canvas puisse corriger automatiquement les fautes de grammaire et d'orthographe, afin de produire un texte sans erreurs.

**Critères d'acceptation** :
- [ ] Un bouton "Corriger" est disponible dans la barre d'outils du canvas
- [ ] Les corrections sont surlignées avec possibilité d'accepter ou refuser chacune
- [ ] Les corrections couvrent la grammaire, l'orthographe et la ponctuation
- [ ] Un résumé des corrections est affiché (nombre de corrections, types)
- [ ] La correction fonctionne pour au moins le français et l'anglais

---

### US-260 : Ajout d'émojis et de mise en forme rapide `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir ajouter rapidement des émojis pertinents et de la mise en forme à mon texte dans le canvas, afin d'enrichir visuellement le contenu.

**Critères d'acceptation** :
- [ ] Un bouton "Ajouter des émojis" insère des émojis contextuels dans le texte
- [ ] La mise en forme Markdown rapide est accessible (gras, italique, titres, listes)
- [ ] Un sélecteur d'émojis est intégré dans la barre d'outils
- [ ] L'ajout d'émojis est intelligent et pertinent par rapport au contenu
- [ ] La mise en forme est prévisualisée en temps réel

---

### US-261 : Autocomplétion dans le canvas `P1`

**Description** : En tant qu'utilisateur, je veux que le canvas propose des suggestions d'autocomplétion pendant que j'écris, afin d'accélérer la rédaction.

**Critères d'acceptation** :
- [ ] Des suggestions ghost text (texte grisé) apparaissent pendant la frappe
- [ ] Tab ou flèche droite accepte la suggestion
- [ ] Escape ou continuer à taper ignore la suggestion
- [ ] Les suggestions sont contextuelles et tiennent compte du contenu existant
- [ ] L'autocomplétion peut être désactivée dans les préférences

---

### US-262 : Commentaires IA inline dans le code `P1`

**Description** : En tant que développeur, je veux que l'assistant puisse ajouter des commentaires explicatifs inline dans le code du canvas, afin de comprendre la logique sans quitter l'éditeur.

**Critères d'acceptation** :
- [ ] Un bouton "Ajouter des commentaires" est disponible dans la barre d'outils du canvas code
- [ ] Les commentaires sont insérés aux endroits pertinents (fonctions, logiques complexes)
- [ ] Les commentaires respectent les conventions du langage (// ou # ou /*)
- [ ] L'utilisateur peut supprimer les commentaires ajoutés
- [ ] Le volume de commentaires est configurable (minimal, normal, détaillé)

---

### US-263 : Refactoring de code assisté `P1`

**Description** : En tant que développeur, je veux pouvoir demander un refactoring du code dans le canvas, afin d'améliorer la qualité du code sans changer son comportement.

**Critères d'acceptation** :
- [ ] Un bouton "Refactorer" est disponible dans la barre d'outils du canvas code
- [ ] Les types de refactoring sont proposés (extraire fonction, renommer, simplifier, optimiser)
- [ ] Les modifications sont affichées en diff avant application
- [ ] L'assistant explique les changements proposés
- [ ] L'utilisateur peut accepter ou rejeter chaque modification individuellement

---

### US-264 : Génération de tests depuis le canvas `P2`

**Description** : En tant que développeur, je veux pouvoir générer des tests unitaires pour le code affiché dans le canvas, afin d'assurer la couverture de test sans écrire les tests manuellement.

**Critères d'acceptation** :
- [ ] Un bouton "Générer des tests" est disponible dans la barre d'outils du canvas code
- [ ] Le framework de test est détecté automatiquement ou sélectionnable
- [ ] Les tests couvrent les cas nominaux, les cas limites et les erreurs
- [ ] Les tests sont affichés dans un fichier séparé dans l'artifact
- [ ] Les tests sont exécutables dans la sandbox si disponible

---

### US-265 : Explication de code sélectionné `P1`

**Description** : En tant que développeur, je veux pouvoir sélectionner du code dans le canvas et demander une explication, afin de comprendre une logique complexe sans quitter le contexte.

**Critères d'acceptation** :
- [ ] Sélectionner du code affiche un bouton "Expliquer" dans la barre contextuelle
- [ ] L'explication est affichée dans un tooltip ou un panneau latéral
- [ ] L'explication couvre ce que fait le code, pourquoi et comment
- [ ] Le niveau de détail est adapté à la complexité du code sélectionné
- [ ] L'explication peut être insérée comme commentaire dans le code

---

### US-266 : Conversion de langage dans le canvas `P2`

**Description** : En tant que développeur, je veux pouvoir convertir le code du canvas vers un autre langage de programmation, afin de réutiliser la logique dans un contexte technique différent.

**Critères d'acceptation** :
- [ ] Un bouton "Convertir" est disponible dans la barre d'outils du canvas code
- [ ] Un sélecteur de langage cible est proposé avec les langages courants
- [ ] Le code converti respecte les idiomes et conventions du langage cible
- [ ] Le code source et le code cible sont comparables (split view ou onglets)
- [ ] Les dépendances ou imports nécessaires dans le langage cible sont inclus
