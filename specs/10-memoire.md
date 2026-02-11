# 10 — Mémoire

Fonctionnalités liées à la mémoire cross-sessions, à la recherche sémantique dans l'historique et au contexte de projet.

**Plateformes de référence** : ChatGPT (Memory), Claude (Projects), Gemini, Copilot, Pi, Character.AI

---

### US-131 : Mémoire automatique cross-sessions `P0`

**Description** : En tant qu'utilisateur, je veux que l'assistant retienne automatiquement des informations importantes sur moi entre les conversations, afin de ne pas avoir à me répéter à chaque nouvelle session.

**Critères d'acceptation** :
- [ ] L'assistant identifie et mémorise les informations personnelles partagées (prénom, métier, préférences)
- [ ] Les souvenirs sont appliqués automatiquement dans les nouvelles conversations
- [ ] Un message discret informe quand un nouveau souvenir est enregistré
- [ ] La mémoire fonctionne de manière transparente sans intervention manuelle
- [ ] La mémoire est limitée en taille avec remplacement des informations obsolètes

---

### US-132 : Gestion manuelle des souvenirs `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir consulter, modifier et supprimer les souvenirs enregistrés par l'assistant, afin de garder le contrôle sur ce qui est retenu.

**Critères d'acceptation** :
- [ ] Une page dédiée liste tous les souvenirs enregistrés
- [ ] Chaque souvenir affiche son contenu, sa date de création et sa source (conversation d'origine)
- [ ] L'utilisateur peut supprimer un souvenir individuellement
- [ ] L'utilisateur peut modifier le contenu d'un souvenir
- [ ] Un bouton permet de supprimer tous les souvenirs en une action

---

### US-133 : Ajout explicite de souvenirs `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir demander explicitement à l'assistant de retenir une information, afin de m'assurer que les éléments importants sont bien mémorisés.

**Critères d'acceptation** :
- [ ] L'utilisateur peut écrire "Retiens que..." ou utiliser une commande dédiée
- [ ] L'assistant confirme l'enregistrement du souvenir
- [ ] Le souvenir est immédiatement disponible dans les prochaines conversations
- [ ] L'utilisateur reçoit un feedback si l'information entre en conflit avec un souvenir existant
- [ ] Les doublons sont détectés et fusionnés

---

### US-134 : Activation/désactivation de la mémoire `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir activer ou désactiver la fonctionnalité de mémoire, afin de contrôler si l'assistant retient des informations entre les sessions.

**Critères d'acceptation** :
- [ ] Un toggle dans les paramètres permet d'activer/désactiver la mémoire globalement
- [ ] La désactivation n'efface pas les souvenirs existants (option de suppression séparée)
- [ ] L'assistant ne crée pas de nouveaux souvenirs quand la mémoire est désactivée
- [ ] L'état de la mémoire est indiqué clairement dans l'interface
- [ ] La mémoire peut être désactivée pour une conversation spécifique

---

### US-135 : Recherche sémantique dans l'historique `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir rechercher dans l'historique de mes conversations par sens plutôt que par mots-clés exacts, afin de retrouver facilement des échanges passés.

**Critères d'acceptation** :
- [ ] Un champ de recherche accepte des requêtes en langage naturel
- [ ] Les résultats sont classés par pertinence sémantique
- [ ] Chaque résultat affiche un extrait contextuel et un lien vers la conversation
- [ ] La recherche couvre toutes les conversations passées
- [ ] Les résultats se chargent rapidement même avec un grand historique

---

### US-136 : Contexte de conversation récent `P1`

**Description** : En tant qu'utilisateur, je veux que l'assistant puisse référencer des conversations récentes quand c'est pertinent, afin d'avoir une continuité entre les sessions.

**Critères d'acceptation** :
- [ ] L'assistant peut faire référence à des échanges récents si le sujet est lié
- [ ] Une indication montre quand l'assistant utilise du contexte d'une conversation passée
- [ ] L'utilisateur peut choisir de ne pas utiliser le contexte passé pour un message
- [ ] Le nombre de conversations récentes consultables est configurable
- [ ] Les références aux conversations passées sont cliquables pour accéder au contexte original

---

### US-137 : Résumé automatique de conversations longues `P1`

**Description** : En tant qu'utilisateur, je veux que les conversations longues soient automatiquement résumées pour maintenir le contexte, afin que l'assistant reste pertinent même après de très longs échanges.

**Critères d'acceptation** :
- [ ] Un résumé est généré automatiquement quand la conversation approche de la limite de contexte
- [ ] Le résumé capture les points clés, les décisions et les informations importantes
- [ ] L'utilisateur est informé quand un résumé est utilisé à la place de l'historique complet
- [ ] Le résumé est consultable et modifiable par l'utilisateur
- [ ] Les messages récents sont toujours envoyés en intégralité (pas de résumé)

---

### US-138 : Pinning d'informations en contexte `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir épingler des informations ou des messages importants dans une conversation, afin qu'ils soient toujours inclus dans le contexte envoyé à l'assistant.

**Critères d'acceptation** :
- [ ] Un bouton "Épingler" est disponible sur chaque message
- [ ] Les messages épinglés sont toujours inclus dans le contexte, même si la conversation est résumée
- [ ] Les éléments épinglés sont visuellement marqués dans le fil de conversation
- [ ] L'utilisateur peut désépingler un message à tout moment
- [ ] Le nombre de messages épinglés est limité avec un indicateur d'utilisation

---

### US-139 : Catégorisation automatique des souvenirs `P2`

**Description** : En tant qu'utilisateur, je veux que mes souvenirs soient automatiquement catégorisés, afin de les retrouver et les gérer plus facilement.

**Critères d'acceptation** :
- [ ] Les souvenirs sont classés automatiquement par catégorie (personnel, professionnel, préférences, projets)
- [ ] L'interface de gestion des souvenirs affiche les catégories comme filtres
- [ ] L'utilisateur peut changer la catégorie d'un souvenir
- [ ] Chaque catégorie peut être activée/désactivée individuellement
- [ ] Les nouvelles catégories sont créées automatiquement si nécessaire

---

### US-140 : Indicateur d'utilisation de la mémoire `P1`

**Description** : En tant qu'utilisateur, je veux voir quand l'assistant utilise sa mémoire pour répondre, afin de comprendre d'où viennent les informations contextuelles.

**Critères d'acceptation** :
- [ ] Un indicateur discret est affiché quand la mémoire influence une réponse
- [ ] Cliquer sur l'indicateur montre les souvenirs utilisés
- [ ] L'utilisateur peut corriger un souvenir incorrect directement depuis l'indicateur
- [ ] L'indicateur distingue les souvenirs utilisés des instructions personnalisées
- [ ] L'indicateur ne gêne pas la lecture du message

---

### US-141 : Mémoire partagée par projet `P2`

**Description** : En tant qu'utilisateur travaillant en équipe, je veux pouvoir partager une mémoire de projet avec mes collaborateurs, afin que l'assistant ait un contexte commun pour tous les membres.

**Critères d'acceptation** :
- [ ] La mémoire de projet est accessible à tous les membres du projet
- [ ] Les contributions sont attribuées à leur auteur
- [ ] Les conflits entre la mémoire personnelle et la mémoire projet sont gérés
- [ ] Un historique des modifications est disponible
- [ ] Les droits de modification sont configurables par rôle
