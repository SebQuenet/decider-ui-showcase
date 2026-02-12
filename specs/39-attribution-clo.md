# 39 — Attribution CLO & crédit structuré

Analyse et attribution de performance de CLOs (Collateralized Loan Obligations) : cascade de cash-flows par tranche, décomposition carry vs pertes de crédit, suivi des tests de couverture (OC/IC), portefeuille de prêts sous-jacents, scénarios de défaut et simulation.

**Plateformes de référence** : Intex, Moody's Analytics (CDOEdge, StructureWorks), Bloomberg CMAN, Trepp, Creditflux, S&P Global LCD

**Axe stratégique** : Performatif/Concurrentiel

> **Complète** : 37 (Attribution obligataire), 38 (Risque de crédit) — ce fichier ajoute la spécificité des produits structurés CLO : modèle waterfall contractuel de distribution des cash-flows, tranchage du risque, arbitrage carry/cost-of-funds, tests de couverture OC/IC, et analyse du collatéral (prêts leveragés).

---

## A — Dashboard et structure

### US-520 : Dashboard CLO `P0`

**Description** : En tant qu'analyste structuré, je veux accéder à un dashboard consolidé d'un CLO montrant sa structure, sa performance et ses risques, afin d'évaluer rapidement la santé du véhicule.

**Critères d'acceptation** :
- [ ] Le dashboard affiche les KPI clés en cartes : encours collatéral, nombre de prêts, WAL (weighted average life), WARF (weighted average rating factor), WAS (weighted average spread), prix moyen pondéré, taux de défaut cumulé, OC ratio junior
- [ ] Un schéma de la structure capital (stack) affiche les tranches de AAA à Equity avec leur encours, spread/coupon et subordination
- [ ] Le carry net (rendement collatéral - coût des tranches de dette) est affiché comme KPI principal
- [ ] Le statut des tests de couverture (OC/IC) est affiché avec code couleur (pass/fail/watch)
- [ ] La période de réinvestissement est identifiée (active, échue, résiduelle)

---

### US-521 : Sélection du CLO et vue multi-CLO `P0`

**Description** : En tant qu'analyste structuré, je veux pouvoir sélectionner un CLO et accéder à une vue multi-CLO, afin de comparer les véhicules.

**Critères d'acceptation** :
- [ ] Un sélecteur propose les CLOs disponibles avec leur millésime, manager et taille
- [ ] Les métadonnées du CLO sont affichées : manager, trustee, date de closing, fin de réinvestissement, maturité légale
- [ ] La date de reporting est configurable (dernier rapport, historique)
- [ ] Un mode tableau multi-CLO permet de comparer les KPI clés de plusieurs véhicules côte à côte
- [ ] Le changement de CLO met à jour toutes les visualisations

---

## B — Cascade de cash-flows (waterfall)

### US-522 : Waterfall de distribution des cash-flows `P0`

**Description** : En tant qu'analyste structuré, je veux visualiser la cascade contractuelle de distribution des cash-flows du CLO, afin de comprendre comment les revenus du collatéral sont répartis entre les tranches.

**Critères d'acceptation** :
- [ ] Le waterfall affiche la cascade complète : revenus d'intérêts du collatéral → frais senior (trustee, admin) → intérêts tranche AAA → intérêts tranche AA → ... → test OC senior → test IC senior → intérêts tranche mezzanine → test OC junior → test IC junior → principal acceleré (si test échoue) → equity residual
- [ ] Chaque étape affiche le montant en valeur absolue et en pourcentage du total
- [ ] Les tests OC/IC sont matérialisés comme des "gates" dans la cascade (pass = vert, fail = rouge)
- [ ] En cas d'échec d'un test, le reroutage des cash-flows vers le remboursement anticipé est visualisé
- [ ] La cascade est animable (les flux "coulent" du haut vers le bas)

---

### US-523 : Cascade côté principal `P1`

**Description** : En tant qu'analyste structuré, je veux visualiser la cascade de distribution du principal (remboursements, prépaiements, produits de vente), afin de comprendre le désendettement du CLO.

**Critères d'acceptation** :
- [ ] La cascade principal affiche : remboursements collatéral → prépaiements → produits de vente/défauts → remboursement tranche AAA → ... → remboursement equity
- [ ] Le rythme d'amortissement par tranche est visualisé dans le temps
- [ ] La distinction entre amortissement séquentiel et pro-rata est identifiée
- [ ] Les produits de recovery (post-défaut) sont isolés
- [ ] Le montant de réinvestissement (si période active) est affiché

---

## C — Carry et décomposition du rendement

### US-524 : Décomposition du carry CLO `P0`

**Description** : En tant qu'analyste structuré, je veux la décomposition du carry net du CLO (revenus des actifs moins coût des passifs), afin de comprendre l'arbitrage fondamental du véhicule.

**Critères d'acceptation** :
- [ ] Un waterfall décompose : spread moyen pondéré des prêts (WAS) → LIBOR/SOFR income → revenu total collatéral → coût tranche AAA → coût tranche AA → ... → frais senior → carry brut → pertes de crédit attendues → carry net equity
- [ ] Le spread d'arbitrage (WAS - coût moyen pondéré des passifs) est mis en évidence comme KPI
- [ ] L'évolution du carry dans le temps est affichée (trimestre par trimestre)
- [ ] La sensibilité du carry au taux de défaut est calculée
- [ ] Le rendement projeté de l'equity (IRR) est affiché pour plusieurs scénarios de défaut

---

### US-525 : Attribution du rendement equity `P1`

**Description** : En tant qu'analyste structuré, je veux la décomposition du rendement de la tranche equity entre carry, trading, pertes de crédit et variation de prix, afin d'évaluer les sources de rendement pour l'investisseur equity.

**Critères d'acceptation** :
- [ ] Le rendement equity est décomposé en : distributions de cash (carry), gains/pertes de trading, pertes de crédit (défauts nets de recovery), variation de mark-to-market des prêts
- [ ] Un waterfall visualise cette décomposition
- [ ] Le cash-on-cash yield est calculé (distributions / investissement initial)
- [ ] Le TRI (IRR) réalisé vs projeté est comparé
- [ ] L'attribution est disponible sur plusieurs périodes (QTD, YTD, depuis inception)

---

## D — Tests de couverture OC/IC

### US-526 : Tableau de bord des tests OC/IC `P0`

**Description** : En tant qu'analyste structuré, je veux un tableau de bord des tests de couverture (overcollateralization et interest coverage) par tranche, afin d'évaluer la marge de sécurité du CLO.

**Critères d'acceptation** :
- [ ] Chaque test est affiché avec : ratio actuel, trigger (seuil contractuel), coussin (marge avant breach), statut (pass/watch/fail)
- [ ] Les tests sont présentés par tranche de séniorité (AAA OC, AA OC, A OC, BBB OC, BB OC, puis IC tests)
- [ ] Un code couleur signale le statut : vert (coussin > 3%), orange (coussin 0-3%), rouge (breach)
- [ ] Des jauges visuelles (gauge charts) montrent le ratio vs le trigger
- [ ] Les conséquences d'un breach sont documentées (diversion de cash-flows, début d'amortissement accéléré)

---

### US-527 : Évolution des tests OC/IC dans le temps `P1`

**Description** : En tant qu'analyste structuré, je veux suivre l'évolution des ratios OC/IC trimestre par trimestre, afin de détecter les tendances de détérioration ou d'amélioration.

**Critères d'acceptation** :
- [ ] Un line chart affiche l'évolution de chaque ratio OC par tranche dans le temps
- [ ] Les triggers contractuels sont matérialisés par des lignes horizontales
- [ ] Les périodes de breach passées sont identifiées (zones rouges)
- [ ] La tendance est extrapolée pour estimer le nombre de trimestres avant un breach potentiel
- [ ] L'impact des défauts récents sur les ratios OC est quantifié

---

## E — Portefeuille de collatéral

### US-528 : Tableau du portefeuille de prêts `P0`

**Description** : En tant qu'analyste structuré, je veux un tableau détaillé des prêts composant le collatéral du CLO, afin d'analyser la qualité du portefeuille sous-jacent.

**Critères d'acceptation** :
- [ ] Le tableau affiche par prêt : emprunteur, secteur, rating (Moody's/S&P), spread, prix, maturité, encours, poids
- [ ] Les prêts en défaut ou en watchlist sont signalés visuellement
- [ ] Les colonnes sont triables et filtrables
- [ ] Les prêts CCC+ et en dessous sont regroupables pour vérifier la conformité au test CCC
- [ ] Le tableau supporte la recherche par emprunteur

---

### US-529 : Répartition du collatéral `P0`

**Description** : En tant qu'analyste structuré, je veux visualiser la répartition du portefeuille de collatéral par secteur, rating et prix, afin d'évaluer la diversification et la qualité.

**Critères d'acceptation** :
- [ ] Un donut chart affiche la répartition sectorielle du collatéral
- [ ] Un bar chart affiche la répartition par tranche de rating (B1, B2, B3, Caa1, etc.)
- [ ] Un histogramme affiche la distribution des prix des prêts (par bucket : <80, 80-90, 90-95, 95-100, >100)
- [ ] Le pourcentage de prêts sous le pair est affiché comme indicateur de stress
- [ ] Les limites de concentration (par émetteur, secteur) sont superposées

---

### US-530 : Suivi des défauts et recouvrements `P0`

**Description** : En tant qu'analyste structuré, je veux un suivi des événements de défaut et des recouvrements dans le collatéral du CLO, afin de mesurer les pertes de crédit réelles.

**Critères d'acceptation** :
- [ ] Un tableau chronologique liste les défauts : date, emprunteur, encours au défaut, type (payment default, bankruptcy, distressed exchange), statut (en workout, résolu)
- [ ] Le taux de recouvrement réalisé est affiché par défaut résolu
- [ ] Les pertes réalisées (encours - recouvrement) sont cumulées dans un graphique en escalier
- [ ] Le taux de défaut cumulé du CLO est comparé à la moyenne du marché et au taux implicite du WARF
- [ ] Le montant de prêts CCC et en dessous est suivi dans le temps (test CCC bucket)

---

## F — Scénarios et simulation

### US-531 : Simulation de scénario de défaut `P1`

**Description** : En tant qu'analyste structuré, je veux simuler l'impact de différents scénarios de défaut sur les cash-flows du CLO et les tests de couverture, afin de stress-tester le véhicule.

**Critères d'acceptation** :
- [ ] Des scénarios prédéfinis sont proposés : CDR (constant default rate) de 2%, 4%, 6%, 8% avec recovery de 70%, 50%, 30%
- [ ] L'utilisateur peut définir un scénario personnalisé (CDR, recovery, timing)
- [ ] Les résultats affichent : impact sur les tests OC/IC, date estimée de breach, distributions equity projetées, IRR equity projeté
- [ ] La cascade de cash-flows est recalculée et affichée sous le scénario stressé
- [ ] La comparaison scénario central vs stressé est visualisée côte à côte

---

### US-532 : Projection des cash-flows `P1`

**Description** : En tant qu'analyste structuré, je veux visualiser les cash-flows projetés du CLO par tranche sur la durée de vie résiduelle, afin d'estimer le profil de remboursement.

**Critères d'acceptation** :
- [ ] Un stacked area chart affiche les cash-flows projetés : principal + intérêts par tranche, trimestre par trimestre
- [ ] Le cash-flow equity (distributions résiduelles) est identifié séparément
- [ ] Trois scénarios de prépaiement sont proposés (lent, base, rapide)
- [ ] La WAL (weighted average life) projetée de chaque tranche est affichée
- [ ] Le breakeven default rate (taux de défaut maximal avant perte de principal) est calculé par tranche

---

### US-533 : Analyse de sensibilité multi-facteur `P2`

**Description** : En tant qu'analyste structuré, je veux analyser la sensibilité du rendement equity à plusieurs facteurs simultanément, afin d'identifier les risques dominants.

**Critères d'acceptation** :
- [ ] Une matrice de sensibilité croise deux facteurs : CDR × recovery, CDR × CPR (prepayment), spread × défaut
- [ ] L'IRR equity est calculé pour chaque combinaison
- [ ] La matrice est colorée par gradient (vert = IRR élevé, rouge = perte)
- [ ] Les scénarios optimiste, central et pessimiste sont identifiés dans la matrice
- [ ] Le facteur le plus impactant est identifié par analyse de sensibilité partielle

---

## G — Trading et gestion active

### US-534 : P&L de trading `P2`

**Description** : En tant qu'analyste structuré, je veux suivre le P&L des opérations de trading réalisées par le gérant du CLO (achats, ventes, rotations), afin d'évaluer la qualité de la gestion active.

**Critères d'acceptation** :
- [ ] Un tableau liste les trades : date, emprunteur, achat/vente, prix, gain/perte réalisé
- [ ] Le P&L cumulé des trades est affiché en graphique
- [ ] Les trades sont classés : crédit-driven (gestion du risque), relative value (opportuniste), réinvestissement
- [ ] Le turnover du portefeuille est calculé (achats + ventes / encours moyen)
- [ ] L'impact des trades sur les métriques de portefeuille (WAS, WARF, diversification) est quantifié

---

### US-535 : Suivi de la période de réinvestissement `P1`

**Description** : En tant qu'analyste structuré, je veux suivre l'utilisation de la période de réinvestissement, afin d'évaluer la capacité du gérant à maintenir le collatéral.

**Critères d'acceptation** :
- [ ] Le statut de la période de réinvestissement est affiché : active (date de fin), en amortissement
- [ ] Le montant de principal disponible pour réinvestissement est affiché
- [ ] Le rythme de déploiement est tracé dans le temps (montant réinvesti par trimestre)
- [ ] La qualité des nouveaux prêts achetés est comparée au portefeuille existant (spread, rating, prix)
- [ ] Le principal non réinvesti (cash drag) est quantifié et son impact sur le carry calculé

---

## H — Comparaison et benchmark

### US-536 : Comparaison multi-CLO `P2`

**Description** : En tant qu'analyste structuré, je veux comparer les métriques de plusieurs CLOs côte à côte, afin de sélectionner les meilleurs véhicules.

**Critères d'acceptation** :
- [ ] Un tableau comparatif affiche pour chaque CLO : manager, millésime, taille, WAS, WARF, WAL, OC cushion, default rate, equity IRR
- [ ] Les CLOs sont triables par n'importe quelle métrique
- [ ] Un scatter plot positionne les CLOs (OC cushion en X, equity yield en Y)
- [ ] Les CLOs du même manager sont regroupables pour évaluer la constance
- [ ] Les données sont normalisées par millésime pour comparabilité

---

## I — Interactions et export

### US-537 : Cross-filtering entre visualisations `P0`

**Description** : En tant qu'analyste structuré, je veux que les visualisations soient interconnectées, afin de naviguer fluidement dans l'analyse.

**Critères d'acceptation** :
- [ ] Le clic sur une tranche dans le stack de structure filtre la cascade et les tests OC/IC correspondants
- [ ] Le clic sur un secteur dans le donut filtre le tableau de collatéral
- [ ] Le clic sur un défaut dans le tableau des défauts met en évidence son impact dans les tests OC
- [ ] Un bouton "Reset filtres" revient à la vue complète
- [ ] Les filtres actifs sont affichés sous forme de chips supprimables

---

### US-538 : Export du rapport CLO `P1`

**Description** : En tant qu'analyste structuré, je veux exporter l'analyse CLO complète, afin de la partager avec mon comité d'investissement.

**Critères d'acceptation** :
- [ ] L'export PDF génère un rapport structuré : structure, cascade, tests OC/IC, collatéral, défauts, scénarios
- [ ] L'export Excel contient les données brutes (portefeuille de prêts, cash-flows projetés, historique des tests)
- [ ] Les graphiques sont inclus en haute résolution
- [ ] La date de reporting et le CLO sont en en-tête
- [ ] Le rapport respecte le branding Decider

---

### US-539 : Narration automatique `P2`

**Description** : En tant qu'analyste structuré, je veux que l'assistant génère un commentaire narratif sur le CLO, afin d'accélérer la rédaction de mes notes d'investissement.

**Critères d'acceptation** :
- [ ] Le commentaire couvre : santé du CLO (tests OC/IC), qualité du collatéral, défauts récents, carry et rendement equity, risques identifiés
- [ ] Le ton est professionnel et factuel
- [ ] Les chiffres clés sont intégrés dans le texte
- [ ] Le commentaire est éditable avant export
- [ ] La langue est configurable (français, anglais)
