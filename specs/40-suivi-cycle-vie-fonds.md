# 40 — Suivi du cycle de vie des fonds

Suivi du cycle de vie complet de fonds d'investissement alternatifs (PE, immobilier, infrastructure, dette privée) : phases du fonds, timeline d'événements, cash flows (appels/distributions), J-curve, métriques clés (IRR, TVPI, DPI, RVPI).

**Plateformes de référence** : eFront (BlackRock), Burgiss, Preqin, Cobalt (Allvue), iLevel (Ipreo/S&P)

**Axe stratégique** : Métier/Fondamental

> **Complète** : 21 (Data Rooms), 28 (Alertes), 29 (Scoring) — ce fichier ajoute le suivi longitudinal du cycle de vie : progression des phases, cash flows historiques et prévisionnels, J-curve, timeline d'événements depuis le first close jusqu'à la liquidation.

---

## A — Liste et sélection des fonds

### US-540 : Liste des fonds avec barre de cycle de vie `P0`

**Description** : En tant qu'analyste de fonds, je veux voir la liste de tous les fonds avec leur progression dans le cycle de vie, afin d'identifier rapidement les fonds nécessitant mon attention.

**Critères d'acceptation** :
- [ ] Un panneau gauche affiche la liste des fonds en tableau compact scrollable avec colonnes : nom, stratégie, vintage, phase
- [ ] Chaque fonds affiche une barre de progression segmentée du cycle de vie (fundraising → investment period → harvest → extension → liquidation → terminated) avec marqueur de position actuelle
- [ ] Les phases sont colorées distinctement : fundraising (gris), investment period (bleu), harvest (vert), extension (orange), liquidation (rouge)
- [ ] Le clic sur un fonds charge son détail dans le panneau droit
- [ ] Le fonds sélectionné est mis en surbrillance

---

### US-541 : Filtres par phase, stratégie et vintage `P0`

**Description** : En tant qu'analyste de fonds, je veux filtrer les fonds par phase, stratégie et millésime, afin de me concentrer sur un sous-ensemble pertinent.

**Critères d'acceptation** :
- [ ] Des filtres multi-select sont disponibles pour : phase du cycle, stratégie, plage de vintage
- [ ] Les filtres sont applicables simultanément (intersection)
- [ ] Le nombre de fonds affichés est mis à jour dynamiquement
- [ ] Un bouton permet de réinitialiser tous les filtres
- [ ] Les filtres sont présentés sous forme de chips supprimables

---

## B — Timeline d'événements

### US-542 : Barre de progression des phases du fonds `P0`

**Description** : En tant qu'analyste de fonds, je veux visualiser la barre de progression segmentée des phases du fonds sélectionné, afin de situer sa position dans son cycle de vie.

**Critères d'acceptation** :
- [ ] La barre de progression affiche toutes les phases du fonds avec leurs dates (début/fin)
- [ ] Un marqueur "aujourd'hui" est positionné sur la barre
- [ ] Les KPIs du fonds sont affichés : committed, called, distributed, NAV, unfunded, IRR, TVPI, DPI
- [ ] Les dates clés sont annotées : first close, final close, fin de période d'investissement, terme attendu

---

### US-543 : Timeline verticale des événements `P0`

**Description** : En tant qu'analyste de fonds, je veux une timeline verticale de tous les événements du fonds (closings, capital calls, distributions, exits), afin de retracer l'historique complet.

**Critères d'acceptation** :
- [ ] La timeline affiche les événements chronologiquement : closings, capital calls, distributions, exits, changements de phase, key person events
- [ ] Chaque événement affiche : date, icône par type, label, montant éventuel, description
- [ ] Les événements passés sont en opacité pleine, les futurs estimés en pointillés
- [ ] La timeline est scrollable si le nombre d'événements dépasse l'espace visible
- [ ] Le type d'événement est filtrable

---

## C — Cash flows

### US-544 : Bar chart des cash flows trimestriels `P0`

**Description** : En tant qu'analyste de fonds, je veux visualiser l'historique des cash flows du fonds par trimestre, afin de comprendre le profil d'appels et de distributions.

**Critères d'acceptation** :
- [ ] Un bar chart empilé affiche les cash flows par trimestre : barres vers le bas = appels (rouge/orange), barres vers le haut = distributions (vert/bleu)
- [ ] Une ligne cumulative du cash flow net est superposée en overlay
- [ ] Le hover affiche un tooltip avec le détail du trimestre (montant, type)
- [ ] Les totaux sont affichés : total appelé, total distribué, cash flow net

---

### US-545 : Tableau détaillé des cash flows `P0`

**Description** : En tant qu'analyste de fonds, je veux un tableau détaillé de chaque flux de trésorerie, afin d'auditer les montants et les dates.

**Critères d'acceptation** :
- [ ] Le tableau affiche par flux : date, type (capital call, management fee, distribution, etc.), montant, description
- [ ] Les flux prévisionnels sont affichés en italique avec un badge "Estimé"
- [ ] Les colonnes sont triables
- [ ] Le type de flux est filtrable
- [ ] Les montants respectent la convention : négatif = appel (LP → fonds), positif = distribution (fonds → LP)

---

## D — J-Curve

### US-546 : Graphique de la J-curve `P0`

**Description** : En tant qu'analyste de fonds, je veux visualiser la J-curve du fonds (cash flow net cumulé dans le temps), afin d'évaluer le profil de retour sur investissement.

**Critères d'acceptation** :
- [ ] Un line chart affiche la J-curve : axe X = années depuis le vintage, axe Y = cash flow net cumulé (en M€)
- [ ] La zone sous zéro est colorée en rouge semi-transparent, la zone au-dessus en vert semi-transparent
- [ ] Le point d'inflexion (passage de négatif à positif) est annoté
- [ ] Les métriques associées sont affichées : profondeur de la J-curve (montant minimum), année d'inflexion, cash flow net actuel

---

### US-547 : Superposition de J-curves `P1`

**Description** : En tant qu'analyste de fonds, je veux superposer les J-curves de plusieurs fonds, afin de comparer les profils de retour.

**Critères d'acceptation** :
- [ ] Un toggle permet de superposer les J-curves de fonds du même vintage ou de la même stratégie
- [ ] Chaque courbe est identifiable par couleur et légende
- [ ] Le hover affiche le nom du fonds et la valeur
- [ ] La médiane ou moyenne des courbes peut être affichée en overlay

---

## E — Interactions et navigation

### US-548 : Navigation entre onglets avec animations `P0`

**Description** : En tant qu'analyste de fonds, je veux naviguer entre les onglets Timeline, Cash Flows et J-Curve avec des transitions fluides, afin d'avoir une expérience utilisateur professionnelle.

**Critères d'acceptation** :
- [ ] Les onglets Timeline, Cash Flows et J-Curve sont accessibles via un tab bar
- [ ] Le changement d'onglet est animé avec Framer Motion (AnimatePresence)
- [ ] L'état de chaque onglet est préservé lors du changement
- [ ] Le layout master-detail (liste à gauche, détail à droite) est responsive

---

### US-549 : Export et partage `P2`

**Description** : En tant qu'analyste de fonds, je veux exporter les données et visualisations du cycle de vie, afin de les intégrer dans mes rapports.

**Critères d'acceptation** :
- [ ] Un bouton d'export permet de télécharger les cash flows en CSV
- [ ] Les graphiques sont exportables en PNG
- [ ] Le rapport de cycle de vie est générable en PDF
