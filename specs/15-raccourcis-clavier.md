# 15 — Raccourcis clavier

Fonctionnalités liées aux raccourcis clavier globaux, à la palette de commandes et aux tooltips d'aide.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Mistral Le Chat, HuggingChat, Cursor

---

### US-194 : Raccourci nouveau chat `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir créer une nouvelle conversation avec un raccourci clavier, afin de démarrer rapidement un nouveau chat sans utiliser la souris.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+N crée une nouvelle conversation
- [ ] Le focus est immédiatement placé dans la textarea
- [ ] Le raccourci fonctionne depuis n'importe quel écran de l'application
- [ ] La conversation précédente est sauvegardée automatiquement
- [ ] Le raccourci est documenté dans l'aide

---

### US-195 : Raccourci focus sur la textarea `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir remettre le focus sur la zone de saisie avec un raccourci, afin de reprendre la saisie rapidement après avoir navigué dans l'interface.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+L ou / place le focus dans la textarea
- [ ] Le contenu existant de la textarea est préservé
- [ ] Le raccourci fonctionne même si le focus est dans la sidebar ou un panneau
- [ ] Le curseur est placé à la fin du texte existant
- [ ] Le raccourci ne déclenche pas d'action dans les éditeurs de code

---

### US-196 : Raccourci toggle sidebar `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir ouvrir et fermer la sidebar avec un raccourci, afin de maximiser l'espace de conversation quand je n'ai pas besoin de la liste des chats.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+B ou Ctrl/Cmd+S toggle la sidebar
- [ ] L'animation d'ouverture/fermeture est fluide
- [ ] L'état de la sidebar est persisté entre les sessions
- [ ] Le focus n'est pas perturbé par le toggle
- [ ] Le raccourci est cohérent avec les conventions des applications courantes

---

### US-197 : Raccourci recherche dans les conversations `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir ouvrir la recherche dans mes conversations avec un raccourci, afin de retrouver rapidement un échange passé.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+K ou Ctrl/Cmd+F ouvre le champ de recherche
- [ ] Le champ de recherche est immédiatement focusé et prêt à recevoir du texte
- [ ] Les résultats s'affichent en temps réel pendant la frappe
- [ ] Escape ferme la recherche et restaure le contexte précédent
- [ ] Le raccourci ne conflit pas avec la recherche dans le navigateur

---

### US-198 : Palette de commandes `P1`

**Description** : En tant qu'utilisateur avancé, je veux accéder à une palette de commandes (type Ctrl+K), afin d'exécuter n'importe quelle action de l'interface via une recherche textuelle.

**Critères d'acceptation** :
- [ ] Un raccourci (Ctrl/Cmd+K) ouvre une palette de commandes centré à l'écran
- [ ] La palette liste les actions disponibles avec leur raccourci clavier
- [ ] La recherche filtre les commandes en temps réel (fuzzy search)
- [ ] Les commandes récemment utilisées sont prioritaires
- [ ] Les commandes sont regroupées par catégorie (navigation, conversation, paramètres)

---

### US-199 : Raccourci copier la dernière réponse `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir copier la dernière réponse de l'assistant avec un raccourci, afin de la réutiliser rapidement sans sélection manuelle.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+Shift+C copie la dernière réponse complète
- [ ] Le contenu est copié en texte brut ou en Markdown selon les préférences
- [ ] Un feedback visuel confirme la copie (toast notification)
- [ ] Le raccourci ne fonctionne pas si aucune réponse n'existe
- [ ] Le raccourci n'interfère pas avec le copier-coller classique

---

### US-200 : Raccourci régénérer la réponse `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir régénérer la dernière réponse avec un raccourci, afin d'obtenir une alternative rapidement.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+Shift+R régénère la dernière réponse
- [ ] Le raccourci est désactivé pendant une génération en cours
- [ ] Le comportement est identique au clic sur le bouton régénérer
- [ ] Un feedback visuel indique que la régénération est lancée
- [ ] Le raccourci ne conflit pas avec le rechargement de page du navigateur

---

### US-201 : Raccourci supprimer la conversation `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir supprimer la conversation active avec un raccourci, afin de gérer mon historique rapidement.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+Shift+Backspace déclenche la suppression
- [ ] Une confirmation est toujours demandée avant la suppression
- [ ] La confirmation est navigable au clavier (Enter pour confirmer, Escape pour annuler)
- [ ] Après suppression, l'utilisateur est redirigé vers la conversation précédente ou un nouveau chat
- [ ] Le raccourci ne fonctionne pas si aucune conversation n'est active

---

### US-202 : Raccourci navigation entre conversations `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir naviguer entre mes conversations avec des raccourcis, afin de passer d'un chat à l'autre sans utiliser la souris.

**Critères d'acceptation** :
- [ ] Ctrl/Cmd+↑ / Ctrl/Cmd+↓ naviguent entre les conversations (précédente/suivante)
- [ ] La navigation suit l'ordre de la sidebar (plus récente en haut)
- [ ] Un feedback visuel montre la conversation active
- [ ] La navigation boucle du dernier au premier élément
- [ ] Le contenu de la conversation sélectionnée se charge immédiatement

---

### US-203 : Aide raccourcis clavier (cheatsheet) `P0`

**Description** : En tant qu'utilisateur, je veux accéder à une aide listant tous les raccourcis clavier disponibles, afin de découvrir et mémoriser les raccourcis.

**Critères d'acceptation** :
- [ ] Le raccourci Ctrl/Cmd+/ ou ? ouvre le panneau d'aide des raccourcis
- [ ] Les raccourcis sont regroupés par catégorie (navigation, composition, conversation)
- [ ] Le panneau est fermable par Escape ou en cliquant en dehors
- [ ] Les raccourcis spécifiques au système (Ctrl vs Cmd) sont affichés selon l'OS
- [ ] Le panneau est cherchable pour trouver un raccourci spécifique

---

### US-204 : Tooltips avec raccourcis `P1`

**Description** : En tant qu'utilisateur, je veux que les tooltips des boutons affichent le raccourci clavier associé, afin d'apprendre progressivement les raccourcis.

**Critères d'acceptation** :
- [ ] Tous les boutons avec un raccourci associé affichent le raccourci dans le tooltip
- [ ] Le raccourci est formaté de manière lisible (ex. "⌘N" sur Mac, "Ctrl+N" sur Windows)
- [ ] Le tooltip apparaît après un court délai (300-500ms) au survol
- [ ] Le tooltip s'adapte à l'OS détecté pour afficher les bonnes touches
- [ ] Le tooltip ne gêne pas l'interaction avec le bouton

---

### US-205 : Personnalisation des raccourcis `P3`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir personnaliser les raccourcis clavier, afin de les adapter à mes habitudes et éviter les conflits avec d'autres applications.

**Critères d'acceptation** :
- [ ] Une page de paramètres permet de voir et modifier chaque raccourci
- [ ] Les conflits entre raccourcis sont détectés et signalés
- [ ] Un bouton permet de réinitialiser les raccourcis par défaut
- [ ] Les raccourcis personnalisés sont persistés dans les préférences
- [ ] L'import/export de profils de raccourcis est supporté
