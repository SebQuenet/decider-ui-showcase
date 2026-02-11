# 25 — Détection de contradictions cross-sources

Détection automatique de contradictions entre documents d'une même data room, entre data rooms distinctes, et entre data rooms et sources de presse — le différenciateur clé de Decider.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv Workspace, Dow Jones Risk & Compliance

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-101 (Comparaison de sources multiples) — US-101 compare des sources web de manière générique ; ce fichier spécialise en détection de contradictions financières intra-data room, cross-data rooms et versus presse, avec niveaux de sévérité et rapport structuré pour la due diligence.

---

### US-325 : Détection de contradictions intra-data room `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant détecte automatiquement les contradictions entre les documents d'une même data room, afin d'identifier les incohérences avant de prendre une décision d'investissement.

**Critères d'acceptation** :
- [ ] L'assistant compare les affirmations factuelles (chiffres, dates, pourcentages) entre les documents d'un même projet
- [ ] Chaque contradiction identifiée cite les deux sources en conflit avec document et page
- [ ] Les contradictions sont classées par type (chiffres divergents, dates incohérentes, affirmations opposées)
- [ ] L'analyse est déclenchable manuellement ou proposée après un import complet
- [ ] Le nombre de contradictions détectées est affiché dans le dashboard du projet

---

### US-326 : Détection de contradictions cross-data rooms `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant détecte les contradictions entre les documents de deux ou plusieurs data rooms, afin de croiser les informations lors d'une analyse multi-fonds.

**Critères d'acceptation** :
- [ ] L'assistant compare les données financières entre les data rooms sélectionnées
- [ ] Les contradictions sont présentées avec les sources des deux data rooms
- [ ] L'analyse fonctionne en mode « Tous les projets »
- [ ] Les contradictions portant sur des entités communes (même société, même marché) sont priorisées
- [ ] L'assistant distingue les contradictions factuelles des différences d'interprétation

---

### US-327 : Détection de contradictions vs presse `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant croise les affirmations des data rooms avec les informations publiées dans la presse financière, afin de détecter des incohérences avec les sources publiques.

**Critères d'acceptation** :
- [ ] L'assistant compare les données clés de la data room (performance, chiffre d'affaires, effectifs) avec les articles de presse disponibles
- [ ] Chaque contradiction cite la source data room et la source presse (titre, date, publication)
- [ ] L'assistant évalue le niveau de fiabilité de la source presse
- [ ] Les contradictions presse sont distinguées visuellement des contradictions inter-documents
- [ ] L'utilisateur peut configurer les sources presse à inclure dans l'analyse

---

### US-328 : Rapport structuré de contradictions `P0`

**Description** : En tant qu'analyste financier, je veux recevoir un rapport structuré listant toutes les contradictions détectées avec contexte et sources, afin de disposer d'un document exploitable pour la due diligence.

**Critères d'acceptation** :
- [ ] Le rapport est organisé par catégorie (intra-data room, cross-data rooms, vs presse)
- [ ] Chaque entrée inclut : description de la contradiction, sources en conflit, niveau de sévérité, recommandation
- [ ] Le rapport inclut un résumé exécutif avec le nombre total de contradictions par catégorie
- [ ] Le rapport est consultable dans le chat et exportable en PDF
- [ ] Les citations sont cliquables et renvoient vers les passages sources

---

### US-329 : Niveau de sévérité des contradictions `P1`

**Description** : En tant qu'analyste financier, je veux que chaque contradiction soit classée par niveau de sévérité (critique, majeure, mineure), afin de concentrer mon attention sur les incohérences les plus impactantes.

**Critères d'acceptation** :
- [ ] Trois niveaux de sévérité sont définis : critique (impact sur la décision d'investissement), majeure (écart significatif), mineure (écart négligeable ou formel)
- [ ] La sévérité est déterminée automatiquement en fonction de l'écart et du contexte
- [ ] Le rapport peut être filtré par niveau de sévérité
- [ ] Un code couleur distingue les niveaux (rouge, orange, jaune)
- [ ] L'utilisateur peut ajuster le niveau de sévérité manuellement

---

### US-330 : Mise à jour du rapport après ajout de documents `P1`

**Description** : En tant qu'analyste financier, je veux que le rapport de contradictions soit mis à jour automatiquement quand de nouveaux documents sont ajoutés à la data room, afin de garder l'analyse à jour.

**Critères d'acceptation** :
- [ ] L'ajout d'un document déclenche une réévaluation des contradictions
- [ ] Les nouvelles contradictions sont identifiées comme telles dans le rapport
- [ ] Les contradictions résolues par le nouveau document sont marquées
- [ ] Un diff entre l'ancien et le nouveau rapport est disponible
- [ ] L'utilisateur est notifié des changements dans le rapport

---

### US-331 : Notification de nouvelles contradictions `P2`

**Description** : En tant qu'analyste financier, je veux recevoir une notification quand de nouvelles contradictions sont détectées (nouveau document importé ou nouvelle source presse), afin de réagir rapidement.

**Critères d'acceptation** :
- [ ] Une notification in-app est envoyée quand de nouvelles contradictions sont détectées
- [ ] La notification indique le nombre et la sévérité des nouvelles contradictions
- [ ] Un clic sur la notification ouvre le rapport de contradictions mis à jour
- [ ] La fréquence des notifications est configurable
- [ ] Les notifications critiques peuvent être envoyées par email

---

### US-332 : Historique des contradictions résolues `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir consulter l'historique des contradictions résolues ou annotées, afin de tracer les décisions prises pendant la due diligence.

**Critères d'acceptation** :
- [ ] Les contradictions marquées comme résolues sont archivées avec la raison de résolution
- [ ] L'historique affiche la date de détection, la date de résolution et l'utilisateur
- [ ] Les contradictions résolues restent consultables mais ne polluent pas le rapport actif
- [ ] Un rapport d'audit liste toutes les contradictions traitées
- [ ] La résolution peut être documentée avec un commentaire libre

---

### US-333 : Lien vers les passages contradictoires `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir naviguer directement vers les passages contradictoires dans les documents sources, afin de vérifier le contexte de chaque contradiction.

**Critères d'acceptation** :
- [ ] Chaque contradiction affiche deux liens : un vers chaque source en conflit
- [ ] Un clic ouvre le document à la page exacte avec le passage surligné
- [ ] Une vue côte à côte permet de comparer les deux passages simultanément
- [ ] Le surlignage distingue visuellement les éléments en contradiction
- [ ] La navigation fonctionne pour les documents PDF, DOCX et les articles de presse

---

### US-334 : Contradictions sur les données chiffrées `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant détecte spécifiquement les écarts sur les données chiffrées (montants, pourcentages, dates) entre les sources, afin de repérer les erreurs de reporting ou les incohérences comptables.

**Critères d'acceptation** :
- [ ] Les écarts chiffrés sont détectés avec un seuil de tolérance configurable (ex. : ± 1 %)
- [ ] L'écart est quantifié en valeur absolue et en pourcentage
- [ ] Les données comparées sont normalisées (même devise, même période)
- [ ] Les écarts sont classés par importance (montant de l'écart × matérialité)
- [ ] Un tableau récapitulatif liste tous les écarts chiffrés détectés

---

### US-335 : Due diligence express `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir lancer une « due diligence express » qui combine extraction de métriques, détection de contradictions et identification de documents manquants en une seule commande, afin d'obtenir un premier diagnostic complet en quelques minutes.

**Critères d'acceptation** :
- [ ] Une commande unique déclenche l'analyse complète : métriques clés, contradictions, documents manquants
- [ ] Le résultat est présenté dans un rapport structuré avec sections dédiées
- [ ] Le temps de traitement est affiché avec une barre de progression
- [ ] Le rapport inclut un score de confiance global sur la data room
- [ ] Le rapport est exportable en PDF pour partage immédiat

---

### US-336 : Export du rapport de contradictions `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir exporter le rapport de contradictions en PDF ou DOCX avec mise en forme professionnelle, afin de l'annexer à un dossier de due diligence.

**Critères d'acceptation** :
- [ ] L'export est disponible en PDF et DOCX
- [ ] Le document inclut un en-tête avec le nom du projet, la date et le périmètre d'analyse
- [ ] Les contradictions sont formatées avec numérotation, sources et sévérité
- [ ] Les graphiques et statistiques du rapport sont inclus dans l'export
- [ ] L'export respecte le theming Decider (palette, typographie)
