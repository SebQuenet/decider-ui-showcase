# 38 — Risque de crédit & attribution des pertes

Analyse du risque de crédit d'un portefeuille de prêts ou d'obligations : décomposition PD × LGD × EAD, matrice de migration, contribution marginale au risque, analyse de concentration, stress tests, provisionnement IFRS 9.

**Plateformes de référence** : Moody's Analytics (RiskCalc, CreditEdge), S&P Capital IQ, Kamakura, SAS Credit Scoring, Bloomberg DRSK

**Axe stratégique** : Performatif/Concurrentiel

> **Complète** : 29 (Scoring & Analyse avancée), 36 (Attribution immobilière) — ce fichier ajoute la modélisation du risque de crédit pur (PD/LGD/EAD), la contribution au risque de portefeuille et l'attribution des pertes, là où les specs 29 et 36 traitent du scoring qualitatif et de l'attribution de performance immobilière.

---

## A — Dashboard et vue d'ensemble

### US-501 : Dashboard risque de crédit `P0`

**Description** : En tant qu'analyste risque, je veux accéder à un dashboard consolidé du risque de crédit d'un portefeuille de prêts ou d'obligations, afin de visualiser l'exposition globale, les pertes attendues et la qualité du portefeuille.

**Critères d'acceptation** :
- [ ] Le dashboard affiche les KPI clés en cartes : encours total, nombre d'expositions, perte attendue (EL), perte inattendue (UL), ratio EL/encours, PD moyenne pondérée, LGD moyenne pondérée, rating moyen
- [ ] Un waterfall décompose la perte attendue : EL = Σ (PD × LGD × EAD) ventilé par segment
- [ ] Un donut montre la répartition du portefeuille par tranche de rating (investment grade vs high yield vs unrated)
- [ ] Le code couleur (vert/orange/rouge) signale les métriques hors normes
- [ ] Le dashboard est interactif : clic sur un segment pour drill-down

---

### US-502 : Sélection du portefeuille et paramètres `P0`

**Description** : En tant qu'analyste risque, je veux pouvoir sélectionner un portefeuille crédit et configurer les paramètres de risque, afin de contextualiser l'analyse.

**Critères d'acceptation** :
- [ ] Un sélecteur propose les portefeuilles disponibles avec leur type (corporate, souverain, retail, structuré)
- [ ] La date d'analyse est configurable (point-in-time ou through-the-cycle)
- [ ] Les paramètres du modèle sont affichés : horizon (1Y, lifetime), niveau de confiance (99%, 99.9%), corrélation
- [ ] Les métadonnées du portefeuille sont affichées (encours, nombre de lignes, devise, date de mise à jour)
- [ ] Le changement de portefeuille met à jour toutes les visualisations

---

## B — Décomposition PD × LGD × EAD

### US-503 : Waterfall de la perte attendue `P0`

**Description** : En tant qu'analyste risque, je veux visualiser la décomposition de la perte attendue en un waterfall PD × LGD × EAD par segment, afin de comprendre quels segments concentrent le risque.

**Critères d'acceptation** :
- [ ] Le waterfall affiche la contribution à l'EL de chaque segment (par secteur, rating ou géographie)
- [ ] Chaque barre est décomposable en PD × LGD × EAD au survol
- [ ] Les segments sont triés par contribution décroissante
- [ ] Le total EL et le ratio EL/encours sont affichés
- [ ] La comparaison avec la période précédente est disponible (variation Δ EL)

---

### US-504 : Tableau des expositions détaillé `P0`

**Description** : En tant qu'analyste risque, je veux un tableau détaillé de toutes les expositions du portefeuille avec les paramètres de risque, afin d'analyser le risque ligne par ligne.

**Critères d'acceptation** :
- [ ] Le tableau affiche par exposition : contrepartie, secteur, pays, rating interne, PD, LGD, EAD, EL, maturité résiduelle, collatéral
- [ ] Les colonnes sont triables et filtrables
- [ ] Les expositions dont la PD dépasse un seuil sont signalées (watchlist)
- [ ] Le clic sur une exposition ouvre un panneau de détail avec historique de rating et événements
- [ ] Le tableau supporte la recherche par nom de contrepartie

---

### US-505 : Scatter plot PD vs LGD `P1`

**Description** : En tant qu'analyste risque, je veux visualiser un scatter plot positionnant chaque exposition sur les axes PD (abscisse) et LGD (ordonnée), afin d'identifier les expositions à haut risque sur les deux dimensions simultanément.

**Critères d'acceptation** :
- [ ] Chaque exposition est un point dont la taille est proportionnelle à l'EAD
- [ ] Les points sont colorés par secteur ou rating
- [ ] Les zones de risque sont matérialisées (faible PD/faible LGD = vert, haute PD/haute LGD = rouge)
- [ ] Les courbes iso-EL (PD × LGD = constante) sont tracées en fond
- [ ] Le hover affiche le détail de l'exposition (nom, secteur, rating, EL)

---

## C — Matrice de migration

### US-506 : Matrice de transition des ratings `P0`

**Description** : En tant qu'analyste risque, je veux visualiser la matrice de migration des ratings du portefeuille sur la période, afin d'évaluer la dynamique de qualité de crédit.

**Critères d'acceptation** :
- [ ] La matrice affiche les transitions rating début de période → rating fin de période (AAA à D)
- [ ] Chaque cellule contient le nombre d'expositions et le pourcentage
- [ ] La diagonale (pas de changement) est en gris neutre, les upgrades en vert, les downgrades en rouge
- [ ] Les migrations vers défaut (D) sont mises en évidence
- [ ] La matrice empirique est comparable à la matrice historique de référence (S&P, Moody's)

---

### US-507 : Impact des migrations sur l'EL `P1`

**Description** : En tant qu'analyste risque, je veux quantifier l'impact des migrations de rating sur la perte attendue du portefeuille, afin de comprendre comment la dégradation ou l'amélioration de la qualité affecte le risque.

**Critères d'acceptation** :
- [ ] Un waterfall montre : EL début de période → impact des downgrades → impact des upgrades → impact des défauts → nouvelles expositions → expositions sorties → EL fin de période
- [ ] Chaque migration est détaillée avec le changement de PD associé
- [ ] Les plus gros contributeurs à l'augmentation / diminution de l'EL sont listés
- [ ] Le taux de downgrade et le taux de défaut sont comparés aux moyennes historiques
- [ ] L'évolution du rating moyen du portefeuille est affichée

---

## D — Contribution au risque et concentration

### US-508 : Contribution marginale au risque `P1`

**Description** : En tant qu'analyste risque, je veux calculer la contribution marginale de chaque exposition au risque total du portefeuille (VaR crédit ou expected shortfall), afin d'optimiser l'allocation du capital.

**Critères d'acceptation** :
- [ ] La contribution marginale au risque est calculée pour chaque exposition
- [ ] Un bar chart horizontal affiche les top 20 contributeurs au risque de portefeuille
- [ ] Le ratio contribution/poids est affiché (les expositions sur-contribuant au risque sont identifiées)
- [ ] La somme des contributions marginales est égale au risque total du portefeuille (propriété d'Euler)
- [ ] Le hover affiche le détail : contribution standalone vs marginale vs incrémentale

---

### US-509 : Analyse de concentration `P0`

**Description** : En tant qu'analyste risque, je veux évaluer la concentration du portefeuille par nom, secteur et géographie, afin d'identifier les risques de diversification insuffisante.

**Critères d'acceptation** :
- [ ] L'indice HHI (Herfindahl-Hirschman) est calculé par nom, secteur et géographie
- [ ] Le top 10 des expositions par taille est affiché avec leur poids dans le portefeuille
- [ ] Un treemap visualise la répartition par secteur (taille = EAD, couleur = PD moyenne)
- [ ] Un treemap secondaire visualise la répartition géographique
- [ ] Les dépassements de limites de concentration sont signalés en rouge

---

### US-510 : Courbe de Lorenz et coefficient de Gini `P2`

**Description** : En tant qu'analyste risque, je veux visualiser la courbe de Lorenz de la distribution des expositions, afin de mesurer graphiquement le degré de concentration.

**Critères d'acceptation** :
- [ ] La courbe de Lorenz est tracée (pourcentage cumulé des expositions vs pourcentage cumulé de l'encours)
- [ ] La droite d'égalité parfaite (45°) est tracée en référence
- [ ] Le coefficient de Gini est calculé et affiché
- [ ] La même courbe est disponible pour l'EL (concentration du risque)
- [ ] La comparaison avec la période précédente est possible

---

## E — Perte attendue vs inattendue

### US-511 : Distribution des pertes du portefeuille `P1`

**Description** : En tant qu'analyste risque, je veux visualiser la distribution complète des pertes du portefeuille (simulée), afin de comprendre la forme du risque et le capital économique requis.

**Critères d'acceptation** :
- [ ] Un histogramme affiche la distribution des pertes (fréquence vs montant de perte)
- [ ] La perte attendue (EL) est marquée sur l'axe avec une ligne verticale
- [ ] Le percentile 99% (VaR) et le 99.9% (capital réglementaire) sont marqués
- [ ] La perte inattendue (UL = VaR - EL) est identifiée graphiquement
- [ ] La queue de distribution (tail risk) est mise en évidence avec zoom possible

---

### US-512 : Décomposition du capital économique `P1`

**Description** : En tant qu'analyste risque, je veux la décomposition du capital économique par segment (secteur, rating, géographie), afin de comprendre où le capital est consommé.

**Critères d'acceptation** :
- [ ] Un stacked bar chart affiche la contribution de chaque segment au capital économique total
- [ ] Le tableau associé détaille : EL, UL, capital économique, ratio capital/encours par segment
- [ ] Les segments les plus consommateurs de capital sont mis en évidence
- [ ] La comparaison avec le capital alloué permet d'identifier les sur/sous-allocations
- [ ] Le rendement ajusté du risque (RAROC = rendement / capital) est calculé par segment

---

## F — Stress tests et scénarios

### US-513 : Stress test macroéconomique `P1`

**Description** : En tant qu'analyste risque, je veux simuler l'impact de scénarios macroéconomiques adverses sur les paramètres de risque du portefeuille, afin d'évaluer la résilience.

**Critères d'acceptation** :
- [ ] Des scénarios prédéfinis sont proposés : récession modérée, récession sévère, crise souveraine, choc sectoriel
- [ ] Chaque scénario applique des multiplicateurs aux PD par secteur et des ajustements aux LGD
- [ ] Les résultats affichent : EL stressée, variation Δ EL, nouvelles PD moyennes, taux de défaut implicite
- [ ] La comparaison scénario central vs scénario stressé est visualisée en waterfalls côte à côte
- [ ] Les hypothèses du scénario sont documentées et modifiables

---

### US-514 : Analyse de sensibilité PD / LGD `P1`

**Description** : En tant qu'analyste risque, je veux pouvoir faire varier les paramètres PD et LGD pour observer l'impact sur la perte attendue, afin d'évaluer la robustesse des estimations.

**Critères d'acceptation** :
- [ ] Des sliders permettent d'appliquer un choc uniforme sur les PD (×1.5, ×2, ×3) et les LGD (+10%, +20%)
- [ ] Une matrice de sensibilité PD × LGD affiche l'EL résultante pour chaque combinaison
- [ ] L'EL est mise à jour dynamiquement quand les sliders bougent
- [ ] Les scénarios optimiste, central et pessimiste sont identifiés dans la matrice
- [ ] L'impact sur le capital économique est aussi affiché

---

## G — Provisionnement IFRS 9

### US-515 : Staging IFRS 9 `P2`

**Description** : En tant qu'analyste risque, je veux visualiser la classification du portefeuille selon les stages IFRS 9 (Stage 1, 2, 3), afin de comprendre le provisionnement.

**Critères d'acceptation** :
- [ ] Un sankey diagram ou stacked bar affiche la répartition du portefeuille par stage (1 = performing, 2 = significant increase in credit risk, 3 = credit-impaired)
- [ ] Les critères de passage entre stages sont documentés (seuil de dégradation PD, jours de retard)
- [ ] Le montant de provision (ECL) est calculé par stage : 12-month ECL (stage 1) vs lifetime ECL (stages 2-3)
- [ ] Les mouvements entre stages sur la période sont visualisés (flux entrants/sortants)
- [ ] Le coverage ratio (provision / encours) est affiché par stage

---

### US-516 : Évolution temporelle du provisionnement `P2`

**Description** : En tant qu'analyste risque, je veux suivre l'évolution des provisions IFRS 9 dans le temps, afin de comprendre la trajectoire de provisionnement.

**Critères d'acceptation** :
- [ ] Un stacked area chart affiche les provisions par stage (1, 2, 3) trimestre par trimestre
- [ ] Le taux de couverture global est affiché en courbe superposée
- [ ] Les événements de reprises et de dotations sont identifiables
- [ ] Les mouvements entre stages sont annotés (macro-migration vs micro-migration)
- [ ] La comparaison avec les exigences réglementaires est disponible

---

## H — Interactions et navigation

### US-517 : Cross-filtering entre visualisations `P0`

**Description** : En tant qu'analyste risque, je veux que les visualisations soient interconnectées, afin de naviguer fluidement dans l'analyse de risque.

**Critères d'acceptation** :
- [ ] Le clic sur un secteur dans le treemap filtre le tableau d'expositions, le scatter PD/LGD et le waterfall EL
- [ ] Le clic sur un rating dans la matrice de migration filtre le tableau et le scatter
- [ ] Le clic sur une zone de la heatmap PD/LGD filtre les expositions correspondantes
- [ ] Un bouton "Reset filtres" revient à la vue complète
- [ ] Les filtres actifs sont affichés sous forme de chips supprimables

---

### US-518 : Export du rapport de risque `P1`

**Description** : En tant qu'analyste risque, je veux exporter l'analyse de risque complète, afin de la présenter en comité des risques.

**Critères d'acceptation** :
- [ ] L'export PDF génère un rapport structuré : synthèse, waterfall EL, matrice de migration, concentration, stress tests, top expositions
- [ ] L'export Excel contient les données brutes dans des onglets organisés
- [ ] Les graphiques sont inclus en haute résolution
- [ ] La date d'analyse et les paramètres du modèle sont en en-tête
- [ ] Le rapport respecte le branding Decider

---

### US-519 : Interrogation en langage naturel `P2`

**Description** : En tant qu'analyste risque, je veux poser des questions en langage naturel sur le risque du portefeuille, afin d'explorer l'analyse de manière intuitive.

**Critères d'acceptation** :
- [ ] Un champ de chat est intégré au dashboard
- [ ] L'assistant répond à des questions comme "Quelles sont les 5 expositions les plus risquées ?" ou "Quel serait l'impact d'un downgrade de 2 crans du secteur énergie ?"
- [ ] Les réponses citent les données du dashboard avec renvoi vers la visualisation correspondante
- [ ] L'assistant peut simuler des scénarios à la volée en réponse aux questions
- [ ] Des suggestions de questions sont proposées en fonction du contexte
