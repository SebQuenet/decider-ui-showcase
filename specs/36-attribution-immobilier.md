# 36 — Attribution de performance immobilière

Décomposition et analyse de la performance de fonds immobiliers : attribution par facteur, analyse du levier, profil de dette, métriques immobilières spécialisées et visualisations interactives.

**Plateformes de référence** : Decider.ai, MSCI Real Estate (ex-IPD), Deepki, eFront Insight, Preqin, CBRE Investment Management, Hodes Weill

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-309 (Courbe de rendement), US-314 (Répartition sectorielle), US-323 (Waterfall) — ce fichier ajoute les mécanismes d'attribution propres à l'immobilier (décomposition rendement locatif / plus-value / levier / devises, analyse crédit, métriques immo) et les interactions de drill-down associées.

---

## A — Vue d'ensemble et dashboard d'attribution

### US-451 : Dashboard d'attribution immobilière `P0`

**Description** : En tant qu'analyste immobilier, je veux accéder à un dashboard consolidé présentant la décomposition de performance d'un fonds immobilier, afin d'avoir une vue synthétique des moteurs de rendement en un coup d'œil.

**Critères d'acceptation** :
- [ ] Le dashboard affiche le rendement total du fonds avec décomposition en 4 grandes composantes : rendement locatif (income return), plus-value (capital growth), effet levier, effet devises/frais
- [ ] Un waterfall chart principal résume visuellement la contribution de chaque composante
- [ ] Les KPI clés sont affichés en cartes : TRI brut, TRI net, multiple (TVPI), cash yield, LTV moyen
- [ ] Le dashboard est interactif : clic sur une composante pour drill-down dans la section correspondante
- [ ] La période d'analyse est configurable (1Y, 3Y, 5Y, depuis inception)

---

### US-452 : Sélection du fonds et période d'analyse `P0`

**Description** : En tant qu'analyste immobilier, je veux pouvoir sélectionner un fonds immobilier et une période d'analyse, afin de contextualiser toutes les visualisations d'attribution.

**Critères d'acceptation** :
- [ ] Un sélecteur de fonds affiche les fonds disponibles avec leur type (core, value-add, opportunistic)
- [ ] La période est configurable par presets (1Y, 3Y, 5Y, YTD, inception) ou dates personnalisées
- [ ] Le changement de fonds ou de période met à jour toutes les visualisations simultanément
- [ ] Les métadonnées du fonds sélectionné sont affichées (stratégie, AUM, millésime, géographie)
- [ ] Un mode comparaison permet de sélectionner un benchmark (indice IPD, peer group)

---

## B — Waterfall d'attribution

### US-453 : Waterfall de décomposition du rendement total `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser un graphique en cascade (waterfall) décomposant le rendement total du fonds étape par étape, afin de comprendre la contribution de chaque facteur.

**Critères d'acceptation** :
- [ ] Le waterfall affiche la chaîne complète : rendement locatif brut → charges → rendement locatif net → plus-value réalisée → plus-value latente → effet levier → frais de gestion → devises → rendement net investisseur
- [ ] Les contributions positives sont en vert/glacier, les négatives en rouge/peach
- [ ] Chaque barre affiche sa valeur en % et en valeur absolue au survol (tooltip enrichi)
- [ ] Les barres sont triées selon la chaîne logique (pas par magnitude)
- [ ] Le point de départ (0%) et le point d'arrivée (rendement net) sont clairement identifiés avec des barres totales

---

### US-454 : Waterfall drill-down par niveau `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir cliquer sur une barre du waterfall pour la décomposer en sous-facteurs, afin d'approfondir l'analyse d'un facteur spécifique.

**Critères d'acceptation** :
- [ ] Le clic sur "Rendement locatif net" décompose en : loyers perçus, taux de vacance, charges non récupérées, travaux
- [ ] Le clic sur "Plus-value" décompose en : revalorisation par actif, effet marché, effet améliorations (capex)
- [ ] Le clic sur "Effet levier" décompose en : spread (rendement - coût dette), quantum (montant emprunté), coût de couverture
- [ ] Un fil d'Ariane permet de remonter au niveau supérieur
- [ ] L'animation de transition entre niveaux est fluide (les barres se subdivisent visuellement)

---

### US-455 : Waterfall comparatif fonds vs benchmark `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir afficher côte à côte le waterfall du fonds et celui de son benchmark, afin d'identifier les sources d'alpha et de sous-performance.

**Critères d'acceptation** :
- [ ] Deux waterfalls sont affichés en parallèle (fonds à gauche, benchmark à droite)
- [ ] Les écarts entre fonds et benchmark sont mis en évidence par des connecteurs colorés
- [ ] Un troisième waterfall optionnel affiche la différence (alpha) facteur par facteur
- [ ] Le benchmark est sélectionnable (indice IPD France, Europe, custom)
- [ ] Les facteurs où le fonds surperforme sont visuellement distingués de ceux où il sous-performe

---

## C — Attribution Brinson (allocation / sélection)

### US-456 : Tableau d'attribution Brinson par secteur `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser un tableau d'attribution de type Brinson décomposant la surperformance en effets d'allocation sectorielle et de sélection d'actifs, afin de comprendre si la valeur ajoutée vient du choix des secteurs ou du choix des immeubles.

**Critères d'acceptation** :
- [ ] Le tableau affiche par secteur (bureaux, logistique, résidentiel, commerce, santé, hôtellerie) : poids fonds, poids benchmark, rendement fonds, rendement benchmark
- [ ] Les trois effets Brinson sont calculés et affichés : effet allocation, effet sélection, effet interaction
- [ ] La ligne total affiche la surperformance totale décomposée
- [ ] Les cellules sont colorées selon la contribution (vert positif, rouge négatif, intensité proportionnelle)
- [ ] Le tableau est triable par n'importe quelle colonne

---

### US-457 : Attribution Brinson par géographie `P1`

**Description** : En tant qu'analyste immobilier, je veux la même décomposition Brinson par zone géographique, afin d'évaluer si la valeur ajoutée provient du choix des marchés.

**Critères d'acceptation** :
- [ ] Le tableau affiche les mêmes colonnes que l'US-456 mais ventilé par géographie (Île-de-France, régions, Europe du Nord, Sud, etc.)
- [ ] Un toggle permet de basculer entre la vue sectorielle et la vue géographique
- [ ] La combinaison secteur × géographie est disponible dans un tableau croisé (drill-down)
- [ ] Les zones géographiques sont cliquables pour afficher les actifs sous-jacents
- [ ] La contribution de chaque zone est visualisable sur une carte choroplèthe simplifiée

---

### US-458 : Graphique de contribution par actif `P1`

**Description** : En tant qu'analyste immobilier, je veux visualiser la contribution de chaque actif du portefeuille à la performance totale, afin d'identifier les meilleurs et les pires contributeurs.

**Critères d'acceptation** :
- [ ] Un bar chart horizontal affiche la contribution de chaque actif, trié par magnitude
- [ ] Les barres positives (contributeurs) et négatives (détracteurs) sont distinguées par couleur
- [ ] Le top 5 contributeurs et top 5 détracteurs sont mis en évidence
- [ ] Au survol d'un actif : nom, adresse, secteur, rendement, poids dans le portefeuille
- [ ] Un treemap alternatif permet de visualiser les contributions par taille de case proportionnelle au poids

---

## D — Analyse de l'effet de levier

### US-459 : Décomposition de l'effet de levier `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser la décomposition de l'effet de levier financier sur le rendement du fonds, afin de comprendre comment l'endettement amplifie ou réduit la performance.

**Critères d'acceptation** :
- [ ] Un graphique affiche côte à côte : rendement unlevered (sur actifs) vs rendement levered (sur fonds propres)
- [ ] La décomposition montre : spread positif (rendement actifs > coût dette) ou négatif
- [ ] Le quantum de levier (LTV) et son impact marginal sont visualisés
- [ ] Le coût de couverture de taux (si applicable) est identifié séparément
- [ ] Un slider interactif permet de simuler l'impact d'un LTV différent sur le rendement

---

### US-460 : Évolution du levier dans le temps `P1`

**Description** : En tant qu'analyste immobilier, je veux suivre l'évolution du ratio LTV et du coût de la dette dans le temps, afin de comprendre la trajectoire d'endettement du fonds.

**Critères d'acceptation** :
- [ ] Un graphique dual-axis affiche le LTV (barres, axe gauche) et le coût moyen de la dette (courbe, axe droit) par trimestre
- [ ] Les seuils réglementaires ou contractuels de LTV sont matérialisés par des lignes horizontales
- [ ] Les dépassements de seuil sont mis en évidence visuellement (zone rouge)
- [ ] Les événements de refinancement sont annotés sur le graphique
- [ ] Le spread (rendement actifs - coût dette) est affichable en troisième série

---

## E — Analyse crédit et profil de dette

### US-461 : Dashboard crédit du fonds `P0`

**Description** : En tant qu'analyste immobilier, je veux un dashboard synthétique du profil de dette du fonds, afin d'évaluer rapidement le risque financier lié à l'endettement.

**Critères d'acceptation** :
- [ ] Les KPI crédit sont affichés en cartes : LTV moyen, LTV max, ICR (interest coverage ratio), DSCR, coût moyen pondéré de la dette, maturité résiduelle moyenne
- [ ] Un code couleur (vert/orange/rouge) indique si chaque KPI est dans les normes du marché
- [ ] La notation implicite de crédit est estimée et affichée (investment grade / high yield)
- [ ] Le montant total de dette et la part à taux fixe vs variable sont affichés
- [ ] Les covenants financiers sont listés avec leur statut (respecté / en tension / en breach)

---

### US-462 : Mur de maturité de la dette `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser le profil d'échéances de la dette du fonds sous forme de bar chart, afin d'identifier les risques de refinancement.

**Critères d'acceptation** :
- [ ] Un bar chart vertical affiche le montant de dette arrivant à échéance par année sur les 10 prochaines années
- [ ] Les barres sont colorées par type de prêteur (banque, obligataire, mezzanine)
- [ ] Le montant total et le pourcentage de la dette totale sont affichés par barre au survol
- [ ] Les échéances des 12 prochains mois sont mises en évidence (zone d'urgence)
- [ ] Le taux de la dette refinançable est comparé aux taux actuels du marché

---

### US-463 : Répartition de la dette par type et prêteur `P1`

**Description** : En tant qu'analyste immobilier, je veux visualiser la structure de la dette du fonds par type d'instrument et par prêteur, afin d'évaluer la diversification des sources de financement.

**Critères d'acceptation** :
- [ ] Un donut chart affiche la répartition par type : senior secured, mezzanine, obligataire, revolving
- [ ] Un second donut ou tableau affiche la répartition par prêteur avec les montants
- [ ] La concentration par prêteur est calculée (index HHI, poids du top 3)
- [ ] Les conditions clés par ligne de crédit sont affichées au survol (taux, maturité, covenants)
- [ ] Le détail est exportable en tableau

---

### US-464 : Sensibilité aux taux d'intérêt `P1`

**Description** : En tant qu'analyste immobilier, je veux visualiser la sensibilité du fonds aux variations de taux d'intérêt, afin d'évaluer l'impact d'un changement de politique monétaire.

**Critères d'acceptation** :
- [ ] Un graphique affiche l'impact sur le rendement net d'une variation de taux de -200bp à +200bp par pas de 50bp
- [ ] La part de dette à taux variable vs taux fixe est affichée avec les dates d'expiration des couvertures
- [ ] Les instruments de couverture (swaps, caps) sont détaillés avec leur notionnel et échéance
- [ ] Un tableau de sensibilité matriciel (variation taux × LTV) montre l'impact croisé
- [ ] Le scénario central et les scénarios de stress sont identifiés

---

## F — Attribution multi-périodes

### US-465 : Évolution de l'attribution dans le temps `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser l'évolution des composantes d'attribution trimestre par trimestre, afin d'identifier les tendances et les points d'inflexion.

**Critères d'acceptation** :
- [ ] Un stacked area chart affiche la contribution de chaque facteur (income, capital growth, levier, devises, frais) par trimestre
- [ ] L'utilisateur peut basculer entre vue empilée (contributions) et vue en courbes séparées
- [ ] La courbe de rendement total est superposée pour référence
- [ ] Le survol d'un trimestre affiche le détail de chaque composante
- [ ] Les périodes remarquables (COVID, crise taux 2022, reprise) sont annotables

---

### US-466 : Rolling attribution (fenêtre glissante) `P2`

**Description** : En tant qu'analyste immobilier, je veux visualiser l'attribution sur une fenêtre glissante (ex : rolling 4 trimestres), afin de lisser les effets ponctuels et voir les tendances structurelles.

**Critères d'acceptation** :
- [ ] La fenêtre glissante est configurable (4, 8, 12 trimestres)
- [ ] Les composantes d'attribution rolling sont affichées en stacked bar ou area chart
- [ ] La transition d'un trimestre au suivant est animée pour montrer le glissement
- [ ] Le rendement rolling total est superposé en courbe
- [ ] La comparaison rolling fonds vs benchmark est disponible

---

## G — Métriques immobilières

### US-467 : Tableau des métriques par actif `P0`

**Description** : En tant qu'analyste immobilier, je veux un tableau détaillé des métriques immobilières par actif du portefeuille, afin de comparer les performances opérationnelles de chaque immeuble.

**Critères d'acceptation** :
- [ ] Le tableau affiche par actif : nom, adresse, secteur, surface, valeur, poids, cap rate, NOI, taux d'occupation, rendement locatif, plus-value
- [ ] Les colonnes sont triables et filtrables
- [ ] Les métriques hors norme sont mises en évidence (code couleur par rapport à la médiane du portefeuille)
- [ ] Le clic sur un actif ouvre une fiche détaillée avec historique
- [ ] Le tableau supporte la recherche et les filtres multiples (secteur, géographie, taille)

---

### US-468 : Taux d'occupation et vacance `P1`

**Description** : En tant qu'analyste immobilier, je veux visualiser l'évolution du taux d'occupation global et par actif, afin de suivre la santé locative du portefeuille.

**Critères d'acceptation** :
- [ ] Un graphique affiche le taux d'occupation global en courbe avec objectif matérialisé
- [ ] Un heatmap par actif × trimestre montre l'évolution individuelle
- [ ] Les actifs en dessous du seuil cible sont identifiés avec un code couleur
- [ ] La distinction entre vacance structurelle et vacance de rotation est faite quand les données le permettent
- [ ] Le revenu locatif potentiel perdu par la vacance est chiffré

---

### US-469 : Analyse des loyers (rent roll) `P1`

**Description** : En tant qu'analyste immobilier, je veux visualiser le profil des baux du portefeuille (durée résiduelle, loyers, échéances), afin d'évaluer la visibilité des revenus locatifs.

**Critères d'acceptation** :
- [ ] Un bar chart affiche le montant des loyers arrivant à échéance par année (mur des baux)
- [ ] La durée résiduelle moyenne pondérée (WAULT) est affichée en KPI
- [ ] La répartition des baux par durée résiduelle est visualisée (pie chart ou histogram)
- [ ] Les 10 premiers locataires sont listés avec leur poids dans le revenu total
- [ ] La concentration locataire est calculée (HHI, top 5)

---

### US-470 : Cap rates et valorisation `P1`

**Description** : En tant qu'analyste immobilier, je veux suivre l'évolution des taux de capitalisation (cap rates) du portefeuille et les comparer au marché, afin d'évaluer si les actifs sont correctement valorisés.

**Critères d'acceptation** :
- [ ] Un graphique affiche l'évolution du cap rate moyen du portefeuille vs le cap rate marché par secteur
- [ ] La décomposition de la variation de valeur (compression/expansion du cap rate vs croissance du NOI) est visualisée
- [ ] Un scatter plot positionne chaque actif (cap rate en X, rendement locatif en Y)
- [ ] Les actifs dont le cap rate s'écarte significativement du marché sont identifiés
- [ ] Le rendement en prime de risque vs taux sans risque est affiché

---

### US-471 : Répartition par typologie d'actifs `P0`

**Description** : En tant qu'analyste immobilier, je veux visualiser la répartition du portefeuille par type d'actif immobilier avec les métriques associées, afin d'évaluer la diversification et l'exposition sectorielle.

**Critères d'acceptation** :
- [ ] Un treemap ou donut chart affiche la répartition par secteur : bureaux, logistique, résidentiel, commerce, santé, hôtellerie, mixed-use
- [ ] Chaque secteur affiche son poids (% valeur), rendement, et tendance de marché
- [ ] Le clic sur un secteur filtre toutes les autres visualisations (cross-filtering)
- [ ] La répartition cible (allocation stratégique) est superposable pour comparaison
- [ ] L'évolution de la répartition dans le temps est disponible en vue historique

---

## H — Simulation et scénarios

### US-472 : Simulateur d'impact taux et LTV `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir simuler l'impact d'un changement de taux d'intérêt et/ou de LTV sur la performance du fonds, afin de stress-tester le portefeuille.

**Critères d'acceptation** :
- [ ] Des sliders permettent d'ajuster le taux directeur (+/- 300bp) et le LTV cible (30% à 70%)
- [ ] Le waterfall d'attribution est recalculé en temps réel avec les nouveaux paramètres
- [ ] L'impact sur le TRI net, le cash yield et l'ICR est affiché dynamiquement
- [ ] Un mode "scénario prédéfini" propose : hausse brutale (+200bp), normalisation (-100bp), récession
- [ ] Les résultats de simulation sont comparables côte à côte (scénario central vs stress)

---

### US-473 : Projection de rendement à horizon `P2`

**Description** : En tant qu'analyste immobilier, je veux pouvoir projeter le rendement du fonds à 3-5 ans selon des hypothèses de marché, afin d'évaluer le potentiel futur.

**Critères d'acceptation** :
- [ ] Les hypothèses sont paramétrables : croissance des loyers, évolution des cap rates, coût de refinancement, taux de vacance
- [ ] Trois scénarios sont proposés : optimiste, central, pessimiste
- [ ] Les projections sont affichées en courbe avec fan chart (intervalle de confiance)
- [ ] Le TRI projeté et le multiple attendu sont calculés pour chaque scénario
- [ ] Un disclaimer signale le caractère purement indicatif des projections

---

## I — Interactions et navigation

### US-474 : Cross-filtering entre visualisations `P0`

**Description** : En tant qu'analyste immobilier, je veux que les visualisations soient interconnectées (sélection dans l'une filtre les autres), afin de naviguer fluidement dans l'analyse.

**Critères d'acceptation** :
- [ ] Le clic sur un secteur dans le treemap filtre le waterfall, le tableau Brinson et le tableau d'actifs
- [ ] Le clic sur une période dans le graphique temporel met à jour le waterfall et les KPI
- [ ] Le clic sur un actif dans le tableau met en évidence sa contribution dans le waterfall
- [ ] Un bouton "Reset filtres" revient à la vue complète
- [ ] Les filtres actifs sont affichés sous forme de chips supprimables

---

### US-475 : Panneau de détail actif `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir ouvrir un panneau latéral avec le détail complet d'un actif, afin d'approfondir l'analyse sans quitter le dashboard.

**Critères d'acceptation** :
- [ ] Le panneau s'ouvre en slide-in depuis la droite au clic sur un actif
- [ ] Il affiche : photo/illustration, adresse, surface, valeur, cap rate, NOI, taux d'occupation, loyers, durée résiduelle, dernière valorisation
- [ ] L'historique de rendement de l'actif est affiché en mini-graphique
- [ ] Les événements clés (acquisition, capex, revalorisation, refinancement) sont listés chronologiquement
- [ ] Le panneau est fermable sans perdre l'état du dashboard

---

### US-476 : Export du rapport d'attribution `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir exporter l'analyse d'attribution complète en PDF ou Excel, afin de la partager avec mon comité d'investissement.

**Critères d'acceptation** :
- [ ] L'export PDF génère un rapport structuré avec : synthèse, waterfall, attribution Brinson, profil de dette, métriques par actif
- [ ] L'export Excel contient les données brutes dans des onglets organisés
- [ ] Les graphiques sont inclus en haute résolution dans le PDF
- [ ] La date d'extraction, la période d'analyse et le fonds sont indiqués en en-tête
- [ ] Le rapport respecte le branding Decider (palette, typographie)

---

### US-477 : Mode présentation `P2`

**Description** : En tant qu'analyste immobilier, je veux pouvoir afficher le dashboard en mode présentation (plein écran, navigation par sections), afin de le projeter en comité d'investissement.

**Critères d'acceptation** :
- [ ] Un bouton bascule en mode plein écran avec navigation par flèches entre sections
- [ ] Chaque section occupe un écran complet avec titre et graphiques agrandis
- [ ] L'ordre des sections est personnalisable par drag & drop
- [ ] Les animations de transition entre sections sont fluides
- [ ] Le mode présentation supporte le mode sombre pour projection

---

## J — Chat et intelligence

### US-478 : Interrogation en langage naturel `P1`

**Description** : En tant qu'analyste immobilier, je veux pouvoir poser des questions en langage naturel sur l'attribution du fonds et obtenir des réponses sourcées, afin d'explorer l'analyse de manière intuitive.

**Critères d'acceptation** :
- [ ] Un champ de chat est intégré au dashboard d'attribution
- [ ] L'assistant répond à des questions comme "Quel actif a le plus contribué à la performance ?" ou "Pourquoi le levier a-t-il été négatif au T3 ?"
- [ ] Les réponses citent les données du dashboard avec renvoi vers la visualisation correspondante
- [ ] L'assistant peut générer des graphiques à la volée en réponse aux questions
- [ ] Les suggestions de questions sont proposées en fonction du contexte (filtres actifs, anomalies détectées)

---

### US-479 : Détection d'anomalies et alertes `P2`

**Description** : En tant qu'analyste immobilier, je veux que le système détecte automatiquement les anomalies dans l'attribution (écarts inhabituels, tendances défavorables), afin d'attirer mon attention sur les points critiques.

**Critères d'acceptation** :
- [ ] Les anomalies sont signalées par des badges sur les visualisations concernées
- [ ] Les types d'anomalies couverts : chute brutale d'un facteur, breach de covenant, vacance anormale, écart vs benchmark > 2 sigma
- [ ] Un panneau latéral liste les anomalies triées par sévérité (critique, attention, info)
- [ ] Chaque anomalie est accompagnée d'une explication et d'une suggestion d'action
- [ ] Les anomalies sont horodatées et suivies (nouveau, vu, traité)

---

### US-480 : Narration automatique de l'attribution `P2`

**Description** : En tant qu'analyste immobilier, je veux que l'assistant génère automatiquement un paragraphe de commentaire narratif sur l'attribution, afin d'accélérer la rédaction de mes rapports.

**Critères d'acceptation** :
- [ ] Le commentaire couvre les faits saillants : principal moteur de performance, principal détracteur, évolution vs trimestre précédent, positionnement vs benchmark
- [ ] Le ton est professionnel et factuel, adapté à un comité d'investissement
- [ ] Les chiffres clés sont intégrés dans le texte avec formatage approprié
- [ ] Le commentaire est éditable par l'utilisateur avant export
- [ ] La langue est configurable (français, anglais)
