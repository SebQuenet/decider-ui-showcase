# 41 — Performance des fonds

Analyse comparative de la performance de fonds d'investissement : évolution temporelle des métriques (IRR, TVPI, DPI, RVPI), scatter plots risque/rendement, analyse par millésime (vintage), benchmarking par quartile et PME Kaplan-Schoar.

**Plateformes de référence** : Burgiss, Cambridge Associates, Preqin, Bison (CEPRES), Cobalt (Allvue)

**Axe stratégique** : Métier/Analytique

> **Complète** : 40 (Cycle de vie) — ce fichier se concentre sur la dimension comparative et benchmarking : comment les fonds performent les uns par rapport aux autres et par rapport au marché, plutôt que sur le cycle de vie individuel d'un fonds.

---

## A — Évolution temporelle

### US-550 : Multi-line chart d'évolution des métriques `P0`

**Description** : En tant qu'analyste de fonds, je veux visualiser l'évolution du TVPI (ou autre métrique) de tous les fonds dans le temps sur un même graphique, afin de comparer leurs trajectoires de performance.

**Critères d'acceptation** :
- [ ] Un multi-line chart affiche l'évolution de la métrique sélectionnée pour tous les fonds
- [ ] Chaque ligne est colorée par stratégie
- [ ] Le hover affiche un tooltip avec le nom du fonds, la date et la valeur
- [ ] Le clic sur une ligne met le fonds en surbrillance (les autres passent en semi-transparent)
- [ ] Un sélecteur de métrique permet de choisir : TVPI, DPI, RVPI, IRR

---

### US-551 : Tableau ranking avec sparklines `P0`

**Description** : En tant qu'analyste de fonds, je veux un tableau classant les fonds par performance avec des sparklines inline, afin d'avoir une vue synthétique.

**Critères d'acceptation** :
- [ ] Le tableau affiche par fonds : nom, stratégie, vintage, valeur actuelle de la métrique, sparkline de l'évolution
- [ ] Le tableau est trié par métrique décroissante
- [ ] Les sparklines sont des mini-graphiques inline montrant la tendance
- [ ] Un sélecteur de stratégie permet de filtrer

---

## B — Scatter (risque/rendement)

### US-552 : Scatter plot TVPI vs IRR `P0`

**Description** : En tant qu'analyste de fonds, je veux un scatter plot positionnant chaque fonds selon son TVPI et son IRR, afin de visualiser le profil risque/rendement du portefeuille.

**Critères d'acceptation** :
- [ ] Le scatter plot affiche chaque fonds : axe X = TVPI, axe Y = IRR net
- [ ] La taille des bulles est proportionnelle à l'engagement (committed)
- [ ] La couleur des bulles représente la stratégie
- [ ] Le hover affiche un tooltip avec le détail du fonds
- [ ] Des lignes de référence à TVPI = 1.0x et IRR = 0% délimitent les quadrants de performance

---

### US-553 : Filtres scatter par stratégie et vintage `P1`

**Description** : En tant qu'analyste de fonds, je veux filtrer le scatter plot par stratégie et vintage, afin de comparer des fonds comparables.

**Critères d'acceptation** :
- [ ] Des toggles par stratégie permettent de masquer/afficher les fonds d'une stratégie
- [ ] Un filtre de vintage (range slider ou multi-select) restreint les fonds affichés
- [ ] Le nombre de fonds affichés est indiqué
- [ ] Les axes se recalculent pour s'adapter aux données filtrées

---

## C — Analyse par millésime (vintage)

### US-554 : Grouped bar chart par vintage `P0`

**Description** : En tant qu'analyste de fonds, je veux comparer la performance des fonds par année de millésime, afin d'identifier les bons et mauvais millésimes.

**Critères d'acceptation** :
- [ ] Un grouped bar chart affiche la performance (TVPI ou IRR) par vintage year
- [ ] Chaque groupe = un vintage, barres = fonds individuels colorés par stratégie
- [ ] Une ligne horizontale matérialise la médiane du benchmark par vintage
- [ ] Le hover affiche le détail du fonds
- [ ] Un sélecteur de métrique permet de basculer entre TVPI et IRR

---

### US-555 : J-curves superposées par vintage `P1`

**Description** : En tant qu'analyste de fonds, je veux superposer les J-curves des fonds d'un même millésime, afin de comparer leurs trajectoires.

**Critères d'acceptation** :
- [ ] Un sélecteur de vintage permet de choisir l'année
- [ ] Toutes les J-curves des fonds du millésime sont superposées sur un même graphique
- [ ] Chaque courbe est colorée par stratégie avec légende
- [ ] La médiane est affichée en trait épais

---

## D — Benchmark et quartiles

### US-556 : Tableau de benchmarking par quartile `P0`

**Description** : En tant qu'analyste de fonds, je veux voir chaque fonds positionné dans son quartile de benchmark, afin d'évaluer la performance relative.

**Critères d'acceptation** :
- [ ] Le tableau affiche par fonds : nom, IRR net, TVPI, quartile (Q1/Q2/Q3/Q4), surperformance vs médiane
- [ ] Le code couleur indique le quartile : Q1 vert, Q2 bleu, Q3 orange, Q4 rouge
- [ ] Les colonnes sont triables
- [ ] Le quartile est calculé par rapport au benchmark du même vintage et de la même stratégie
- [ ] La distribution des quartiles du portefeuille est résumée en haut

---

### US-557 : PME chart (Public Market Equivalent) `P0`

**Description** : En tant qu'analyste de fonds, je veux visualiser le PME Kaplan-Schoar de chaque fonds, afin de comparer la performance du private equity au marché public.

**Critères d'acceptation** :
- [ ] Un bar chart horizontal affiche le PME par fonds
- [ ] Une ligne de référence à 1.0 indique la performance identique au marché public
- [ ] Les barres sont colorées : vert si PME > 1.0, rouge si PME < 1.0
- [ ] Le hover affiche le détail : PME, indice de référence utilisé, surperformance
- [ ] Les fonds sont triés par PME décroissant

---

## E — Interactions

### US-558 : Navigation entre onglets Performance `P0`

**Description** : En tant qu'analyste de fonds, je veux naviguer entre les onglets Évolution, Scatter, Vintage et Benchmark avec des transitions fluides.

**Critères d'acceptation** :
- [ ] Les 4 onglets sont accessibles via un tab bar
- [ ] Le changement d'onglet est animé avec Framer Motion
- [ ] L'état des filtres est préservé lors du changement d'onglet
- [ ] Le layout est responsive
