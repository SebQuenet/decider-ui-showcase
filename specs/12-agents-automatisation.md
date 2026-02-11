# 12 — Agents et automatisation

Fonctionnalités liées aux agents autonomes, aux tâches planifiées et à l'intégration d'outils externes (MCP).

**Plateformes de référence** : ChatGPT (GPTs, Operator), Claude (Computer Use, MCP), Copilot, Gemini, DeepSeek

---

### US-156 : Lancement d'un agent autonome `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir lancer un agent autonome pour accomplir une tâche complexe en plusieurs étapes, afin de déléguer des tâches longues sans superviser chaque étape.

**Critères d'acceptation** :
- [ ] L'utilisateur peut décrire une tâche complexe et lancer un agent pour l'exécuter
- [ ] L'agent décompose la tâche en sous-étapes et les exécute séquentiellement
- [ ] L'avancement est affiché en temps réel (étape en cours, progression)
- [ ] L'utilisateur peut intervenir ou corriger le cours de l'exécution
- [ ] L'agent peut utiliser des outils (recherche web, code, fichiers) pour accomplir la tâche

---

### US-157 : Visualisation du plan d'exécution de l'agent `P1`

**Description** : En tant qu'utilisateur, je veux voir le plan d'exécution détaillé de l'agent avant qu'il ne commence, afin de valider l'approche et les étapes prévues.

**Critères d'acceptation** :
- [ ] L'agent propose un plan d'exécution avec les étapes numérotées
- [ ] Chaque étape indique l'outil ou l'action prévue
- [ ] L'utilisateur peut approuver, modifier ou rejeter le plan
- [ ] Les étapes complétées sont visuellement marquées
- [ ] Le plan peut être révisé en cours d'exécution si nécessaire

---

### US-158 : Approbation des actions sensibles `P0`

**Description** : En tant qu'utilisateur, je veux que l'agent me demande confirmation avant d'exécuter des actions sensibles, afin de garder le contrôle sur les opérations critiques.

**Critères d'acceptation** :
- [ ] Les actions sensibles sont identifiées (envoi d'emails, modifications de fichiers, achats, etc.)
- [ ] Une popup de confirmation affiche l'action prévue et ses conséquences
- [ ] L'utilisateur peut approuver, refuser ou modifier l'action
- [ ] Le niveau d'autonomie est configurable (tout confirmer, confirmer uniquement les actions sensibles, autonomie totale)
- [ ] Un log de toutes les actions exécutées est disponible

---

### US-159 : Tâches planifiées et récurrentes `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir planifier des tâches pour qu'un agent les exécute à des moments précis ou de manière récurrente, afin d'automatiser des workflows réguliers.

**Critères d'acceptation** :
- [ ] L'utilisateur peut définir une tâche avec une date/heure d'exécution
- [ ] Les tâches récurrentes sont supportées (quotidien, hebdomadaire, mensuel)
- [ ] Un calendrier ou une liste affiche les tâches planifiées
- [ ] Les résultats sont disponibles dans la conversation après exécution
- [ ] Les tâches planifiées peuvent être modifiées, pausées ou supprimées

---

### US-160 : Intégration d'outils MCP `P1`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir connecter des serveurs MCP (Model Context Protocol) à l'assistant, afin de lui donner accès à des outils et des sources de données externes.

**Critères d'acceptation** :
- [ ] Une interface permet d'ajouter des serveurs MCP par URL ou configuration
- [ ] Les outils fournis par les serveurs MCP sont listés avec leur description
- [ ] L'assistant peut invoquer les outils MCP automatiquement quand pertinent
- [ ] Les appels aux outils MCP sont visibles dans le fil de conversation
- [ ] Les erreurs de connexion MCP sont gérées avec des messages clairs

---

### US-161 : Marketplace d'outils et plugins `P2`

**Description** : En tant qu'utilisateur, je veux parcourir et installer des outils et plugins depuis une marketplace, afin d'étendre les capacités de l'assistant facilement.

**Critères d'acceptation** :
- [ ] Une marketplace liste les outils/plugins disponibles par catégories
- [ ] Chaque outil affiche une description, une note et des exemples d'utilisation
- [ ] L'installation se fait en un clic
- [ ] Les outils installés sont immédiatement disponibles dans les conversations
- [ ] Les outils peuvent être désinstallés ou désactivés

---

### US-162 : Log des actions de l'agent `P1`

**Description** : En tant qu'utilisateur, je veux consulter un log détaillé de toutes les actions exécutées par l'agent, afin de comprendre ce qui a été fait et de diagnostiquer les problèmes.

**Critères d'acceptation** :
- [ ] Un panneau de log affiche chaque action avec son horodatage
- [ ] Les entrées du log incluent l'action, les paramètres et le résultat
- [ ] Les erreurs sont mises en évidence avec le message d'erreur complet
- [ ] Le log est filtrable par type d'action et par statut (succès, erreur)
- [ ] Le log est exportable

---

### US-163 : Parallélisation des sous-tâches `P2`

**Description** : En tant qu'utilisateur, je veux que l'agent puisse exécuter des sous-tâches indépendantes en parallèle, afin d'accélérer les tâches complexes.

**Critères d'acceptation** :
- [ ] L'agent identifie les sous-tâches indépendantes et les exécute en parallèle
- [ ] La visualisation montre les tâches parallèles et leurs états
- [ ] Le résultat global est assemblé quand toutes les sous-tâches sont complétées
- [ ] Une erreur dans une branche n'empêche pas les autres de continuer
- [ ] Le nombre de tâches parallèles est limité pour la lisibilité

---

### US-164 : Boucle de feedback agent-utilisateur `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir interagir avec l'agent pendant son exécution pour lui fournir du feedback ou des clarifications, afin de guider l'agent vers le résultat souhaité.

**Critères d'acceptation** :
- [ ] L'agent peut poser des questions à l'utilisateur pendant l'exécution
- [ ] L'utilisateur peut envoyer des instructions supplémentaires à tout moment
- [ ] L'agent intègre le feedback et ajuste son plan d'exécution
- [ ] Les échanges agent-utilisateur sont distingués visuellement des résultats d'actions
- [ ] L'agent reprend automatiquement après avoir reçu la réponse

---

### US-165 : Templates d'agents `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir utiliser des templates d'agents préconfigurés pour des tâches courantes, afin de lancer des workflows sans tout configurer manuellement.

**Critères d'acceptation** :
- [ ] Des templates d'agents sont disponibles par catégorie (recherche, rédaction, analyse, code)
- [ ] Chaque template décrit sa fonction, ses outils et ses étapes typiques
- [ ] L'utilisateur peut lancer un template en un clic avec des paramètres personnalisables
- [ ] Les templates sont modifiables et sauvegardables comme templates personnalisés
- [ ] Les templates communautaires les mieux notés sont mis en avant

---

### US-166 : Gestion des credentials pour les outils `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir gérer les identifiants et tokens d'accès pour les outils connectés, afin de sécuriser l'accès aux services externes.

**Critères d'acceptation** :
- [ ] Une page dédiée liste les outils connectés et leurs credentials
- [ ] Les credentials sont stockés de manière sécurisée (chiffrés)
- [ ] L'utilisateur peut ajouter, modifier et révoquer des credentials
- [ ] L'expiration des tokens est surveillée avec des alertes
- [ ] Les credentials ne sont jamais affichés en clair après la saisie initiale

---

### US-167 : Résumé d'exécution de l'agent `P1`

**Description** : En tant qu'utilisateur, je veux recevoir un résumé clair des résultats de l'agent à la fin de son exécution, afin de comprendre rapidement ce qui a été accompli.

**Critères d'acceptation** :
- [ ] Un résumé structuré est généré à la fin de l'exécution
- [ ] Le résumé liste les actions effectuées, les résultats obtenus et les éventuelles erreurs
- [ ] Les outputs (fichiers, données, liens) sont accessibles depuis le résumé
- [ ] Le résumé inclut des métriques (durée, nombre d'actions, outils utilisés)
- [ ] Le résumé est repliable pour ne pas encombrer la conversation

---

### US-168 : Annulation et rollback d'actions `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir annuler les actions d'un agent en cours d'exécution et revenir en arrière, afin de corriger une mauvaise direction sans conséquences.

**Critères d'acceptation** :
- [ ] Un bouton d'arrêt immédiat stoppe l'agent et annule l'action en cours
- [ ] Les actions réversibles peuvent être annulées individuellement (rollback)
- [ ] L'état avant l'exécution est restauré si un rollback complet est demandé
- [ ] Les actions non réversibles sont clairement identifiées avant exécution
- [ ] L'utilisateur est informé des conséquences de l'annulation
