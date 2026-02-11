# 17 — Paramètres

Fonctionnalités liées à la page de paramètres, aux préférences utilisateur et à la gestion du compte.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Perplexity, Mistral Le Chat, DeepSeek

---

### US-217 : Page paramètres structurée `P0`

**Description** : En tant qu'utilisateur, je veux accéder à une page de paramètres organisée par sections, afin de retrouver et modifier facilement mes préférences.

**Critères d'acceptation** :
- [ ] La page paramètres est accessible depuis le menu principal ou un bouton dédié
- [ ] Les paramètres sont organisés en sections logiques (Général, Apparence, Modèles, Données, Compte)
- [ ] Chaque section est navigable via un menu latéral ou des onglets
- [ ] Les modifications sont sauvegardées automatiquement ou via un bouton explicite
- [ ] La page paramètres est responsive

---

### US-218 : Paramètres de langue de l'interface `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir changer la langue de l'interface, afin d'utiliser l'application dans ma langue préférée.

**Critères d'acceptation** :
- [ ] Un sélecteur de langue est disponible dans les paramètres généraux
- [ ] Au minimum français et anglais sont supportés
- [ ] Le changement de langue est immédiat sans rechargement de page
- [ ] Tous les éléments de l'interface sont traduits (menus, boutons, messages système)
- [ ] La langue par défaut est détectée depuis le navigateur

---

### US-219 : Gestion des données et historique `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir gérer mes données (historique, fichiers, mémoire), afin de contrôler ce qui est conservé et pouvoir purger si nécessaire.

**Critères d'acceptation** :
- [ ] Une section "Données" affiche l'utilisation de stockage (conversations, fichiers, mémoire)
- [ ] L'utilisateur peut supprimer tout l'historique de conversations
- [ ] L'utilisateur peut supprimer des conversations individuellement depuis les paramètres
- [ ] L'export de toutes les données est disponible (RGPD)
- [ ] Une confirmation est requise pour les actions destructives

---

### US-220 : Gestion des sessions et appareils `P1`

**Description** : En tant qu'utilisateur, je veux voir et gérer mes sessions actives, afin de sécuriser mon compte en déconnectant les appareils non reconnus.

**Critères d'acceptation** :
- [ ] La liste des sessions actives est affichée avec le type d'appareil et la date de dernière activité
- [ ] L'utilisateur peut déconnecter une session individuelle
- [ ] Un bouton permet de déconnecter toutes les sessions sauf la courante
- [ ] Les sessions suspectes sont signalées
- [ ] La localisation approximative de chaque session est indiquée

---

### US-221 : Paramètres de notification `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir configurer mes préférences de notification, afin de contrôler quand et comment je suis alerté.

**Critères d'acceptation** :
- [ ] Les types de notifications sont listés avec un toggle pour chacun
- [ ] Les notifications push navigateur sont activables/désactivables
- [ ] Les notifications par email sont configurables (résumé quotidien, alertes)
- [ ] Les sons de notification sont activables/désactivables
- [ ] Les préférences sont sauvegardées et respectées immédiatement

---

### US-222 : Gestion de l'abonnement et quotas `P1`

**Description** : En tant qu'utilisateur, je veux voir mon plan d'abonnement actuel et mon utilisation des quotas, afin de savoir ce qui est inclus et quand je m'approche des limites.

**Critères d'acceptation** :
- [ ] Le plan actuel est affiché avec ses caractéristiques
- [ ] L'utilisation des quotas est visualisée (barres de progression)
- [ ] Les quotas incluent les messages, les tokens, le stockage et les générations d'images
- [ ] Un bouton permet de passer au plan supérieur
- [ ] Les alertes de quota proche sont affichées

---

### US-223 : Paramètres de confidentialité `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir configurer les paramètres de confidentialité, afin de contrôler comment mes données sont utilisées.

**Critères d'acceptation** :
- [ ] Un toggle permet d'opt-out de l'entraînement du modèle sur mes conversations
- [ ] Le partage de données anonymisées pour l'amélioration est configurable
- [ ] L'historique de chat peut être désactivé globalement
- [ ] Les préférences de cookies sont configurables
- [ ] Les choix de confidentialité sont clairement expliqués

---

### US-224 : Suppression du compte `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir supprimer mon compte et toutes mes données associées, afin d'exercer mon droit à l'oubli.

**Critères d'acceptation** :
- [ ] Un bouton de suppression de compte est accessible dans les paramètres
- [ ] Les conséquences de la suppression sont clairement listées
- [ ] Une période de grâce est proposée avant la suppression définitive
- [ ] Une confirmation par mot de passe ou email est requise
- [ ] Toutes les données sont effectivement supprimées après la période de grâce

---

### US-225 : Raccourci vers les paramètres contextuels `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir accéder directement à la section de paramètres pertinente depuis l'interface, afin de modifier un réglage sans chercher dans la page paramètres.

**Critères d'acceptation** :
- [ ] Des liens contextuels dans l'interface renvoient vers la section de paramètres concernée
- [ ] Le sélecteur de modèle renvoie vers les paramètres de modèle
- [ ] Les indicateurs de quota renvoient vers la gestion d'abonnement
- [ ] Le lien ouvre la page paramètres avec la section déjà sélectionnée
- [ ] Un bouton retour permet de revenir au contexte précédent

---

### US-226 : Paramètres de modèle par défaut `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir définir un modèle par défaut et ses paramètres pour les nouvelles conversations, afin de ne pas les reconfigurer à chaque fois.

**Critères d'acceptation** :
- [ ] Le modèle par défaut est sélectionnable dans les paramètres
- [ ] Les paramètres par défaut (température, max tokens) sont configurables
- [ ] Le system prompt par défaut est définissable
- [ ] Les réglages s'appliquent à toutes les nouvelles conversations
- [ ] Les conversations existantes ne sont pas affectées par les changements

---

### US-227 : Reset des paramètres `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir réinitialiser mes paramètres à leurs valeurs par défaut, afin de repartir d'une configuration propre.

**Critères d'acceptation** :
- [ ] Un bouton "Réinitialiser" est disponible par section ou globalement
- [ ] Une confirmation est demandée avant la réinitialisation
- [ ] Les valeurs par défaut sont restaurées pour tous les paramètres de la section
- [ ] Les données utilisateur (conversations, fichiers) ne sont pas affectées
- [ ] Un feedback confirme la réinitialisation

---

### US-228 : Paramètres d'intégrations tierces `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir gérer les intégrations tierces connectées (Google Drive, GitHub, etc.) depuis les paramètres, afin de contrôler les services connectés.

**Critères d'acceptation** :
- [ ] Les intégrations connectées sont listées avec leur statut
- [ ] L'utilisateur peut connecter de nouvelles intégrations
- [ ] L'utilisateur peut déconnecter une intégration existante
- [ ] Les permissions accordées à chaque intégration sont visibles
- [ ] Les erreurs de connexion sont signalées avec des actions correctives
