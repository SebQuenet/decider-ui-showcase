# 29 — Scoring & Analyse avancée

Fonctionnalités liées à la due diligence structurée, au scoring quantitatif des fonds, à l'analyse SWOT automatique et aux stress tests.

**Plateformes de référence** : Decider.ai, PitchBook, Preqin, Morningstar Direct, eFront, Ekimetrics Radians

**Axe stratégique** : Performatif/Concurrentiel

---

### US-379 : Scorecard de due diligence `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer une scorecard de due diligence évaluant un fonds sur des critères structurés, afin de standardiser mon processus d'évaluation.

**Critères d'acceptation** :
- [ ] La scorecard évalue le fonds sur des dimensions prédéfinies : performance, risque, équipe, gouvernance, termes, stratégie
- [ ] Chaque dimension reçoit une note et un commentaire justificatif sourcé
- [ ] La pondération des dimensions est configurable par l'utilisateur
- [ ] Un score global est calculé avec code couleur (vert, orange, rouge)
- [ ] La scorecard est exportable en PDF

---

### US-380 : Scoring quantitatif des fonds `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant calcule un score quantitatif pour chaque fonds basé sur les métriques financières disponibles, afin de comparer objectivement les opportunités.

**Critères d'acceptation** :
- [ ] Le score combine les métriques clés (TRI, Sharpe, drawdown, TVPI) selon une méthodologie transparente
- [ ] La méthodologie de scoring est documentée et consultable
- [ ] Les fonds peuvent être classés par score quantitatif
- [ ] L'assistant signale quand des données manquantes affectent la fiabilité du score
- [ ] Le score est recalculé automatiquement quand de nouvelles données sont disponibles

---

### US-381 : Analyse SWOT automatique `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant génère une analyse SWOT d'un fonds à partir de la data room, afin de structurer rapidement les forces, faiblesses, opportunités et menaces.

**Critères d'acceptation** :
- [ ] L'assistant produit une matrice SWOT avec 3 à 5 points par quadrant
- [ ] Chaque point est sourcé avec référence au document de la data room
- [ ] Les contradictions détectées sont intégrées comme faiblesses ou menaces
- [ ] L'utilisateur peut modifier et compléter la SWOT générée
- [ ] La SWOT est exportable et intégrable dans les documents générés

---

### US-382 : Stress tests de portefeuille `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir simuler l'impact de scénarios de stress sur la performance d'un fonds, afin d'évaluer sa résilience dans des conditions adverses.

**Critères d'acceptation** :
- [ ] Des scénarios prédéfinis sont disponibles (crise 2008, hausse de taux, choc sectoriel)
- [ ] L'utilisateur peut définir des scénarios personnalisés (variation de paramètres)
- [ ] Les résultats affichent l'impact estimé sur la NAV, le TRI et les multiples
- [ ] Les hypothèses du scénario sont documentées
- [ ] Les résultats sont présentés sous forme de tableau et de graphique

---

### US-383 : Scoring de risque opérationnel `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant évalue le risque opérationnel d'un fonds à partir des documents disponibles, afin d'identifier les faiblesses organisationnelles.

**Critères d'acceptation** :
- [ ] L'évaluation couvre : gouvernance, processus d'investissement, valorisation, reporting, IT, continuité d'activité
- [ ] Chaque dimension reçoit un score et un commentaire basé sur les documents
- [ ] Les lacunes documentaires sont signalées comme facteur de risque
- [ ] Le score est comparé aux bonnes pratiques de l'industrie
- [ ] Un rapport de risque opérationnel est générable

---

### US-384 : Analyse de sensibilité `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir réaliser une analyse de sensibilité sur les métriques clés d'un fonds en faisant varier les hypothèses, afin d'évaluer la robustesse des projections.

**Critères d'acceptation** :
- [ ] L'utilisateur peut sélectionner la variable à faire varier (taux, durée, multiple de sortie)
- [ ] Les résultats sont affichés dans un tableau de sensibilité (matrice 2D)
- [ ] Les scénarios optimiste, central et pessimiste sont identifiés
- [ ] Le graphique de sensibilité est généré automatiquement
- [ ] Les hypothèses et résultats sont sourcés et documentés

---

### US-385 : Scoring ESG `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant évalue la conformité ESG d'un fonds à partir des informations disponibles, afin d'intégrer les critères extra-financiers dans mon analyse.

**Critères d'acceptation** :
- [ ] L'évaluation couvre les trois piliers : Environnement, Social, Gouvernance
- [ ] Le score est basé sur les informations présentes dans la data room
- [ ] Les lacunes d'information ESG sont signalées
- [ ] Le scoring est conforme aux référentiels courants (SFDR, taxonomie européenne)
- [ ] Le rapport ESG est intégrable dans les documents générés

---

### US-386 : Comparaison au peer group `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir comparer un fonds à son peer group (fonds de même stratégie, taille et millésime), afin de contextualiser sa performance.

**Critères d'acceptation** :
- [ ] Le peer group est déterminé automatiquement en fonction de la stratégie, la taille et le millésime
- [ ] Les métriques du fonds sont positionnées par rapport aux quartiles du peer group
- [ ] Le rang du fonds dans son peer group est affiché pour chaque métrique
- [ ] L'utilisateur peut ajuster les critères de définition du peer group
- [ ] Les données du peer group sont sourcées

---

### US-387 : Score de qualité de la data room `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant évalue la qualité et la complétude de la data room, afin de savoir dans quelle mesure les analyses sont fiables.

**Critères d'acceptation** :
- [ ] Le score évalue la complétude (documents manquants), la fraîcheur (ancienneté des données) et la cohérence (contradictions)
- [ ] Le score est affiché sur le dashboard du projet avec un code couleur
- [ ] Les recommandations pour améliorer la qualité sont listées par ordre de priorité
- [ ] Le score est mis à jour automatiquement quand des documents sont ajoutés
- [ ] Le détail du calcul est consultable (critères et pondération)

---

### US-388 : Analyse de concentration `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant analyse la concentration du portefeuille d'un fonds (sectorielle, géographique, par contrepartie), afin d'évaluer le risque de diversification.

**Critères d'acceptation** :
- [ ] Les indices de concentration sont calculés (Herfindahl-Hirschman, top 5, top 10)
- [ ] La concentration est analysée par secteur, géographie et contrepartie
- [ ] Les résultats sont présentés en tableau et en graphique (treemap, barres)
- [ ] Les dépassements de limites de concentration sont signalés
- [ ] L'analyse est comparable entre fonds

---

### US-389 : Projection de performance `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant projette la performance future d'un fonds selon différents scénarios, afin d'évaluer le potentiel de rendement.

**Critères d'acceptation** :
- [ ] Les projections sont basées sur les données historiques et les hypothèses de l'utilisateur
- [ ] Trois scénarios sont proposés : optimiste, central, pessimiste
- [ ] Les résultats incluent le TRI projeté, le TVPI et le DPI
- [ ] Les hypothèses sont explicitement documentées
- [ ] Un disclaimer signale le caractère indicatif des projections

---

### US-390 : Score de liquidité `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant évalue le profil de liquidité d'un fonds, afin de comprendre les contraintes de sortie et les flux de trésorerie attendus.

**Critères d'acceptation** :
- [ ] L'évaluation couvre les lock-up, les gates, les side pockets et les conditions de rachat
- [ ] Le profil de liquidité est résumé dans un score et un commentaire
- [ ] Les prochaines fenêtres de liquidité sont identifiées avec leur date
- [ ] Le profil est comparé aux standards de la classe d'actifs
- [ ] Les contraintes de liquidité sont extraites automatiquement des documents juridiques

---

### US-391 : Matrice risque/rendement `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir positionner un fonds sur une matrice risque/rendement par rapport à d'autres fonds analysés, afin de visualiser le compromis risque/rendement.

**Critères d'acceptation** :
- [ ] La matrice affiche les fonds analysés sur un scatter plot rendement (Y) vs risque (X)
- [ ] Les métriques de risque et rendement sont configurables
- [ ] Les quadrants sont identifiés (rendement élevé/risque faible = optimal)
- [ ] Le positionnement est mis à jour quand de nouvelles données sont disponibles
- [ ] La matrice est exportable et intégrable dans les documents

---

### US-392 : Personnalisation des critères de scoring `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir personnaliser les critères et les pondérations des scorecards, afin d'adapter l'évaluation à la politique d'investissement de mon organisation.

**Critères d'acceptation** :
- [ ] L'utilisateur peut ajouter, supprimer ou modifier les critères d'évaluation
- [ ] Les pondérations sont ajustables avec un total contrôlé à 100 %
- [ ] Les profils de scoring personnalisés sont sauvegardables et réutilisables
- [ ] Les profils peuvent être partagés entre membres de l'équipe
- [ ] Un profil par défaut est fourni comme point de départ
