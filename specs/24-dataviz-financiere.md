# 24 — Dataviz financière

Graphiques financiers spécialisés et sous-système de visualisation de données Decider, conçus pour l'analyse de fonds d'investissement.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Morningstar Direct, Refinitiv Workspace, Preqin

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-171 (Visualisation de données) et US-172 (Tableau de données interactif) — US-171/172 gèrent les graphiques et tableaux génériques ; ce fichier ajoute les graphiques financiers spécialisés (NAV, drawdown, courbe en J, répartition sectorielle) et le theming Decider.

---

### US-309 : Courbe de rendement d'un fonds `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant génère une courbe de rendement à partir des données de la data room, afin de visualiser la performance historique d'un fonds.

**Critères d'acceptation** :
- [ ] L'assistant génère un graphique en courbe montrant les rendements périodiques (mensuel, trimestriel, annuel)
- [ ] L'axe des abscisses affiche les dates et l'axe des ordonnées les rendements en pourcentage
- [ ] Les données sources sont extraites automatiquement de la data room
- [ ] La période est configurable par l'utilisateur
- [ ] Le graphique est interactif (hover pour les valeurs précises)

---

### US-310 : Graphique comparatif multi-fonds `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir visualiser les rendements de plusieurs fonds sur un même graphique, afin de comparer visuellement leurs performances.

**Critères d'acceptation** :
- [ ] Plusieurs courbes de rendement sont superposées sur un même graphique
- [ ] Chaque fonds est identifié par une couleur distincte avec légende
- [ ] La période de comparaison est alignée entre les fonds
- [ ] L'utilisateur peut ajouter ou retirer des fonds du graphique
- [ ] Les données sources sont citées pour chaque fonds

---

### US-311 : Graphique de drawdown `P1`

**Description** : En tant qu'analyste financier, je veux visualiser le drawdown historique d'un fonds, afin d'évaluer la profondeur et la durée des baisses de performance.

**Critères d'acceptation** :
- [ ] Le graphique affiche le drawdown en pourcentage depuis le pic précédent
- [ ] Le drawdown maximum est mis en évidence avec sa date et sa durée de récupération
- [ ] Plusieurs fonds peuvent être superposés pour comparaison
- [ ] L'axe temporel est synchronisé avec les autres graphiques de la même analyse
- [ ] Les données sont sourcées

---

### US-312 : Courbe NAV historique `P0`

**Description** : En tant qu'analyste financier, je veux visualiser l'évolution de la valeur liquidative (NAV) d'un fonds dans le temps, afin de suivre sa trajectoire de valorisation.

**Critères d'acceptation** :
- [ ] La NAV est affichée en valeur absolue avec l'axe temporel en abscisses
- [ ] Les dates de valorisation sont marquées sur la courbe
- [ ] Les événements significatifs (appels, distributions) peuvent être annotés sur le graphique
- [ ] La base 100 est disponible en option pour faciliter la comparaison
- [ ] Le graphique supporte le zoom et le pan pour explorer les détails

---

### US-313 : Courbe en J (private equity) `P1`

**Description** : En tant qu'analyste financier, je veux visualiser la courbe en J d'un fonds de private equity (cash flows cumulés dans le temps), afin d'évaluer son cycle de vie et son point d'inflexion.

**Critères d'acceptation** :
- [ ] Le graphique affiche les cash flows cumulés (appels négatifs, distributions positives) dans le temps
- [ ] Le point d'inflexion (breakeven) est identifié visuellement
- [ ] Les appels et distributions sont distingués par couleur
- [ ] Le multiple (TVPI) courant est affiché sur le graphique
- [ ] Plusieurs fonds peuvent être superposés pour comparaison de maturité

---

### US-314 : Répartition sectorielle `P1`

**Description** : En tant qu'analyste financier, je veux visualiser la répartition sectorielle d'un portefeuille de fonds, afin d'évaluer sa diversification et sa concentration.

**Critères d'acceptation** :
- [ ] La répartition est affichée en camembert ou treemap selon le nombre de secteurs
- [ ] Chaque secteur affiche son poids en pourcentage et en valeur absolue
- [ ] Les données sont extraites automatiquement des documents du fonds
- [ ] L'utilisateur peut basculer entre vue pourcentage et vue valeur
- [ ] Les secteurs sont cliquables pour afficher le détail des positions

---

### US-315 : Répartition géographique `P1`

**Description** : En tant qu'analyste financier, je veux visualiser la répartition géographique des investissements d'un fonds, afin d'évaluer son exposition régionale.

**Critères d'acceptation** :
- [ ] La répartition est affichée sur une carte ou un graphique en barres par région
- [ ] Chaque zone géographique affiche son poids en pourcentage
- [ ] Les données sont extraites automatiquement de la data room
- [ ] Le niveau de détail est configurable (continent, pays, région)
- [ ] La répartition de plusieurs fonds peut être comparée côte à côte

---

### US-316 : Graphique de flux de trésorerie `P1`

**Description** : En tant qu'analyste financier, je veux visualiser les flux de trésorerie d'un fonds (appels de capitaux et distributions) dans le temps, afin de comprendre le rythme de déploiement et de retour.

**Critères d'acceptation** :
- [ ] Les appels sont affichés en négatif et les distributions en positif sur un graphique en barres
- [ ] Le cumul net est superposé en courbe
- [ ] Chaque flux est daté et sourcé
- [ ] Le ratio DPI courant est affiché
- [ ] Le graphique supporte les vues mensuelle, trimestrielle et annuelle

---

### US-317 : Graphique de dispersion rendement/risque `P2`

**Description** : En tant qu'analyste financier, je veux visualiser un scatter plot rendement/risque pour plusieurs fonds, afin de positionner chaque fonds sur le spectre risque-rendement.

**Critères d'acceptation** :
- [ ] Chaque fonds est un point sur le graphique avec le rendement en ordonnée et le risque en abscisse
- [ ] Les fonds sont identifiés par leur nom au survol
- [ ] La frontière efficiente peut être tracée si suffisamment de données sont disponibles
- [ ] Les quadrants (haut rendement/faible risque, etc.) sont identifiés
- [ ] L'utilisateur peut choisir les métriques pour chaque axe

---

### US-318 : Tooltips enrichis sur les graphiques `P0`

**Description** : En tant qu'analyste financier, je veux que les graphiques financiers affichent des tooltips détaillés au survol, afin d'accéder aux valeurs précises et au contexte sans quitter la visualisation.

**Critères d'acceptation** :
- [ ] Le tooltip affiche la valeur exacte, la date et le nom du fonds
- [ ] Les valeurs sont formatées selon les conventions financières (%, devise, décimales)
- [ ] Le tooltip affiche la source du données (document, page)
- [ ] Les tooltips restent lisibles même avec plusieurs courbes superposées
- [ ] Le tooltip est accessible au clavier pour les utilisateurs naviguant sans souris

---

### US-319 : Annotation manuelle sur les graphiques `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir ajouter des annotations textuelles sur un graphique, afin de commenter les points saillants pour une présentation ou un rapport.

**Critères d'acceptation** :
- [ ] Un mode annotation permet d'ajouter du texte à un point précis du graphique
- [ ] Les annotations sont sauvegardées avec le graphique
- [ ] Les annotations sont visibles à l'export (PDF, PNG)
- [ ] L'utilisateur peut modifier ou supprimer ses annotations
- [ ] Les annotations peuvent inclure des flèches pointant vers un élément du graphique

---

### US-320 : Export des graphiques `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir exporter les graphiques générés en haute résolution, afin de les intégrer dans des présentations ou des rapports.

**Critères d'acceptation** :
- [ ] L'export est disponible en PNG et SVG
- [ ] La résolution de l'export est suffisante pour l'impression (300 DPI)
- [ ] Le graphique exporté inclut le titre, la légende et les sources
- [ ] Les couleurs et la mise en forme sont fidèles à l'affichage écran
- [ ] L'export est accessible en un clic depuis chaque graphique

---

### US-321 : Theming Decider pour les graphiques `P0`

**Description** : En tant qu'analyste financier, je veux que tous les graphiques respectent le système visuel Decider (palette chromatique, typographie, style), afin d'obtenir des visuels professionnels et cohérents.

**Critères d'acceptation** :
- [ ] Les graphiques utilisent la palette Decider (gris laboratoire, noir carbone, bleu glacier, pêche/abricot)
- [ ] La typographie Neo-Grotesk est utilisée pour les légendes, axes et annotations
- [ ] Le style est sobre et professionnel, conforme à la philosophie « No Design »
- [ ] Les graphiques sont visuellement cohérents entre eux et avec le reste de l'interface
- [ ] Le thème est appliqué automatiquement sans configuration utilisateur

---

### US-322 : Tableau de bord de performance `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir afficher un tableau de bord regroupant les graphiques clés d'un fonds (NAV, rendement, drawdown, répartition), afin d'avoir une vue consolidée de sa performance.

**Critères d'acceptation** :
- [ ] Le tableau de bord affiche 4 à 6 graphiques clés sur une même vue
- [ ] Les graphiques sont mis à jour automatiquement quand de nouveaux documents sont importés
- [ ] La disposition est responsive et s'adapte à la taille de l'écran
- [ ] L'utilisateur peut personnaliser les graphiques affichés
- [ ] Le tableau de bord est accessible depuis la fiche projet du fonds

---

### US-323 : Graphique en cascade (waterfall) `P2`

**Description** : En tant qu'analyste financier, je veux visualiser un graphique en cascade montrant la décomposition de la performance (contribution de chaque investissement ou facteur), afin de comprendre les moteurs de rendement.

**Critères d'acceptation** :
- [ ] Le graphique affiche les contributions positives et négatives empilées
- [ ] Le point de départ et le point d'arrivée sont clairement identifiés
- [ ] Chaque barre affiche sa valeur au survol
- [ ] Les contributions sont triées par importance décroissante
- [ ] Le graphique est exportable

---

### US-324 : Graphique de corrélation entre fonds `P2`

**Description** : En tant qu'analyste financier, je veux visualiser une matrice de corrélation entre les rendements de plusieurs fonds, afin d'évaluer la diversification d'un portefeuille.

**Critères d'acceptation** :
- [ ] La matrice affiche les coefficients de corrélation entre chaque paire de fonds
- [ ] Un code couleur indique la force de la corrélation (rouge = forte, bleu = faible)
- [ ] Les corrélations sont calculées sur une période configurable
- [ ] La matrice est interactive (clic pour le détail d'une paire)
- [ ] Les données sources et la période sont indiquées
