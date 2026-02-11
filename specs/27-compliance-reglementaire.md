# 27 — Compliance & Réglementaire

Fonctionnalités liées à la conformité réglementaire (KYC, AML, AMF/FCA/AIFMD), à l'audit trail, et aux disclaimers automatiques.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv World-Check, Dow Jones Risk & Compliance, ComplyAdvantage

**Axe stratégique** : Vélocité

---

### US-353 : Vérification KYC automatisée `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant vérifie automatiquement les informations KYC des contreparties mentionnées dans la data room, afin d'accélérer le processus de connaissance client.

**Critères d'acceptation** :
- [ ] L'assistant extrait les informations d'identification des entités (nom, juridiction, immatriculation, dirigeants)
- [ ] Les informations sont croisées avec les données disponibles dans les documents de la data room
- [ ] Les incohérences ou informations manquantes sont signalées
- [ ] Un rapport KYC structuré est générable pour chaque entité
- [ ] Les données extraites sont conformes aux exigences réglementaires européennes

---

### US-354 : Détection AML dans les documents `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant détecte les signaux d'alerte liés au blanchiment d'argent dans les documents de la data room, afin de respecter les obligations de vigilance.

**Critères d'acceptation** :
- [ ] L'assistant identifie les red flags AML standards (structures opaques, juridictions à risque, montants inhabituels)
- [ ] Les entités mentionnées sont vérifiées contre les listes de sanctions disponibles
- [ ] Chaque alerte est documentée avec la source et le niveau de risque
- [ ] Un rapport de vigilance AML est générable
- [ ] Les alertes sont archivées pour traçabilité

---

### US-355 : Conformité AMF/FCA/AIFMD `P2`

**Description** : En tant que gestionnaire de fonds, je veux que l'assistant vérifie la conformité des documents avec les réglementations AMF, FCA et AIFMD, afin de m'assurer que la documentation réglementaire est complète.

**Critères d'acceptation** :
- [ ] L'assistant vérifie la présence des mentions obligatoires dans les documents réglementaires
- [ ] Les exigences de reporting AIFMD sont listées avec leur statut de conformité
- [ ] Les écarts avec les exigences réglementaires sont signalés avec la référence légale
- [ ] Un rapport de conformité est générable par régulateur (AMF, FCA, AIFMD)
- [ ] Les exigences réglementaires sont mises à jour périodiquement

---

### US-356 : Vérification des ratios réglementaires `P2`

**Description** : En tant que gestionnaire de fonds, je veux que l'assistant calcule et vérifie les ratios réglementaires à partir des données de la data room, afin de m'assurer du respect des limites prudentielles.

**Critères d'acceptation** :
- [ ] Les ratios réglementaires courants sont calculés (ratio de diversification, limites de concentration, ratio de levier)
- [ ] Les dépassements de limites sont signalés avec le ratio concerné et la limite applicable
- [ ] Les calculs sont documentés avec les données sources
- [ ] L'évolution des ratios dans le temps est traçable
- [ ] Les limites applicables sont paramétrables selon la juridiction

---

### US-357 : Audit trail des actions utilisateur `P0`

**Description** : En tant qu'administrateur, je veux que toutes les actions des utilisateurs soient tracées dans un journal d'audit immuable, afin de répondre aux exigences réglementaires et de contrôle interne.

**Critères d'acceptation** :
- [ ] Chaque action est horodatée : connexion, consultation, interrogation, génération, export, partage
- [ ] Le journal est immuable et non modifiable par les utilisateurs
- [ ] Le journal est consultable avec filtres (utilisateur, action, date, projet)
- [ ] Les exports de documents sont tracés avec le destinataire et le format
- [ ] Le journal est exportable pour audit externe

---

### US-358 : Horodatage certifié des analyses `P1`

**Description** : En tant qu'analyste financier, je veux que chaque analyse réalisée par l'assistant soit horodatée de manière certifiée, afin de prouver la date à laquelle une information a été consultée ou une analyse produite.

**Critères d'acceptation** :
- [ ] Chaque réponse de l'assistant est horodatée avec un timestamp précis
- [ ] Les documents générés incluent un horodatage certifié
- [ ] L'horodatage est vérifiable et non altérable
- [ ] La version des documents sources utilisés est enregistrée avec l'horodatage
- [ ] L'horodatage est conforme aux standards d'archivage réglementaire

---

### US-359 : Disclaimers automatiques `P0`

**Description** : En tant que gestionnaire de fonds, je veux que les documents générés et les réponses de l'assistant incluent des disclaimers appropriés, afin de protéger l'entreprise contre les risques juridiques liés aux analyses automatisées.

**Critères d'acceptation** :
- [ ] Un disclaimer est ajouté automatiquement à chaque document généré
- [ ] Le disclaimer précise que l'analyse est produite par une IA et ne constitue pas un conseil en investissement
- [ ] Le contenu du disclaimer est configurable par l'administrateur
- [ ] Les réponses du chat incluent un avertissement discret quand elles contiennent des données financières
- [ ] Les disclaimers sont adaptés à la juridiction de l'utilisateur

---

### US-360 : Classification des données sensibles `P1`

**Description** : En tant qu'administrateur, je veux que le système identifie et classifie automatiquement les données sensibles dans les documents importés, afin de contrôler leur diffusion.

**Critères d'acceptation** :
- [ ] Les données personnelles (noms, adresses, numéros d'identification) sont détectées et taggées
- [ ] Les données financières confidentielles sont identifiées (valorisations non publiques, projections)
- [ ] Un niveau de confidentialité est attribué à chaque document (public, interne, confidentiel, secret)
- [ ] Les données sensibles sont masquées par défaut dans les exports partagés
- [ ] L'utilisateur est alerté quand il tente d'exporter des données classifiées

---

### US-361 : Rapport de conformité réglementaire `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir générer un rapport de conformité réglementaire consolidé, afin de documenter le respect des obligations pour les audits.

**Critères d'acceptation** :
- [ ] Le rapport couvre les dimensions KYC, AML, ratios prudentiels et exigences documentaires
- [ ] Le statut de conformité est indiqué pour chaque exigence (conforme, non conforme, partiel, non applicable)
- [ ] Les éléments non conformes sont accompagnés de recommandations
- [ ] Le rapport est horodaté et versionné
- [ ] Le format est conforme aux attentes des régulateurs (AMF, FCA)

---

### US-362 : Détection de conflits d'intérêts `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant détecte les conflits d'intérêts potentiels mentionnés dans les documents, afin de les documenter dans le cadre de la due diligence.

**Critères d'acceptation** :
- [ ] Les relations entre entités (participations croisées, dirigeants communs) sont identifiées
- [ ] Les conflits potentiels sont signalés avec explication
- [ ] Les transactions avec parties liées sont mises en évidence
- [ ] Les conflits sont classés par niveau de risque
- [ ] Un rapport dédié aux conflits d'intérêts est générable

---

### US-363 : Traçabilité des sources utilisées `P1`

**Description** : En tant qu'analyste financier, je veux que chaque analyse ou document généré inclue la liste exhaustive des sources utilisées, afin de garantir la transparence du processus d'analyse.

**Critères d'acceptation** :
- [ ] La liste des documents sources est annexée à chaque document généré
- [ ] Chaque source est identifiée avec son nom, sa date, son type et sa version
- [ ] Les passages spécifiques utilisés sont référencés
- [ ] La liste est triée par ordre d'importance ou de fréquence de citation
- [ ] Les sources non utilisées (documents disponibles mais non mobilisés) sont listées séparément

---

### US-364 : Archivage réglementaire des conversations `P1`

**Description** : En tant qu'administrateur, je veux que les conversations contenant des analyses financières soient archivées de manière conforme aux exigences réglementaires, afin de répondre aux demandes de contrôle.

**Critères d'acceptation** :
- [ ] Les conversations sont archivées automatiquement après clôture
- [ ] L'archive inclut les messages, les documents générés et les sources consultées
- [ ] La durée de rétention est configurable selon les exigences réglementaires (5 ans, 10 ans)
- [ ] Les archives sont consultables mais non modifiables
- [ ] L'export des archives est possible au format requis par les régulateurs

---

### US-365 : Contrôle d'accès par rôle `P1`

**Description** : En tant qu'administrateur, je veux pouvoir définir des rôles avec des niveaux d'accès différents (analyste, gestionnaire, compliance, administrateur), afin de contrôler qui peut voir et faire quoi.

**Critères d'acceptation** :
- [ ] Des rôles prédéfinis sont disponibles : analyste, gestionnaire, compliance officer, administrateur
- [ ] Chaque rôle a des permissions spécifiques (lecture, écriture, export, administration)
- [ ] L'accès aux projets est contrôlable par rôle
- [ ] Les tentatives d'accès non autorisées sont logguées
- [ ] Les rôles sont assignables et révocables par l'administrateur

---

### US-366 : Export pour audit externe `P2`

**Description** : En tant qu'administrateur, je veux pouvoir exporter l'ensemble des données d'un projet (documents, conversations, analyses, journal d'audit) dans un format structuré, afin de répondre à une demande d'audit externe.

**Critères d'acceptation** :
- [ ] L'export inclut tous les documents, conversations, analyses et logs du projet
- [ ] Le format est structuré et exploitable (ZIP contenant PDF, CSV et JSON)
- [ ] L'intégrité de l'export est vérifiable (checksum)
- [ ] L'export est traçé dans le journal d'audit
- [ ] L'accès à la fonction d'export est restreint aux administrateurs
