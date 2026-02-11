# 11 — Collaboration et partage

Fonctionnalités liées aux liens de partage, aux projets d'équipe et aux workspaces collaboratifs.

**Plateformes de référence** : ChatGPT (Share), Claude (Projects), Gemini, Poe, HuggingChat, Copilot

---

### US-142 : Partage de conversation par lien `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir partager une conversation via un lien public, afin de montrer un échange intéressant à d'autres personnes.

**Critères d'acceptation** :
- [ ] Un bouton "Partager" est accessible dans le menu de la conversation
- [ ] Un lien unique est généré pour la conversation partagée
- [ ] La conversation partagée est consultable sans compte
- [ ] L'utilisateur peut choisir de partager toute la conversation ou une sélection de messages
- [ ] Le lien peut être révoqué à tout moment

---

### US-143 : Visibilité du lien de partage `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir contrôler la visibilité de ma conversation partagée, afin de décider qui peut y accéder.

**Critères d'acceptation** :
- [ ] Trois niveaux de visibilité sont proposés : public, lien non listé, accès restreint
- [ ] Le lien non listé est accessible uniquement par ceux qui ont l'URL
- [ ] L'accès restreint nécessite une liste d'emails autorisés
- [ ] Le niveau de visibilité peut être modifié après le partage
- [ ] Un indicateur montre clairement le niveau de visibilité actif

---

### US-144 : Preview du lien partagé (Open Graph) `P1`

**Description** : En tant qu'utilisateur, je veux que les liens de conversation partagée génèrent une preview riche sur les réseaux sociaux, afin d'avoir un aperçu attrayant avant de cliquer.

**Critères d'acceptation** :
- [ ] Les métadonnées Open Graph sont générées (titre, description, image)
- [ ] Le titre reflète le sujet principal de la conversation
- [ ] La description résume les premiers échanges
- [ ] La preview est correctement affichée sur Twitter, LinkedIn, Slack, Discord
- [ ] L'image de preview est générée automatiquement ou personnalisable

---

### US-145 : Continuation d'une conversation partagée `P2`

**Description** : En tant que destinataire d'un lien de partage, je veux pouvoir continuer la conversation à partir du point partagé, afin d'approfondir le sujet dans mon propre espace.

**Critères d'acceptation** :
- [ ] Un bouton "Continuer cette conversation" est affiché sur les conversations partagées
- [ ] La continuation crée une copie dans l'espace de l'utilisateur connecté
- [ ] L'historique partagé est préservé comme contexte
- [ ] Les modifications du destinataire n'affectent pas la conversation originale
- [ ] Le destinataire doit être connecté pour continuer

---

### US-146 : Workspace d'équipe `P1`

**Description** : En tant que membre d'une équipe, je veux accéder à un workspace partagé, afin de collaborer avec mes collègues sur des conversations et des projets communs.

**Critères d'acceptation** :
- [ ] Un workspace d'équipe regroupe les conversations et projets partagés
- [ ] Les membres sont invités par email ou lien d'invitation
- [ ] Les rôles sont configurables (admin, éditeur, lecteur)
- [ ] L'espace personnel et l'espace équipe sont clairement séparés
- [ ] Le workspace affiche l'activité récente des membres

---

### US-147 : Conversations d'équipe partagées `P1`

**Description** : En tant que membre d'une équipe, je veux pouvoir créer des conversations partagées dans le workspace, afin que tous les membres puissent y participer et voir les réponses.

**Critères d'acceptation** :
- [ ] Les conversations d'équipe sont visibles par tous les membres du workspace
- [ ] Chaque message indique l'auteur (membre de l'équipe)
- [ ] Les membres peuvent contribuer à la même conversation
- [ ] L'historique des contributions est traçable
- [ ] Les notifications informent des nouvelles contributions

---

### US-148 : Bibliothèque de prompts partagée `P2`

**Description** : En tant que membre d'une équipe, je veux accéder à une bibliothèque de prompts partagée, afin de capitaliser sur les meilleures requêtes de l'équipe.

**Critères d'acceptation** :
- [ ] Les membres peuvent sauvegarder des prompts dans la bibliothèque d'équipe
- [ ] Les prompts sont catégorisés et tagués
- [ ] Un moteur de recherche permet de trouver des prompts par mots-clés
- [ ] Les prompts peuvent être utilisés en un clic dans une nouvelle conversation
- [ ] Les prompts affichent leur auteur et leur nombre d'utilisations

---

### US-149 : Commentaires sur les messages `P2`

**Description** : En tant que membre d'une équipe, je veux pouvoir commenter les messages dans une conversation partagée, afin d'annoter les réponses sans modifier le fil principal.

**Critères d'acceptation** :
- [ ] Un bouton de commentaire est disponible sur chaque message dans les conversations d'équipe
- [ ] Les commentaires sont affichés dans un fil latéral ou en popup
- [ ] Les commentaires mentionnent leur auteur et leur date
- [ ] Les commentaires sont distingués visuellement des messages de la conversation
- [ ] Les commentaires peuvent être résolus ou supprimés

---

### US-150 : Assignation de tâches depuis le chat `P3`

**Description** : En tant que membre d'une équipe, je veux pouvoir assigner des actions issues d'une conversation à des collègues, afin de transformer les conclusions du chat en tâches concrètes.

**Critères d'acceptation** :
- [ ] Un bouton "Assigner" permet de transformer un passage en tâche
- [ ] L'assignataire est sélectionnable parmi les membres du workspace
- [ ] La tâche contient un lien vers le message source
- [ ] Les tâches assignées sont visibles dans un tableau de bord
- [ ] L'assignataire reçoit une notification

---

### US-151 : Gestion des permissions par conversation `P1`

**Description** : En tant qu'administrateur de workspace, je veux pouvoir définir les permissions par conversation, afin de contrôler qui peut lire, contribuer ou administrer chaque conversation.

**Critères d'acceptation** :
- [ ] Les permissions sont configurables par conversation (lecture, écriture, admin)
- [ ] Les conversations peuvent être publiques ou restreintes dans le workspace
- [ ] Les changements de permissions sont enregistrés dans un log d'audit
- [ ] Les membres sans accès ne voient pas la conversation dans la liste
- [ ] L'héritage des permissions du workspace est configurable

---

### US-152 : Export de conversation `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter une conversation complète, afin de la sauvegarder ou de la traiter dans un autre outil.

**Critères d'acceptation** :
- [ ] Les formats d'export incluent Markdown, PDF, JSON et texte brut
- [ ] L'export conserve la mise en forme (titres, listes, code)
- [ ] Les images et fichiers joints sont inclus dans l'export
- [ ] L'export est déclenché par un bouton dans le menu de la conversation
- [ ] L'export complet ou partiel (sélection de messages) est possible

---

### US-153 : Embed de conversation dans un site `P3`

**Description** : En tant qu'utilisateur, je veux pouvoir intégrer une conversation partagée dans un site web via un embed, afin de présenter l'échange dans un contexte externe.

**Critères d'acceptation** :
- [ ] Un code d'embed (iframe) est généré pour chaque conversation partagée
- [ ] L'embed est responsif et s'adapte au conteneur
- [ ] Le style de l'embed est personnalisable (thème clair/sombre, dimensions)
- [ ] L'embed ne permet pas d'interaction (lecture seule)
- [ ] Le code d'embed est copiable en un clic

---

### US-154 : Historique d'activité du workspace `P2`

**Description** : En tant qu'administrateur de workspace, je veux voir un historique d'activité, afin de suivre l'utilisation du workspace par les membres.

**Critères d'acceptation** :
- [ ] Un journal d'activité liste les actions récentes (création, partage, modification)
- [ ] Les entrées sont filtrables par membre, type d'action et date
- [ ] Les actions sensibles (suppression, changement de permissions) sont mises en évidence
- [ ] L'historique est exportable
- [ ] La durée de rétention est configurable

---

### US-155 : Templates de conversations d'équipe `P2`

**Description** : En tant que membre d'une équipe, je veux pouvoir créer et utiliser des templates de conversations, afin de standardiser les workflows récurrents de l'équipe.

**Critères d'acceptation** :
- [ ] Les templates définissent un modèle, un system prompt et des instructions initiales
- [ ] Les templates sont partagés dans le workspace
- [ ] L'utilisateur peut démarrer une conversation à partir d'un template en un clic
- [ ] Les templates sont catégorisés et cherchables
- [ ] Les templates peuvent être modifiés par les membres avec les droits appropriés
