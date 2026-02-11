# 31 — Intégrations financières

Fonctionnalités liées à l'intégration de flux de données de marché, de bases de presse financière, de terminaux Bloomberg et de registres réglementaires.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv Workspace, PitchBook, Preqin, Morningstar Direct

**Axe stratégique** : Vélocité

---

### US-405 : Flux de données de marché en temps réel `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant puisse accéder à des données de marché en temps réel (indices, taux, devises), afin de contextualiser ses analyses avec les conditions de marché actuelles.

**Critères d'acceptation** :
- [ ] Les données de marché courantes sont accessibles (indices boursiers, taux souverains, taux de change)
- [ ] Les données sont mises à jour en temps réel ou avec un décalage maximal de 15 minutes
- [ ] L'assistant cite la source et l'horodatage de chaque donnée de marché
- [ ] Les données de marché sont intégrables dans les graphiques et documents générés
- [ ] L'utilisateur peut configurer les données de marché à suivre

---

### US-406 : Intégration presse financière `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant puisse accéder à des articles de presse financière pour croiser avec les données des data rooms, afin d'enrichir les analyses et détecter des contradictions.

**Critères d'acceptation** :
- [ ] Les sources de presse sont configurables (Les Échos, Financial Times, Bloomberg News, Reuters)
- [ ] L'assistant peut rechercher des articles par entité, secteur ou mot-clé
- [ ] Les articles sont résumés avec les informations clés extraites
- [ ] La presse est utilisable comme source pour la détection de contradictions
- [ ] Les articles consultés sont tracés dans le journal d'audit

---

### US-407 : Connecteur Bloomberg `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir connecter mon terminal Bloomberg à Decider, afin d'enrichir les analyses avec les données Bloomberg.

**Critères d'acceptation** :
- [ ] L'intégration se fait via l'API Bloomberg (B-PIPE ou BLPAPI)
- [ ] Les données de marché, les profils de fonds et les analytics Bloomberg sont accessibles
- [ ] L'authentification Bloomberg est sécurisée et respecte les licences
- [ ] Les données Bloomberg sont citées avec la mention de source appropriée
- [ ] La connexion est testable depuis les paramètres

---

### US-408 : Connecteur Refinitiv `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir connecter Refinitiv Workspace à Decider, afin d'accéder aux données Refinitiv dans mes analyses.

**Critères d'acceptation** :
- [ ] L'intégration se fait via l'API Refinitiv (Eikon Data API)
- [ ] Les données de marché, les fondamentaux et les analytics Refinitiv sont accessibles
- [ ] L'authentification est gérée de manière sécurisée
- [ ] Les données Refinitiv sont intégrables dans les graphiques et documents
- [ ] Les erreurs de connexion sont gérées avec des messages explicatifs

---

### US-409 : Registres AMF/FCA `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant puisse vérifier les informations d'enregistrement des fonds et sociétés de gestion dans les registres AMF et FCA, afin de valider leur conformité réglementaire.

**Critères d'acceptation** :
- [ ] L'assistant peut interroger les registres publics AMF (GECO) et FCA
- [ ] Les informations de base sont vérifiées : agrément, statut, date d'enregistrement
- [ ] Les résultats sont présentés avec la date de vérification
- [ ] Les incohérences entre data room et registre sont signalées
- [ ] La vérification est traçable dans le journal d'audit

---

### US-410 : Bases de données Preqin/PitchBook `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir connecter les bases de données Preqin ou PitchBook, afin d'enrichir mes analyses avec des données de marché private equity.

**Critères d'acceptation** :
- [ ] L'intégration se fait via les APIs Preqin et/ou PitchBook
- [ ] Les données de performance, de levée de fonds et de deals sont accessibles
- [ ] Les données sont utilisables pour la comparaison au peer group
- [ ] L'authentification respecte les licences des fournisseurs
- [ ] Les données sont citées avec la source et la date d'extraction

---

### US-411 : Import depuis systèmes PMS `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir importer des données depuis mon système de gestion de portefeuille (PMS), afin de centraliser toutes les informations dans Decider.

**Critères d'acceptation** :
- [ ] L'import supporte les formats courants (CSV, XML, API)
- [ ] Les données de portefeuille (positions, NAV, transactions) sont importables
- [ ] Le mapping des champs est configurable pour s'adapter à chaque PMS
- [ ] L'import peut être automatisé (récurrence programmable)
- [ ] Les données importées sont intégrées au projet fonds existant

---

### US-412 : API d'enrichissement de données `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir connecter des sources de données tierces via API, afin d'enrichir les data rooms avec des informations complémentaires.

**Critères d'acceptation** :
- [ ] Un framework d'intégration permet de connecter des APIs externes
- [ ] Les données enrichies sont intégrées au contexte du projet fonds
- [ ] L'authentification est configurable (API key, OAuth)
- [ ] Le mapping des données est paramétrable
- [ ] Un log des enrichissements est disponible

---

### US-413 : Intégration calendrier financier `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant connaisse le calendrier financier (dates de publication des résultats, échéances réglementaires, dates de closing), afin de contextualiser ses analyses.

**Critères d'acceptation** :
- [ ] Les dates clés du calendrier financier sont intégrées (résultats trimestriels, échéances réglementaires)
- [ ] L'assistant mentionne les dates pertinentes dans ses analyses
- [ ] Les échéances extraites des data rooms sont ajoutées au calendrier
- [ ] Le calendrier est consultable dans une vue dédiée
- [ ] Des rappels sont disponibles pour les échéances à venir

---

### US-414 : Flux de données ESG `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir intégrer des données ESG provenant de fournisseurs spécialisés, afin d'enrichir le scoring ESG des fonds analysés.

**Critères d'acceptation** :
- [ ] Les données de fournisseurs ESG courants sont intégrables (MSCI ESG, Sustainalytics, ISS)
- [ ] Les scores ESG externes sont comparables aux évaluations internes
- [ ] Les données sont mises à jour automatiquement selon la fréquence du fournisseur
- [ ] Les controverses ESG sont détectées et signalées
- [ ] Les données ESG sont intégrables dans les documents générés

---

### US-415 : Connecteur CRM `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir lier un projet Decider à une entrée CRM, afin de connecter l'analyse financière au pipeline commercial.

**Critères d'acceptation** :
- [ ] L'intégration supporte les CRM courants (Salesforce, HubSpot) via API
- [ ] Un projet fonds peut être lié à un deal ou un contact CRM
- [ ] Les mises à jour de statut dans Decider sont reflétées dans le CRM
- [ ] Les informations du CRM enrichissent le contexte du projet dans Decider
- [ ] L'intégration est configurable par l'administrateur

---

### US-416 : Webhook pour événements `P2`

**Description** : En tant qu'administrateur, je veux pouvoir configurer des webhooks déclenchés par des événements Decider (import terminé, document généré, alerte déclenchée), afin d'intégrer Decider dans les workflows existants.

**Critères d'acceptation** :
- [ ] Les événements configurables incluent : import terminé, document généré, alerte déclenchée, contradiction détectée
- [ ] L'URL du webhook est configurable par événement
- [ ] Le payload inclut les informations contextuelles de l'événement (projet, utilisateur, détails)
- [ ] Les erreurs de livraison sont loggées avec possibilité de retry
- [ ] Un testeur de webhook est intégré dans l'interface de configuration
