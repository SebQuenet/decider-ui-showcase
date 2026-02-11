# 21 — Data rooms & Projets fonds

Fonctionnalités liées à la création de projets fonds, l'import et l'indexation de data rooms, et la sélection de contexte pour l'interrogation.

**Plateformes de référence** : Decider.ai, eFront, Preqin, Intralinks, Datasite

**Axe stratégique** : Vélocité

> **Spécialise** : US-124 (Base de connaissances par projet) et fichier 09b (Projets) — étend le concept de projet générique (entité, cycle de vie, dashboard, métadonnées extensibles) en « projet fonds » avec data rooms financières, classification automatique et sélecteur de contexte fonds.

---

### US-267 : Création d'un projet fonds `P0`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir créer un projet associé à un fonds d'investissement, afin de regrouper tous les documents de la data room dans un espace dédié.

**Critères d'acceptation** :
- [ ] Un bouton « Nouveau projet » permet de créer un projet avec un nom et une description
- [ ] Le projet est typé « Fonds » avec des champs spécifiques (nom du fonds, stratégie, devise, géographie)
- [ ] Le projet apparaît immédiatement dans le dashboard après création
- [ ] Un projet peut être renommé et ses métadonnées modifiées à tout moment
- [ ] La création d'un projet ne nécessite aucune configuration technique préalable

---

### US-268 : Import automatique d'une data room `P0`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir importer l'ensemble des documents d'une data room en une seule opération, afin de rendre les données exploitables sans classement manuel.

**Critères d'acceptation** :
- [ ] L'import accepte un dossier complet ou une sélection multiple de fichiers (PDF, DOCX, XLSX, PPTX)
- [ ] Une barre de progression indique l'avancement de l'import et de l'indexation
- [ ] Les documents sont indexés automatiquement sans intervention utilisateur
- [ ] L'import gère les fichiers volumineux (> 100 Mo) et les data rooms de plusieurs centaines de documents
- [ ] Un récapitulatif post-import affiche le nombre de documents traités, les erreurs éventuelles et le statut d'indexation

---

### US-269 : Sélecteur de contexte fonds `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir sélectionner un fonds spécifique ou « Tous les projets » avant d'interroger le chatbot, afin de cibler mes questions sur le périmètre souhaité.

**Critères d'acceptation** :
- [ ] Un sélecteur est visible en permanence dans l'interface de chat
- [ ] Les options incluent chaque projet fonds individuellement et une option « Tous les projets »
- [ ] Le changement de contexte est instantané et ne crée pas de nouvelle conversation
- [ ] Le contexte sélectionné est affiché clairement pour éviter toute ambiguïté
- [ ] Le sélecteur est accessible au clavier et via raccourci

---

### US-270 : Métadonnées financières du projet `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir renseigner des métadonnées financières structurées pour chaque projet fonds, afin d'enrichir le contexte disponible pour l'assistant.

**Critères d'acceptation** :
- [ ] Des champs structurés sont disponibles : stratégie d'investissement, devise, géographie, taille du fonds, date de lancement, gestionnaire
- [ ] Les métadonnées sont éditables à tout moment depuis la fiche projet
- [ ] L'assistant utilise ces métadonnées pour contextualiser ses réponses
- [ ] Les champs acceptent la saisie libre et les valeurs prédéfinies
- [ ] Les métadonnées sont exportables au format structuré (JSON, CSV)

---

### US-271 : Dashboard des projets fonds `P0`

**Description** : En tant qu'analyste financier, je veux disposer d'un dashboard listant tous mes projets fonds avec leur statut, afin d'avoir une vue d'ensemble de mes data rooms.

**Critères d'acceptation** :
- [ ] Le dashboard affiche la liste des projets avec nom, nombre de documents, date de dernier import et statut d'indexation
- [ ] Les projets sont triables et filtrables par nom, date et statut
- [ ] Un indicateur visuel signale les projets en cours d'indexation
- [ ] Le dashboard est la page d'accueil par défaut après connexion
- [ ] Un clic sur un projet ouvre sa fiche détaillée

---

### US-272 : Indexation automatique des documents financiers `P1`

**Description** : En tant qu'analyste financier, je veux que les documents importés soient automatiquement parsés et indexés avec extraction du texte, des tableaux et des chiffres, afin de pouvoir les interroger immédiatement.

**Critères d'acceptation** :
- [ ] Le texte est extrait de tous les formats supportés (PDF, DOCX, XLSX, PPTX)
- [ ] Les tableaux financiers sont détectés et structurés (lignes, colonnes, valeurs)
- [ ] Les chiffres et pourcentages sont extraits avec leur contexte (libellé, unité, période)
- [ ] L'indexation fonctionne sur des documents scannés via OCR
- [ ] Le temps d'indexation moyen est inférieur à 30 secondes par document

---

### US-273 : Détection du type de document financier `P1`

**Description** : En tant qu'analyste financier, je veux que le système identifie automatiquement le type de chaque document importé (prospectus, rapport annuel, term sheet, etc.), afin de faciliter la navigation et l'interrogation.

**Critères d'acceptation** :
- [ ] Les types détectés incluent : prospectus, rapport annuel, term sheet, états financiers, pitch deck, due diligence report, side letter, LPA
- [ ] Le type détecté est affiché comme tag sur chaque document
- [ ] L'utilisateur peut corriger le type détecté manuellement
- [ ] La détection atteint un taux de précision supérieur à 90 %
- [ ] Le type de document est utilisable comme filtre dans la recherche

---

### US-274 : Aperçu du contenu indexé `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir consulter un aperçu du contenu extrait de chaque document, afin de vérifier la qualité de l'indexation avant interrogation.

**Critères d'acceptation** :
- [ ] Un clic sur un document affiche un résumé automatique de son contenu
- [ ] Les tableaux extraits sont prévisualisables dans leur format structuré
- [ ] Les passages clés (montants, dates, parties prenantes) sont surlignés
- [ ] L'aperçu permet de naviguer vers le document source original
- [ ] Un indicateur de confiance d'extraction est affiché pour chaque section

---

### US-275 : Classification automatique des documents `P0`

**Description** : En tant qu'analyste financier, je veux que les documents d'une data room soient automatiquement classés par catégorie (juridique, financier, commercial, technique), afin de naviguer efficacement dans un grand volume de fichiers.

**Critères d'acceptation** :
- [ ] Les documents sont automatiquement classés dans des catégories prédéfinies à l'import
- [ ] Les catégories sont affichées comme filtres dans l'explorateur de la data room
- [ ] La classification est modifiable manuellement par l'utilisateur
- [ ] Les sous-catégories sont détectées (ex. : financier → états financiers, valorisation, dette)
- [ ] Un compteur par catégorie est affiché dans le dashboard du projet

---

### US-276 : Recherche full-text dans la data room `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir rechercher un terme ou une expression dans l'ensemble des documents d'une data room, afin de localiser rapidement une information sans passer par le chatbot.

**Critères d'acceptation** :
- [ ] Un champ de recherche est disponible dans la vue data room de chaque projet
- [ ] Les résultats affichent le document, la page et un extrait contextuel avec le terme surligné
- [ ] La recherche supporte les opérateurs booléens (ET, OU, guillemets pour l'expression exacte)
- [ ] Les résultats sont classés par pertinence
- [ ] La recherche retourne des résultats en moins de 2 secondes

---

### US-277 : Gestion des versions de documents `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir importer une nouvelle version d'un document existant sans perdre l'ancienne, afin de suivre l'évolution des informations dans la data room.

**Critères d'acceptation** :
- [ ] Le système détecte qu'un document importé est une nouvelle version d'un existant
- [ ] Les versions précédentes sont conservées et accessibles
- [ ] Un historique des versions est consultable avec date et taille
- [ ] L'assistant utilise par défaut la dernière version mais peut citer les précédentes
- [ ] Un diff visuel entre versions est disponible

---

### US-278 : Statut d'indexation en temps réel `P1`

**Description** : En tant qu'analyste financier, je veux voir le statut d'indexation de chaque document en temps réel, afin de savoir quand je peux commencer à interroger la data room.

**Critères d'acceptation** :
- [ ] Chaque document affiche un statut : en attente, en cours, indexé, erreur
- [ ] Une barre de progression globale indique l'avancement de l'indexation du projet
- [ ] Une notification est envoyée quand l'indexation complète est terminée
- [ ] Les documents en erreur affichent un message explicatif et un bouton de relance
- [ ] L'utilisateur peut interroger les documents déjà indexés sans attendre la fin du traitement complet

---

### US-279 : Archivage d'un projet fonds `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir archiver un projet fonds sans le supprimer, afin de garder un historique tout en désencombrant mon dashboard.

**Critères d'acceptation** :
- [ ] Un bouton « Archiver » est disponible dans la fiche projet
- [ ] Les projets archivés sont masqués du dashboard principal
- [ ] Un filtre « Archivés » permet de retrouver les projets archivés
- [ ] Un projet archivé peut être restauré à tout moment
- [ ] Les projets archivés ne sont pas inclus dans le sélecteur de contexte par défaut

---

### US-280 : Import incrémental de documents `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir ajouter de nouveaux documents à une data room existante sans réimporter l'ensemble, afin de mettre à jour un projet au fil du temps.

**Critères d'acceptation** :
- [ ] L'ajout de documents à un projet existant est possible depuis la fiche projet
- [ ] Les nouveaux documents sont indexés sans affecter les documents existants
- [ ] Le système détecte les doublons et propose de les ignorer ou de les remplacer
- [ ] Le dashboard reflète immédiatement le nombre de documents mis à jour
- [ ] L'historique d'import est consultable avec date et nombre de documents par lot

---

### US-281 : Partage de projet entre utilisateurs `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir partager un projet fonds avec des collègues, afin de collaborer sur l'analyse d'une data room.

**Critères d'acceptation** :
- [ ] Un bouton « Partager » permet d'inviter des utilisateurs par email ou nom
- [ ] Deux niveaux de permission sont disponibles : lecture seule et lecture/écriture
- [ ] Les utilisateurs invités voient le projet dans leur dashboard
- [ ] Le propriétaire peut révoquer l'accès à tout moment
- [ ] Les conversations de chaque utilisateur restent privées même sur un projet partagé

---

### US-282 : Quota et limites par projet `P2`

**Description** : En tant qu'administrateur, je veux pouvoir configurer des limites de stockage et de nombre de documents par projet, afin de maîtriser l'utilisation des ressources.

**Critères d'acceptation** :
- [ ] Un quota de stockage est défini par projet (configurable par l'administrateur)
- [ ] Un indicateur d'utilisation affiche l'espace consommé et restant
- [ ] Un avertissement est affiché quand le quota approche la limite (80 %, 90 %)
- [ ] L'import est bloqué avec un message explicatif quand le quota est atteint
- [ ] Les limites sont ajustables sans perte de données
