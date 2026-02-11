# 32 — Workflows collaboratifs finance

Fonctionnalités liées au pipeline d'investissement, aux workflows de comité, à la due diligence d'équipe et à la collaboration financière structurée.

**Plateformes de référence** : Decider.ai, eFront, Preqin, PitchBook, DealCloud, Dynamo Software

**Axe stratégique** : Vélocité

---

### US-417 : Pipeline d'investissement `P1`

**Description** : En tant que gestionnaire de fonds, je veux disposer d'un pipeline visuel montrant les opportunités d'investissement à chaque étape du processus (sourcing, screening, due diligence, comité, closing), afin de suivre l'avancement de mes dossiers.

**Critères d'acceptation** :
- [ ] Le pipeline affiche les projets fonds dans un kanban avec les étapes standards
- [ ] Chaque carte affiche le nom du fonds, le stade, le responsable et la date de dernière activité
- [ ] Le déplacement d'un fonds entre étapes est possible par glisser-déposer
- [ ] Les étapes du pipeline sont personnalisables
- [ ] Le pipeline est filtrable par stratégie, géographie et responsable

---

### US-418 : Workflow de comité d'investissement `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir créer un workflow structuré pour la préparation et le suivi d'un comité d'investissement, afin d'organiser la prise de décision.

**Critères d'acceptation** :
- [ ] Le workflow définit les étapes : préparation du dossier, distribution aux membres, vote, décision
- [ ] Chaque étape a une date limite et un responsable
- [ ] Les documents nécessaires au comité sont liés au workflow
- [ ] Le statut du workflow est visible en temps réel
- [ ] L'historique des décisions est archivé

---

### US-419 : Due diligence d'équipe `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir répartir les tâches de due diligence entre les membres de l'équipe, afin de paralléliser le travail d'analyse sur un fonds.

**Critères d'acceptation** :
- [ ] La due diligence est décomposée en tâches assignables (analyse financière, juridique, opérationnelle, ESG)
- [ ] Chaque tâche est assignée à un membre de l'équipe avec une date limite
- [ ] Le statut de chaque tâche est suivi (à faire, en cours, terminé)
- [ ] Les résultats de chaque tâche alimentent le dossier commun du fonds
- [ ] Une vue consolidée affiche l'avancement global de la due diligence

---

### US-420 : Assignation de tâches d'analyse `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir créer et assigner des tâches d'analyse spécifiques à des membres de l'équipe, afin de distribuer le travail efficacement.

**Critères d'acceptation** :
- [ ] Les tâches peuvent être créées depuis un projet fonds ou une conversation
- [ ] Chaque tâche inclut un titre, une description, un assigné et une date limite
- [ ] L'assigné reçoit une notification de la nouvelle tâche
- [ ] Les tâches sont listées dans un espace personnel pour chaque membre
- [ ] Le gestionnaire peut suivre l'ensemble des tâches assignées

---

### US-421 : Revue collaborative de documents `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir inviter un collègue à revoir un document généré avant finalisation, afin de garantir la qualité des livrables.

**Critères d'acceptation** :
- [ ] Un document peut être envoyé en revue avec un commentaire explicatif
- [ ] Le relecteur peut annoter le document avec des commentaires
- [ ] Les commentaires sont visibles par l'auteur et le relecteur
- [ ] Le statut de la revue est suivi (en attente, en cours, approuvé, rejeté)
- [ ] L'historique des revues est conservé

---

### US-422 : Commentaires et annotations partagés `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir ajouter des commentaires sur les documents d'une data room et les partager avec mon équipe, afin de collaborer sur l'analyse.

**Critères d'acceptation** :
- [ ] Les commentaires peuvent être ajoutés sur n'importe quel document du projet
- [ ] Les commentaires sont visibles par tous les membres ayant accès au projet
- [ ] Les commentaires sont liés à une page ou un passage spécifique du document
- [ ] Les mentions (@utilisateur) génèrent des notifications
- [ ] Les commentaires sont consultables dans un fil d'activité du projet

---

### US-423 : Tableau de bord d'équipe `P1`

**Description** : En tant que gestionnaire de fonds, je veux disposer d'un tableau de bord montrant l'activité et la charge de travail de mon équipe, afin de piloter la répartition des tâches.

**Critères d'acceptation** :
- [ ] Le tableau de bord affiche la charge de chaque membre (nombre de tâches, projets actifs)
- [ ] L'activité récente est listée (analyses réalisées, documents générés, tâches complétées)
- [ ] Les tâches en retard sont mises en évidence
- [ ] Le tableau de bord est filtrable par période et par projet
- [ ] L'accès est réservé aux responsables d'équipe

---

### US-424 : Validation hiérarchique `P2`

**Description** : En tant que gestionnaire de fonds, je veux que certaines actions (export de documents, partage externe, changement de stade dans le pipeline) requièrent une validation hiérarchique, afin de contrôler les flux d'information sensibles.

**Critères d'acceptation** :
- [ ] Les actions nécessitant validation sont configurables par l'administrateur
- [ ] Le validateur reçoit une notification avec le contexte de la demande
- [ ] La validation ou le rejet sont tracés dans le journal d'audit
- [ ] Le demandeur est notifié de la décision
- [ ] Les demandes en attente sont listées dans un espace dédié pour le validateur

---

### US-425 : Historique des décisions d'investissement `P1`

**Description** : En tant que gestionnaire de fonds, je veux que les décisions d'investissement prises via la plateforme soient archivées avec leur contexte, afin de disposer d'un registre des décisions pour audit et apprentissage.

**Critères d'acceptation** :
- [ ] Chaque décision est enregistrée avec : date, décideurs, fonds concerné, décision (go/no-go), justification
- [ ] Les documents et analyses ayant supporté la décision sont liés
- [ ] L'historique est consultable et filtrable
- [ ] Les décisions sont immutables une fois enregistrées
- [ ] Les statistiques de décisions sont disponibles (taux d'acceptation, durée moyenne du process)

---

### US-426 : Templates de workflow personnalisables `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir créer des templates de workflow réutilisables (due diligence, comité, onboarding fonds), afin de standardiser les processus de l'équipe.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer un template en définissant les étapes, les rôles et les délais
- [ ] Les templates sauvegardés sont réutilisables pour tout nouveau projet
- [ ] Des templates par défaut sont fournis (due diligence PE, due diligence hedge fund)
- [ ] Les templates sont partageables entre membres de l'équipe
- [ ] Un template peut être modifié sans affecter les workflows déjà lancés

---

### US-427 : Rapports d'activité d'équipe `P2`

**Description** : En tant qu'administrateur, je veux pouvoir générer des rapports d'activité de l'équipe sur une période donnée, afin de mesurer la productivité et l'utilisation de la plateforme.

**Critères d'acceptation** :
- [ ] Le rapport couvre : nombre d'analyses, documents générés, data rooms importées, par utilisateur
- [ ] La période est configurable (semaine, mois, trimestre)
- [ ] Les tendances d'activité sont visualisées en graphique
- [ ] Le rapport est exportable en PDF et CSV
- [ ] Les données sont anonymisables si nécessaire

---

### US-428 : Notifications de workflow `P1`

**Description** : En tant qu'analyste financier, je veux recevoir des notifications quand une action est requise de ma part dans un workflow (tâche assignée, revue demandée, deadline approchante), afin de ne manquer aucune étape.

**Critères d'acceptation** :
- [ ] Les notifications sont envoyées pour : nouvelle tâche, deadline J-1, mention, changement de statut
- [ ] Les notifications sont centralisées dans un centre de notifications
- [ ] Chaque notification inclut un lien direct vers l'action requise
- [ ] Les préférences de notification sont configurables par type d'événement
- [ ] Le nombre de notifications non lues est affiché dans le menu principal

---

### US-429 : Intégration avec outils de communication `P2`

**Description** : En tant qu'analyste financier, je veux recevoir les notifications de workflow dans mes outils de communication habituels (Slack, Teams, email), afin de ne pas manquer d'alertes.

**Critères d'acceptation** :
- [ ] L'intégration supporte Slack et Microsoft Teams via webhook
- [ ] Les notifications par email sont disponibles pour les actions critiques
- [ ] L'utilisateur peut choisir quelles notifications sont envoyées sur quel canal
- [ ] Les messages incluent un lien de retour vers Decider
- [ ] L'intégration est configurable individuellement par chaque utilisateur

---

### US-430 : Archivage des dossiers d'investissement `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir archiver un dossier d'investissement complet (data room, analyses, documents générés, décisions, workflow), afin de conserver un historique structuré accessible pour les audits.

**Critères d'acceptation** :
- [ ] L'archivage regroupe l'ensemble des éléments du dossier dans un package cohérent
- [ ] Le dossier archivé est consultable en lecture seule
- [ ] L'archive inclut un index navigable des éléments
- [ ] La durée de rétention est configurable selon les exigences réglementaires
- [ ] L'archive est exportable en ZIP avec structure de dossiers organisée
