# 42 — Allocation & engagements

Suivi des engagements, de l'exposition et du pacing d'un portefeuille de fonds : décomposition committed/called/distributed/NAV/unfunded par fonds, exposition par dimension (stratégie, géographie, vintage), cibles vs réel, pacing d'engagements cumulés et projection des appels futurs.

**Plateformes de référence** : eFront (BlackRock), Burgiss, Preqin, Cobalt (Allvue), Solovis

**Axe stratégique** : Métier/Stratégique

> **Complète** : 40 (Cycle de vie), 41 (Performance) — ce fichier se concentre sur la dimension allocation et gestion de portefeuille : comment les engagements sont répartis, si le portefeuille respecte ses cibles, et comment planifier les engagements futurs (pacing).

---

## A — Engagements par fonds

### US-559 : KPIs consolidés du portefeuille `P0`

**Description** : En tant qu'analyste de portefeuille, je veux voir les KPIs consolidés de l'ensemble des fonds, afin d'avoir une vue d'ensemble immédiate.

**Critères d'acceptation** :
- [ ] Des cartes KPI affichent : total committed, total called, total distributed, NAV totale, unfunded total
- [ ] Les montants sont formatés en M€/Md€ selon l'échelle
- [ ] Les KPI sont mis à jour dynamiquement lorsque des filtres sont appliqués

---

### US-560 : Stacked bar chart de décomposition par fonds `P0`

**Description** : En tant qu'analyste de portefeuille, je veux voir la décomposition distribué/NAV/unfunded de chaque fonds sous forme de barres empilées horizontales, afin de comparer les profils d'engagement.

**Critères d'acceptation** :
- [ ] Un stacked bar chart horizontal affiche par fonds : distribué (vert), NAV (cyan), unfunded (gris)
- [ ] Les fonds sont triés par commitment décroissant
- [ ] Le hover affiche le détail chiffré
- [ ] La légende identifie chaque segment

---

### US-561 : Tableau détaillé des engagements `P0`

**Description** : En tant qu'analyste de portefeuille, je veux un tableau avec le détail des engagements par fonds, afin d'auditer les montants.

**Critères d'acceptation** :
- [ ] Le tableau affiche par fonds : commitment, called (%), distributed, NAV, unfunded
- [ ] Une barre de progression inline affiche le pourcentage appelé
- [ ] Les colonnes sont triables
- [ ] Les totaux sont affichés en pied de tableau

---

## B — Exposition par dimension

### US-562 : Sélecteur de dimension d'analyse `P0`

**Description** : En tant qu'analyste de portefeuille, je veux choisir la dimension d'analyse (stratégie, géographie, vintage), afin de voir l'exposition sous différents angles.

**Critères d'acceptation** :
- [ ] Des boutons permettent de sélectionner la dimension : stratégie, géographie, millésime
- [ ] Le changement de dimension met à jour le donut, les barres cibles/réel et le tableau
- [ ] La dimension active est visuellement identifiée

---

### US-563 : Donut de répartition NAV `P0`

**Description** : En tant qu'analyste de portefeuille, je veux un donut chart montrant la répartition de la NAV par dimension, afin de visualiser la concentration du portefeuille.

**Critères d'acceptation** :
- [ ] Un donut chart affiche la répartition de la NAV selon la dimension choisie
- [ ] Chaque segment affiche le label et le pourcentage
- [ ] La NAV totale est affichée au centre du donut
- [ ] Le hover affiche le montant en valeur absolue

---

### US-564 : Barres cibles vs réel `P0`

**Description** : En tant qu'analyste de portefeuille, je veux comparer l'allocation réelle à l'allocation cible par catégorie, afin d'identifier les écarts.

**Critères d'acceptation** :
- [ ] Des barres horizontales affichent l'allocation réelle par catégorie avec un marqueur de la cible
- [ ] L'écart (réel - cible) est affiché en pourcentage avec code couleur : vert si proche, rouge si éloigné
- [ ] Le ratio réel/cible est affiché numériquement
- [ ] Les catégories sont triées par écart absolu décroissant ou par poids

---

### US-565 : Tableau récapitulatif d'exposition `P0`

**Description** : En tant qu'analyste de portefeuille, je veux un tableau récapitulatif de l'exposition par catégorie, afin d'avoir les chiffres précis.

**Critères d'acceptation** :
- [ ] Le tableau affiche par catégorie : NAV, commitment, % portefeuille, cible, écart
- [ ] L'écart est coloré (vert = sous-pondéré toléré, rouge = hors bornes)
- [ ] Les colonnes sont triables

---

## C — Pacing

### US-566 : Stacked area chart des engagements cumulés `P0`

**Description** : En tant qu'analyste de portefeuille, je veux visualiser les engagements cumulés par cohorte de vintage sur 20 ans, afin de comprendre le rythme de construction du portefeuille.

**Critères d'acceptation** :
- [ ] Un stacked area chart affiche les engagements cumulés par cohorte de vintage (ex : 2010-2013, 2014-2017, 2018-2021, 2022-2025)
- [ ] La légende identifie chaque cohorte
- [ ] L'axe Y est en montant (M€/Md€), l'axe X en années

---

### US-567 : Bar chart des engagements annuels `P0`

**Description** : En tant qu'analyste de portefeuille, je veux voir les nouveaux engagements année par année, afin d'évaluer la régularité du pacing.

**Critères d'acceptation** :
- [ ] Un bar chart affiche les engagements annuels
- [ ] Une ligne horizontale en pointillés affiche la moyenne sur la période
- [ ] Le hover affiche le montant précis et les fonds engagés cette année-là
- [ ] Les barres distinguent visuellement les fonds actifs des fonds terminés

---

### US-568 : Table de projection des appels futurs `P0`

**Description** : En tant qu'analyste de portefeuille, je veux une projection des appels de fonds futurs basée sur l'unfunded restant, afin de planifier la trésorerie.

**Critères d'acceptation** :
- [ ] Un tableau affiche par fonds avec unfunded > 0 : unfunded restant, estimation des appels pour les 3 prochaines années
- [ ] L'estimation est simplifiée : répartition linéaire de l'unfunded selon la phase du fonds
- [ ] Les fonds sans unfunded affichent "-" pour les estimations
- [ ] Une note indique que les projections sont des estimations simplifiées

---

## D — Interactions

### US-569 : Navigation entre onglets Allocation `P0`

**Description** : En tant qu'analyste de portefeuille, je veux naviguer entre les onglets Engagements, Exposition et Pacing.

**Critères d'acceptation** :
- [ ] Les 3 onglets sont accessibles via un tab bar
- [ ] Le changement d'onglet est animé
- [ ] L'état est préservé lors du changement d'onglet
