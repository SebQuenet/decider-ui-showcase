# 37 — Attribution de performance obligataire

Décomposition du rendement de portefeuilles fixed income selon le modèle Campisi : income return, effet courbe des taux (shift/twist/curvature), effet spread (sectoriel/spécifique), carry, roll-down, devises. Inclut l'approche Duration Times Spread (DTS) pour le high yield.

**Plateformes de référence** : Bloomberg PORT, FactSet Fixed Income Attribution, MSCI BarraOne, Confluence Unity, CloudAttribution

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-323 (Waterfall), US-309 (Courbe de rendement) — ce fichier ajoute la décomposition Campisi propre au fixed income, la modélisation de la courbe des taux, et l'attribution par rating/duration/secteur crédit.

---

## A — Dashboard et sélection

### US-481 : Dashboard d'attribution obligataire `P0`

**Description** : En tant qu'analyste crédit, je veux accéder à un dashboard consolidé présentant la décomposition Campisi de la performance d'un portefeuille obligataire, afin de comprendre en un coup d'œil les moteurs de rendement (income, courbe, spread, devises).

**Critères d'acceptation** :
- [ ] Le dashboard affiche le rendement total du portefeuille décomposé en : income return, treasury effect, spread effect, currency effect, résiduel
- [ ] Un waterfall chart principal résume visuellement la contribution de chaque composante
- [ ] Les KPI clés sont affichés en cartes : rendement total, rendement vs benchmark, duration effective, OAS moyen, yield-to-worst, DTS moyen
- [ ] Le dashboard est interactif : clic sur une composante pour drill-down
- [ ] La performance relative (excès de rendement vs benchmark) est mise en évidence

---

### US-482 : Sélection du portefeuille et benchmark `P0`

**Description** : En tant qu'analyste crédit, je veux pouvoir sélectionner un portefeuille obligataire et son benchmark de référence, afin de contextualiser l'attribution.

**Critères d'acceptation** :
- [ ] Un sélecteur propose les portefeuilles disponibles avec leur stratégie (IG, HY, aggregate, gouvernemental)
- [ ] Le benchmark est sélectionnable parmi des indices standards (Bloomberg Aggregate, ICE BofA HY, iBoxx)
- [ ] La période d'analyse est configurable par presets (MTD, QTD, YTD, 1Y, 3Y, inception) ou dates personnalisées
- [ ] Les métadonnées du portefeuille sont affichées (encours, nombre de lignes, duration, rating moyen, devise de référence)
- [ ] Le changement de portefeuille ou de période met à jour toutes les visualisations

---

## B — Décomposition Campisi (waterfall)

### US-483 : Waterfall Campisi — décomposition complète `P0`

**Description** : En tant qu'analyste crédit, je veux visualiser la décomposition Campisi complète sous forme de waterfall, afin de tracer la chaîne rendement total → income → treasury → spread → devises → résiduel.

**Critères d'acceptation** :
- [ ] Le waterfall affiche la chaîne : coupon → roll-down → convergence → income return (sous-total) → shift → twist → curvature → treasury effect (sous-total) → spread sectoriel → spread spécifique → spread effect (sous-total) → devises → résiduel → rendement total
- [ ] Les sous-totaux sont visuellement distincts (couleur différente des étapes intermédiaires)
- [ ] Les contributions positives sont en vert, les négatives en rouge
- [ ] Chaque barre affiche sa valeur en points de base (bps) et en pourcentage au survol
- [ ] Le waterfall est calculé pour le portefeuille ET le benchmark, avec l'excès de rendement décomposé

---

### US-484 : Drill-down income return `P1`

**Description** : En tant qu'analyste crédit, je veux pouvoir décomposer l'income return en ses sous-composantes, afin de comprendre la part du carry, du roll-down et de la convergence.

**Critères d'acceptation** :
- [ ] Le clic sur "Income Return" dans le waterfall ouvre un détail avec : coupon return, roll-down return, pull-to-par/convergence
- [ ] Le coupon return est ventilé par tranche de rating (AAA à CCC)
- [ ] Le roll-down est illustré par un graphique montrant le mouvement sur la courbe
- [ ] La comparaison portefeuille vs benchmark est affichée pour chaque sous-composante
- [ ] L'animation de transition du waterfall vers le drill-down est fluide

---

### US-485 : Drill-down treasury effect `P1`

**Description** : En tant qu'analyste crédit, je veux pouvoir décomposer l'effet taux en shift, twist et curvature, afin de comprendre comment les mouvements de la courbe ont impacté le portefeuille.

**Critères d'acceptation** :
- [ ] Le clic sur "Treasury Effect" ouvre un détail avec trois composantes : shift (parallèle), twist (pente), curvature (papillon)
- [ ] Chaque composante est illustrée par un schéma de courbe montrant le mouvement correspondant
- [ ] L'impact en bps est calculé via la formule : -Duration × ΔYield pour le shift, et via les key rate durations pour twist/curvature
- [ ] La sensibilité du portefeuille vs benchmark aux key rates est affichée
- [ ] Les positions actives de duration (sur/sous-pondération par maturité) sont mises en évidence

---

## C — Courbe des taux

### US-486 : Visualisation interactive de la courbe des taux `P0`

**Description** : En tant qu'analyste crédit, je veux visualiser la courbe des taux (government) avec les mouvements sur la période, afin de contextualiser les effets treasury.

**Critères d'acceptation** :
- [ ] La courbe des taux est affichée avec les maturités en abscisse (3M à 30Y) et les rendements en ordonnée
- [ ] La courbe de début de période et de fin de période sont superposées
- [ ] La variation par maturité (ΔYield) est affichée en sous-graphique
- [ ] Le positionnement du portefeuille (key rate durations) est superposé sur la courbe
- [ ] L'utilisateur peut basculer entre courbe nominale, courbe réelle et courbe de spreads

---

### US-487 : Heatmap duration × rating `P0`

**Description** : En tant qu'analyste crédit, je veux visualiser une heatmap montrant le positionnement du portefeuille par bucket de duration et par rating, afin d'identifier les paris actifs vs le benchmark.

**Critères d'acceptation** :
- [ ] La heatmap a les buckets de duration en colonnes (0-1Y, 1-3Y, 3-5Y, 5-7Y, 7-10Y, 10Y+) et les ratings en lignes (AAA, AA, A, BBB, BB, B, CCC)
- [ ] Chaque cellule affiche le poids du portefeuille et la sur/sous-pondération vs benchmark
- [ ] La couleur de la cellule est proportionnelle à la contribution au rendement actif
- [ ] Le clic sur une cellule filtre le tableau des positions sur ce bucket
- [ ] Le total par ligne (rating) et par colonne (duration) est affiché

---

## D — Attribution par rating et secteur

### US-488 : Attribution par tranche de rating `P0`

**Description** : En tant qu'analyste crédit, je veux la décomposition du rendement par rating (AAA à CCC), afin de comprendre quelles tranches de qualité de crédit ont contribué positivement ou négativement.

**Critères d'acceptation** :
- [ ] Un stacked bar chart affiche la contribution de chaque tranche de rating au rendement total
- [ ] Un tableau détaille par rating : poids portefeuille, poids benchmark, rendement portefeuille, rendement benchmark, allocation, sélection, total
- [ ] Les effets allocation et sélection sont colorés (vert positif, rouge négatif)
- [ ] Le tri par rating de AAA à CCC montre la progression du rendement et du risque
- [ ] Le clic sur un rating filtre les autres visualisations (cross-filtering)

---

### US-489 : Attribution sectorielle crédit `P1`

**Description** : En tant qu'analyste crédit, je veux l'attribution par secteur économique de l'émetteur (financières, industrielles, utilities, souverains), afin d'identifier les paris sectoriels.

**Critères d'acceptation** :
- [ ] Le tableau d'attribution affiche par secteur : poids, rendement, spread moyen, contribution
- [ ] Les effets allocation et sélection Brinson sont calculés par secteur
- [ ] Un treemap visualise les poids et contributions par secteur
- [ ] Les sous-secteurs sont accessibles en drill-down (ex : Financières → Banques, Assurances, Immobilier)
- [ ] Le clic sur un secteur filtre le tableau des positions

---

## E — Spread attribution

### US-490 : Décomposition du spread effect `P0`

**Description** : En tant qu'analyste crédit, je veux la décomposition de l'effet spread en composante sectorielle et composante spécifique (security-level), afin de comprendre si la valeur ajoutée vient du positionnement sectoriel ou de la sélection de titres.

**Critères d'acceptation** :
- [ ] Le spread effect total est décomposé en : spread carry (portage), spread sectoriel (mouvement OAS du secteur), spread spécifique (mouvement OAS idiosyncratique)
- [ ] Un waterfall secondaire visualise cette décomposition
- [ ] Le spread sectoriel est ventilé par secteur avec la contribution de chaque mouvement de spread
- [ ] Le spread spécifique identifie les titres ayant le plus contribué (top 5 / bottom 5)
- [ ] La formule est affichée : Contribution = -Spread Duration × ΔOAS

---

### US-491 : Duration Times Spread (DTS) — High Yield `P1`

**Description** : En tant qu'analyste crédit, je veux utiliser la métrique DTS (Duration × Spread) pour l'attribution des portefeuilles high yield, afin d'avoir une mesure de risque de spread proportionnelle.

**Critères d'acceptation** :
- [ ] Le DTS est calculé pour chaque position : Spread Duration × OAS (en bps)
- [ ] Un scatter plot positionne chaque titre (DTS en X, contribution au rendement en Y)
- [ ] La contribution DTS du portefeuille est comparée à celle du benchmark
- [ ] Le ratio DTS portefeuille / DTS benchmark est affiché comme indicateur de risque actif
- [ ] L'attribution DTS est ventilable par rating, secteur et émetteur

---

## F — Attribution multi-périodes et temporelle

### US-492 : Attribution multi-périodes `P1`

**Description** : En tant qu'analyste crédit, je veux visualiser l'évolution des composantes d'attribution mois par mois, afin d'identifier les tendances et les points d'inflexion.

**Critères d'acceptation** :
- [ ] Un stacked bar chart affiche les contributions mensuelles : income, treasury, spread, devises, résiduel
- [ ] Une courbe de rendement cumulé total est superposée
- [ ] Le survol d'un mois affiche le détail des composantes
- [ ] Les périodes de stress (écartement de spreads, hausse de taux) sont visuellement identifiables
- [ ] Le basculement entre vue mensuelle, trimestrielle et annuelle est possible

---

### US-493 : Évolution des spreads dans le temps `P1`

**Description** : En tant qu'analyste crédit, je veux suivre l'évolution de l'OAS moyen du portefeuille vs le benchmark dans le temps, afin de comprendre les mouvements de spread.

**Critères d'acceptation** :
- [ ] Un graphique affiche l'OAS moyen du portefeuille et du benchmark en courbes superposées
- [ ] L'écart de spread (portefeuille - benchmark) est affiché en zone colorée
- [ ] Les événements de crédit significatifs sont annotables (downgrades, defaults, élargissements)
- [ ] La ventilation par rating (OAS AAA, OAS BBB, OAS HY) est disponible
- [ ] Le graphique est synchronisé avec l'attribution multi-périodes

---

## G — Positions et détail

### US-494 : Tableau des positions obligataires `P0`

**Description** : En tant qu'analyste crédit, je veux un tableau détaillé de toutes les positions du portefeuille avec les métriques obligataires, afin d'analyser le portefeuille titre par titre.

**Critères d'acceptation** :
- [ ] Le tableau affiche par position : émetteur, ISIN, coupon, maturité, rating, OAS, duration, DTS, poids, contribution au rendement
- [ ] Les colonnes sont triables et filtrables
- [ ] Les titres hors benchmark (actif pur) sont identifiés visuellement
- [ ] Le clic sur un titre ouvre un panneau de détail avec historique de spread et événements
- [ ] Le tableau supporte la recherche par émetteur ou ISIN

---

### US-495 : Top / Bottom contributeurs `P1`

**Description** : En tant qu'analyste crédit, je veux voir les titres ayant le plus contribué positivement et négativement à la performance, afin d'évaluer la qualité de la sélection de titres.

**Critères d'acceptation** :
- [ ] Un bar chart horizontal affiche le top 10 contributeurs et le bottom 10
- [ ] Chaque barre affiche le nom de l'émetteur, le rating, l'OAS et la contribution en bps
- [ ] Les contributeurs sont colorés par secteur
- [ ] Le hover affiche le détail du titre (coupon, maturité, événement de crédit éventuel)
- [ ] La liste est filtrable par rating, secteur ou bucket de duration

---

## H — Comparaison et devises

### US-496 : Comparaison IG vs HY `P2`

**Description** : En tant qu'analyste crédit, je veux comparer côte à côte l'attribution de la poche Investment Grade et de la poche High Yield d'un portefeuille multi-crédit, afin de comprendre les sources de rendement par segment de qualité.

**Critères d'acceptation** :
- [ ] Deux waterfalls Campisi sont affichés côte à côte (IG à gauche, HY à droite)
- [ ] Les KPI clés sont comparés en tableau (duration, OAS, DTS, rendement, spread duration)
- [ ] L'attribution IG utilise le modèle classique, l'attribution HY utilise le modèle DTS
- [ ] La contribution de chaque segment au rendement total du portefeuille est affichée
- [ ] Le poids IG vs HY est visualisé et son évolution dans le temps disponible

---

### US-497 : Effet devises `P2`

**Description** : En tant qu'analyste crédit, je veux isoler l'effet devises dans l'attribution, afin de comprendre l'impact des mouvements de change sur le portefeuille multi-devises.

**Critères d'acceptation** :
- [ ] L'effet devises total est décomposé par devise (USD, EUR, GBP, JPY, etc.)
- [ ] Pour chaque devise : poids, mouvement de change, contribution, couverture (hedgé ou non)
- [ ] Un graphique montre l'évolution des taux de change sur la période
- [ ] Le coût du hedging est isolé et quantifié
- [ ] La comparaison portefeuille hedgé vs non hedgé est disponible

---

## I — Interactions et export

### US-498 : Cross-filtering entre visualisations `P0`

**Description** : En tant qu'analyste crédit, je veux que les visualisations soient interconnectées, afin de naviguer fluidement dans l'analyse.

**Critères d'acceptation** :
- [ ] Le clic sur un rating dans la heatmap filtre le waterfall, le tableau de positions et l'attribution sectorielle
- [ ] Le clic sur un secteur dans le treemap filtre la heatmap et le tableau de positions
- [ ] Le clic sur une période dans le graphique temporel met à jour le waterfall et les KPI
- [ ] Un bouton "Reset filtres" revient à la vue complète
- [ ] Les filtres actifs sont affichés sous forme de chips supprimables

---

### US-499 : Export du rapport d'attribution `P1`

**Description** : En tant qu'analyste crédit, je veux exporter l'analyse d'attribution complète, afin de la partager avec mon équipe ou mes clients.

**Critères d'acceptation** :
- [ ] L'export PDF génère un rapport structuré avec : synthèse, waterfall Campisi, courbe des taux, heatmap, attribution par rating/secteur, top/bottom contributeurs
- [ ] L'export Excel contient les données brutes dans des onglets organisés
- [ ] Les graphiques sont inclus en haute résolution dans le PDF
- [ ] La date, la période et le portefeuille sont en en-tête
- [ ] Le rapport respecte le branding Decider

---

### US-500 : Narration automatique `P2`

**Description** : En tant qu'analyste crédit, je veux que l'assistant génère un commentaire narratif de l'attribution, afin d'accélérer la rédaction de mes reporting clients.

**Critères d'acceptation** :
- [ ] Le commentaire couvre : principal moteur de performance, positionnement duration, mouvements de spreads, sélection de titres notable, comparaison vs benchmark
- [ ] Le ton est professionnel et factuel
- [ ] Les chiffres clés sont intégrés dans le texte avec formatage approprié
- [ ] Le commentaire est éditable avant export
- [ ] La langue est configurable (français, anglais)
