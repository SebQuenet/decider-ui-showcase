# 23 — Comparaison cross-fonds

Fonctionnalités liées à la comparaison de données entre plusieurs data rooms, aux track records, et aux matrices comparatives multi-critères.

**Plateformes de référence** : Decider.ai, Morningstar Direct, PitchBook, Preqin, Bloomberg Terminal

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-176 (Comparaison de documents) — US-176 compare deux documents en mode diff générique ; ce fichier spécialise en comparaison de métriques financières, track records et termes contractuels cross-data rooms.

---

### US-297 : Comparaison de métriques financières entre fonds `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les métriques clés de plusieurs fonds en une seule question, afin d'évaluer rapidement les différences de performance et de risque.

**Critères d'acceptation** :
- [ ] L'assistant compare les métriques demandées (TRI, TVPI, volatilité, etc.) entre les fonds sélectionnés
- [ ] Les résultats sont présentés dans un tableau comparatif avec une colonne par fonds
- [ ] Chaque valeur est accompagnée de sa source et de sa période
- [ ] Les écarts significatifs sont mis en évidence visuellement
- [ ] La comparaison fonctionne avec le sélecteur sur « Tous les projets »

---

### US-298 : Comparaison des track records `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les track records de plusieurs fonds (historique de performance, durée d'existence, millésimes), afin d'évaluer leur maturité et leur régularité.

**Critères d'acceptation** :
- [ ] Les track records sont présentés côte à côte avec années d'existence et historique de performance
- [ ] Le fonds avec le plus long historique est identifié clairement
- [ ] Les données sont sourcées pour chaque fonds
- [ ] Les périodes comparables sont alignées pour faciliter la lecture
- [ ] L'assistant signale quand les track records ne sont pas comparables (périodes différentes, stratégies différentes)

---

### US-299 : Matrice comparative multi-critères `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer une matrice comparative couvrant plusieurs dimensions (performance, risque, frais, gouvernance), afin d'avoir une vue holistique des fonds analysés.

**Critères d'acceptation** :
- [ ] L'assistant génère un tableau structuré avec les dimensions clés en lignes et les fonds en colonnes
- [ ] Les dimensions couvertes sont configurables par l'utilisateur
- [ ] Un code couleur indique les points forts et les points faibles de chaque fonds
- [ ] La matrice est exportable en CSV et PDF
- [ ] L'assistant propose des dimensions par défaut adaptées au type de fonds

---

### US-300 : Comparaison des structures de frais `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les structures de frais de plusieurs fonds (management fees, carried interest, hurdle rate), afin d'évaluer leur compétitivité.

**Critères d'acceptation** :
- [ ] Les frais sont extraits et normalisés pour chaque fonds (frais de gestion, carry, hurdle, frais de transaction)
- [ ] La comparaison est présentée dans un tableau structuré
- [ ] L'assistant calcule l'impact des frais sur le rendement net pour chaque fonds
- [ ] Les écarts par rapport aux moyennes de marché sont signalés
- [ ] Les clauses spécifiques (catch-up, clawback) sont incluses dans la comparaison

---

### US-301 : Comparaison des stratégies d'investissement `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les stratégies déclarées de plusieurs fonds (secteurs, géographie, taille des deals), afin d'identifier les recoupements et les spécificités.

**Critères d'acceptation** :
- [ ] Les stratégies sont extraites des documents et résumées pour chaque fonds
- [ ] Les critères de comparaison incluent : secteurs cibles, géographie, taille de deals, type d'investissement
- [ ] Les recoupements entre fonds sont identifiés visuellement
- [ ] L'assistant signale les différences majeures entre les stratégies
- [ ] La comparaison est basée sur les documents sources avec citations

---

### US-302 : Benchmark contre un indice de référence `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer la performance d'un fonds à un indice de référence, afin d'évaluer sa surperformance ou sous-performance relative.

**Critères d'acceptation** :
- [ ] Les indices de référence courants sont disponibles (MSCI World, S&P 500, Cambridge Associates PE Index, etc.)
- [ ] La comparaison affiche les rendements relatifs sur les mêmes périodes
- [ ] Un graphique superpose la performance du fonds et de l'indice
- [ ] L'alpha et le beta sont calculés quand les données le permettent
- [ ] L'utilisateur peut sélectionner l'indice de référence pertinent

---

### US-303 : Comparaison des profils de risque `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les profils de risque de plusieurs fonds (volatilité, drawdown, concentration), afin d'évaluer leur adéquation avec ma tolérance au risque.

**Critères d'acceptation** :
- [ ] Les métriques de risque sont comparées : volatilité, drawdown maximum, ratio de Sharpe, VaR
- [ ] La concentration sectorielle et géographique est comparée
- [ ] Les résultats sont présentés dans un tableau et/ou un graphique radar
- [ ] L'assistant identifie le fonds le plus risqué et le plus défensif
- [ ] Les données sources sont citées pour chaque métrique de risque

---

### US-304 : Comparaison des équipes de gestion `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les équipes de gestion de plusieurs fonds (expérience, stabilité, track record personnel), afin d'évaluer le risque de key man.

**Critères d'acceptation** :
- [ ] Les informations sur les gérants clés sont extraites : expérience, ancienneté, fonds précédents
- [ ] La stabilité de l'équipe est évaluée (turnover, ancienneté moyenne)
- [ ] Le risque de key man est identifié pour chaque fonds
- [ ] La comparaison est présentée dans un format structuré
- [ ] L'assistant signale les lacunes d'information sur les équipes

---

### US-305 : Comparaison des termes contractuels `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les termes contractuels de plusieurs fonds (durée, clauses de sortie, gouvernance), afin de négocier en connaissance de cause.

**Critères d'acceptation** :
- [ ] Les termes clés sont extraits et comparés : durée, extensions, clauses de sortie, comités consultatifs
- [ ] Les clauses inhabituelles ou défavorables sont signalées
- [ ] La comparaison est présentée dans un tableau structuré
- [ ] L'assistant identifie les écarts par rapport aux pratiques de marché
- [ ] Les termes sont sourcés avec référence au document et à la clause

---

### US-306 : Export de rapport comparatif `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir exporter une comparaison de fonds complète sous forme de rapport formaté, afin de la partager avec mon équipe ou un comité d'investissement.

**Critères d'acceptation** :
- [ ] L'export est disponible en PDF et DOCX
- [ ] Le rapport inclut les tableaux comparatifs, graphiques et sources
- [ ] La mise en forme respecte les standards professionnels (en-tête, pagination, table des matières)
- [ ] L'utilisateur peut sélectionner les sections à inclure dans l'export
- [ ] Le rapport est généré en moins de 30 secondes

---

### US-307 : Comparaison temporelle d'un même fonds `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer les données d'un même fonds à différentes dates (ex. : rapport T1 vs T4), afin de suivre son évolution dans le temps.

**Critères d'acceptation** :
- [ ] L'utilisateur peut sélectionner deux ou plusieurs versions temporelles d'un même fonds
- [ ] Les métriques sont comparées période par période
- [ ] Les variations significatives sont mises en évidence
- [ ] L'assistant identifie les tendances (amélioration, détérioration, stabilité)
- [ ] Les données sont sourcées pour chaque période

---

### US-308 : Classement multi-fonds par critère `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir classer plusieurs fonds selon un critère donné (TRI, taille, frais, Sharpe), afin d'identifier rapidement les meilleurs et les moins bons.

**Critères d'acceptation** :
- [ ] L'utilisateur peut demander un classement sur n'importe quel critère quantitatif
- [ ] Le classement est affiché sous forme de tableau trié
- [ ] Le rang de chaque fonds est indiqué
- [ ] L'assistant supporte les classements multi-critères avec pondération
- [ ] Les ex-aequo et les données manquantes sont gérés explicitement
