# 03 — Gestion des conversations

Fonctionnalités liées à l'organisation, la navigation et la gestion de l'historique des conversations.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Perplexity, Copilot, Mistral Le Chat, Grok, DeepSeek, HuggingChat, Poe

---

### US-036 : Sidebar historique `P0`

**Description** : En tant qu'utilisateur, je veux une barre latérale listant mes conversations passées, afin de naviguer facilement entre mes différents échanges.

**Critères d'acceptation** :
- [ ] Une sidebar affiche la liste des conversations existantes
- [ ] Chaque conversation affiche son titre (ou les premiers mots du premier message)
- [ ] Cliquer sur une conversation la charge dans le panneau principal
- [ ] La conversation active est visuellement mise en évidence
- [ ] La liste est scrollable si elle contient beaucoup de conversations
- [ ] Les conversations les plus récentes sont affichées en premier

---

### US-037 : Nouvelle conversation `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir démarrer une nouvelle conversation, afin de commencer un échange sur un nouveau sujet.

**Critères d'acceptation** :
- [ ] Un bouton "Nouvelle conversation" est clairement visible dans la sidebar ou en haut de page
- [ ] Cliquer crée une nouvelle conversation vide et affiche la vue d'accueil
- [ ] La conversation précédente est automatiquement sauvegardée
- [ ] Le raccourci clavier Ctrl/Cmd+Shift+N fonctionne
- [ ] La nouvelle conversation apparaît dans la sidebar

---

### US-038 : Renommage automatique (IA) `P0`

**Description** : En tant qu'utilisateur, je veux que mes conversations soient automatiquement nommées par l'IA après le premier échange, afin de les retrouver facilement sans effort.

**Critères d'acceptation** :
- [ ] Après le premier échange (question + réponse), un titre est généré automatiquement
- [ ] Le titre est concis (5-8 mots maximum) et reflète le sujet principal
- [ ] Le titre apparaît dans la sidebar sans action de l'utilisateur
- [ ] La génération du titre ne bloque pas l'interaction
- [ ] Le titre peut être modifié manuellement par la suite

---

### US-039 : Renommage manuel `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir renommer manuellement une conversation, afin de lui donner un titre plus pertinent selon mon organisation.

**Critères d'acceptation** :
- [ ] Un double-clic ou un menu contextuel permet de renommer une conversation
- [ ] Un champ d'édition inline s'affiche avec le titre actuel pré-rempli
- [ ] Appuyer sur Enter valide le nouveau nom
- [ ] Appuyer sur Escape annule la modification
- [ ] Le titre est limité en longueur avec un compteur ou une troncature

---

### US-040 : Suppression de conversation `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir supprimer une conversation, afin de nettoyer mon historique et supprimer des échanges dont je n'ai plus besoin.

**Critères d'acceptation** :
- [ ] Un bouton ou une option de menu permet de supprimer une conversation
- [ ] Une confirmation est demandée avant la suppression définitive
- [ ] La conversation supprimée disparaît immédiatement de la sidebar
- [ ] Si la conversation active est supprimée, l'UI redirige vers une nouvelle conversation ou la plus récente
- [ ] La suppression est définitive (pas de corbeille)

---

### US-041 : Recherche dans l'historique `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir rechercher dans mes conversations passées, afin de retrouver rapidement un échange spécifique.

**Critères d'acceptation** :
- [ ] Un champ de recherche est disponible dans la sidebar
- [ ] La recherche filtre les conversations par titre et/ou contenu des messages
- [ ] Les résultats sont affichés en temps réel pendant la frappe
- [ ] Les termes recherchés sont mis en évidence dans les résultats
- [ ] La recherche est rapide même avec un grand nombre de conversations
- [ ] Un état "aucun résultat" est affiché si la recherche ne correspond à rien

---

### US-042 : Dossiers/catégories `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir organiser mes conversations dans des dossiers ou catégories, afin de structurer mon historique par projet ou thème.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer des dossiers dans la sidebar
- [ ] Les conversations peuvent être déplacées dans un dossier (drag & drop ou menu)
- [ ] Les dossiers sont repliables/dépliables
- [ ] Les dossiers peuvent être renommés et supprimés
- [ ] Les conversations non classées restent dans une section par défaut
- [ ] Un dossier supprimé ne supprime pas les conversations qu'il contient

---

### US-043 : Épinglage de conversations `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir épingler des conversations importantes, afin de les garder en haut de la sidebar pour un accès rapide.

**Critères d'acceptation** :
- [ ] Une option "Épingler" est disponible dans le menu contextuel d'une conversation
- [ ] Les conversations épinglées sont affichées dans une section dédiée en haut de la sidebar
- [ ] L'utilisateur peut désépingler une conversation
- [ ] Le nombre de conversations épinglées n'est pas limité
- [ ] Les conversations épinglées affichent un indicateur visuel (icône punaise)

---

### US-044 : Archivage de conversations `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir archiver des conversations, afin de les retirer de la vue principale sans les supprimer.

**Critères d'acceptation** :
- [ ] Une option "Archiver" est disponible dans le menu contextuel
- [ ] Les conversations archivées sont retirées de la sidebar principale
- [ ] Un filtre ou une section permet d'accéder aux conversations archivées
- [ ] Une conversation archivée peut être restaurée
- [ ] Les conversations archivées sont toujours consultables et recherchables

---

### US-045 : Export JSON `P1`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir exporter une conversation au format JSON, afin de sauvegarder ou traiter les données de façon programmatique.

**Critères d'acceptation** :
- [ ] Une option "Exporter en JSON" est disponible dans le menu de la conversation
- [ ] Le fichier JSON contient tous les messages avec leurs métadonnées (auteur, timestamp, rôle)
- [ ] Le fichier est téléchargé avec un nom explicite (titre-conversation_date.json)
- [ ] Le format JSON est structuré et documenté
- [ ] Les pièces jointes sont référencées (URLs ou encodées en base64)

---

### US-046 : Export Markdown `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter une conversation au format Markdown, afin de la partager ou l'intégrer dans de la documentation.

**Critères d'acceptation** :
- [ ] Une option "Exporter en Markdown" est disponible
- [ ] Le fichier Markdown reprend les messages avec des séparateurs clairs entre user et assistant
- [ ] Le Markdown des réponses de l'assistant est préservé tel quel
- [ ] Le fichier est téléchargé avec un nom explicite
- [ ] Les métadonnées (date, modèle utilisé) sont incluses en en-tête

---

### US-047 : Export PDF `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter une conversation au format PDF, afin de la partager ou l'archiver dans un format universel.

**Critères d'acceptation** :
- [ ] Une option "Exporter en PDF" est disponible
- [ ] Le PDF reprend la mise en forme visuelle de la conversation
- [ ] Les blocs de code conservent leur coloration syntaxique
- [ ] Le PDF est correctement paginé
- [ ] Le fichier est téléchargé avec un nom explicite

---

### US-048 : Suppression en masse `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir sélectionner et supprimer plusieurs conversations en une fois, afin de nettoyer efficacement mon historique.

**Critères d'acceptation** :
- [ ] Un mode de sélection multiple est activable (checkbox ou toggle)
- [ ] L'utilisateur peut sélectionner/désélectionner des conversations individuellement
- [ ] Un bouton "Tout sélectionner" est disponible
- [ ] Un bouton "Supprimer la sélection" est affiché avec le compteur de conversations sélectionnées
- [ ] Une confirmation est demandée avant la suppression
- [ ] Le mode de sélection peut être annulé

---

### US-049 : Tri chronologique `P1`

**Description** : En tant qu'utilisateur, je veux que mes conversations soient triées chronologiquement, afin de retrouver les plus récentes en premier.

**Critères d'acceptation** :
- [ ] Les conversations sont triées par date de dernière activité (message le plus récent)
- [ ] La conversation la plus récemment active est en haut de la liste
- [ ] Le tri se met à jour en temps réel quand une conversation reçoit un nouveau message
- [ ] Les conversations épinglées restent en haut, indépendamment du tri

---

### US-050 : Groupement par date `P1`

**Description** : En tant qu'utilisateur, je veux que mes conversations soient groupées par période, afin de naviguer plus facilement dans un historique volumineux.

**Critères d'acceptation** :
- [ ] Les conversations sont groupées par période : "Aujourd'hui", "Hier", "7 derniers jours", "30 derniers jours", mois précédents
- [ ] Chaque groupe a un en-tête visible
- [ ] Les groupes vides ne sont pas affichés
- [ ] Le groupement est compatible avec la recherche et le tri
- [ ] Les conversations épinglées ont leur propre section en haut

---

### US-051 : Sidebar repliable `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir replier la sidebar, afin de maximiser l'espace disponible pour la conversation, notamment sur des écrans étroits.

**Critères d'acceptation** :
- [ ] Un bouton permet de replier/déplier la sidebar
- [ ] La sidebar se replie avec une animation fluide
- [ ] En mode replié, un bouton ou une icône permet de la rouvrir
- [ ] L'état replié/déplié est persisté entre les sessions
- [ ] Sur mobile, la sidebar se comporte comme un drawer (overlay)
- [ ] Le raccourci clavier Ctrl/Cmd+Shift+S permet de toggle la sidebar
