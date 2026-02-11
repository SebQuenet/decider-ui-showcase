# 14 — Accessibilité

Fonctionnalités liées aux thèmes visuels, à la conformité ARIA, à la navigation clavier et au support des besoins spécifiques.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Perplexity, HuggingChat

---

### US-180 : Thème sombre `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir activer un thème sombre, afin de réduire la fatigue oculaire lors d'une utilisation prolongée ou en environnement peu éclairé.

**Critères d'acceptation** :
- [ ] Un thème sombre est disponible dans les paramètres
- [ ] Le thème sombre couvre tous les éléments de l'interface (chat, sidebar, menus, modals)
- [ ] Les contrastes respectent les normes WCAG 2.1 AA (ratio minimum 4.5:1)
- [ ] Les blocs de code utilisent un thème de coloration syntaxique adapté au mode sombre
- [ ] La transition entre thèmes est fluide (pas de flash blanc)

---

### US-181 : Thème clair `P0`

**Description** : En tant qu'utilisateur, je veux disposer d'un thème clair par défaut, afin d'avoir une interface lisible en conditions d'éclairage normal.

**Critères d'acceptation** :
- [ ] Le thème clair est le thème par défaut
- [ ] Les contrastes respectent les normes WCAG 2.1 AA
- [ ] Les éléments interactifs sont clairement distinguables
- [ ] Les blocs de code utilisent un thème de coloration syntaxique adapté au mode clair
- [ ] Le thème est cohérent sur tous les écrans et composants

---

### US-182 : Détection automatique du thème système `P1`

**Description** : En tant qu'utilisateur, je veux que l'application détecte automatiquement la préférence de thème de mon système, afin de s'adapter sans configuration manuelle.

**Critères d'acceptation** :
- [ ] L'application détecte `prefers-color-scheme` du système
- [ ] Le thème s'adapte automatiquement quand la préférence système change
- [ ] Un mode "Auto" est proposé en plus des modes clair et sombre
- [ ] Le mode auto est le réglage par défaut
- [ ] L'utilisateur peut forcer un thème indépendamment du système

---

### US-183 : Rôles et labels ARIA `P0`

**Description** : En tant qu'utilisateur de lecteur d'écran, je veux que tous les éléments de l'interface soient correctement annotés avec des rôles et labels ARIA, afin de pouvoir naviguer et interagir efficacement.

**Critères d'acceptation** :
- [ ] Tous les éléments interactifs ont un `aria-label` ou un texte accessible
- [ ] Les régions de la page sont définies avec les rôles ARIA appropriés (main, navigation, complementary)
- [ ] Les messages du chat ont le rôle `log` ou équivalent pour les lecteurs d'écran
- [ ] Les états dynamiques (chargement, erreur) sont annoncés via `aria-live`
- [ ] L'application est testée avec au moins un lecteur d'écran (VoiceOver, NVDA)

---

### US-184 : Navigation complète au clavier `P0`

**Description** : En tant qu'utilisateur ne pouvant pas utiliser de souris, je veux pouvoir naviguer dans toute l'interface au clavier, afin d'accéder à toutes les fonctionnalités.

**Critères d'acceptation** :
- [ ] Tous les éléments interactifs sont atteignables par Tab/Shift+Tab
- [ ] L'ordre de tabulation est logique et prévisible
- [ ] Un indicateur de focus est toujours visible sur l'élément actif
- [ ] Les menus et modals sont navigables avec les flèches et fermables avec Escape
- [ ] Les pièges de focus (focus traps) sont implémentés dans les modals

---

### US-185 : Skip links `P1`

**Description** : En tant qu'utilisateur de clavier ou de lecteur d'écran, je veux disposer de liens d'accès rapide aux sections principales, afin de ne pas avoir à traverser toute la navigation à chaque fois.

**Critères d'acceptation** :
- [ ] Un lien "Aller au contenu principal" est accessible en premier élément Tab
- [ ] Des liens de saut vers la zone de saisie et la sidebar sont disponibles
- [ ] Les liens de saut sont masqués visuellement par défaut et apparaissent au focus
- [ ] La navigation par les liens de saut déplace le focus correctement
- [ ] Les liens de saut fonctionnent dans tous les contextes (nouveau chat, conversation, paramètres)

---

### US-186 : Taille de police ajustable `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir ajuster la taille de la police de l'interface, afin d'adapter la lisibilité à ma vue.

**Critères d'acceptation** :
- [ ] Un réglage de taille de police est disponible dans les paramètres d'accessibilité
- [ ] Au moins 3 niveaux sont proposés (petit, normal, grand) ou un slider
- [ ] Le redimensionnement affecte tous les textes de l'interface
- [ ] La mise en page s'adapte sans casser le layout
- [ ] Le réglage est persisté dans les préférences

---

### US-187 : Support de la police dyslexie `P2`

**Description** : En tant qu'utilisateur dyslexique, je veux pouvoir activer une police optimisée pour la dyslexie, afin de lire plus facilement les réponses de l'assistant.

**Critères d'acceptation** :
- [ ] Une police dyslexie (ex. OpenDyslexic) est disponible dans les paramètres
- [ ] La police est appliquée à tous les textes de l'interface
- [ ] L'espacement des lignes et des lettres est ajusté automatiquement
- [ ] Les performances de rendu ne sont pas dégradées
- [ ] La police est téléchargée de manière optimisée (subset, lazy loading)

---

### US-188 : Mode contraste élevé `P1`

**Description** : En tant qu'utilisateur malvoyant, je veux activer un mode contraste élevé, afin de distinguer plus facilement les éléments de l'interface.

**Critères d'acceptation** :
- [ ] Un mode contraste élevé est disponible dans les paramètres d'accessibilité
- [ ] Les ratios de contraste atteignent WCAG AAA (7:1 minimum)
- [ ] Les bordures et les séparateurs sont renforcés
- [ ] Les éléments interactifs sont doublement signalés (couleur + forme/bordure)
- [ ] Le mode est compatible avec les modes contraste élevé du système d'exploitation

---

### US-189 : Réduction des animations `P1`

**Description** : En tant qu'utilisateur sensible aux animations, je veux pouvoir réduire ou désactiver les animations de l'interface, afin d'éviter les désagréments ou les problèmes de santé.

**Critères d'acceptation** :
- [ ] L'application respecte la media query `prefers-reduced-motion`
- [ ] Un toggle permet de désactiver les animations manuellement
- [ ] En mode réduit, les transitions sont instantanées ou très courtes
- [ ] Le streaming de texte reste fonctionnel (les tokens apparaissent sans animation)
- [ ] Les animations essentielles (chargement) sont conservées sous forme simplifiée

---

### US-190 : Annonces des mises à jour de contenu `P1`

**Description** : En tant qu'utilisateur de lecteur d'écran, je veux être notifié quand de nouveaux messages apparaissent dans la conversation, afin de ne pas manquer les réponses de l'assistant.

**Critères d'acceptation** :
- [ ] Les nouveaux messages sont annoncés via `aria-live="polite"`
- [ ] La fin du streaming est annoncée pour indiquer que la réponse est complète
- [ ] Les erreurs et les avertissements sont annoncés via `aria-live="assertive"`
- [ ] Les annonces ne sont pas excessives pour ne pas submerger l'utilisateur
- [ ] Les annonces incluent l'auteur du message (utilisateur ou assistant)

---

### US-191 : Descriptions alternatives pour les images `P0`

**Description** : En tant qu'utilisateur de lecteur d'écran, je veux que toutes les images aient une description alternative, afin de comprendre le contenu visuel.

**Critères d'acceptation** :
- [ ] Toutes les images décoratives ont un `alt=""` pour être ignorées
- [ ] Les images de contenu ont un `alt` descriptif
- [ ] Les images générées par IA incluent une description basée sur le prompt
- [ ] Les graphiques et visualisations ont un texte alternatif résumant les données
- [ ] Les captures d'écran uploadées peuvent être accompagnées d'une description par l'utilisateur

---

### US-192 : Espacement et densité configurables `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir ajuster la densité de l'interface (espacement entre les éléments), afin d'adapter l'affichage à mes préférences de confort.

**Critères d'acceptation** :
- [ ] Trois niveaux de densité sont proposés (compact, normal, aéré)
- [ ] Le changement affecte l'espacement entre les messages, les paddings et les marges
- [ ] Le mode compact maximise le contenu visible à l'écran
- [ ] Le mode aéré améliore la lisibilité avec plus d'espace blanc
- [ ] Le réglage est persisté dans les préférences

---

### US-193 : Test automatisé d'accessibilité `P1`

**Description** : En tant que développeur, je veux que l'application passe des tests automatisés d'accessibilité, afin de garantir le respect continu des normes.

**Critères d'acceptation** :
- [ ] Des tests axe-core ou équivalent sont intégrés dans la CI
- [ ] Aucune violation critique (A ou AA) n'est tolérée
- [ ] Les violations sont reportées avec des suggestions de correction
- [ ] Les tests couvrent les principales pages et composants
- [ ] Un rapport d'accessibilité est généré à chaque build
