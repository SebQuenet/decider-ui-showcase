# 35 — Data Storytelling

L'IA génère un récit narratif structuré autour des visualisations financières, connectant les données quantitatives à des explications contextuelles, des tendances et des implications métier.

**Plateformes de référence** : FusionCharts Narratives, OpenBB, Bloomberg Intelligence, Morningstar Analyst Reports

**Axe stratégique** : Différenciant fort / Narratif augmenté

> **Enrichit** : US-309+ (Dataviz financière) et US-337+ (Génération documents financiers) — ce fichier ajoute la couche narrative automatique qui transforme des graphiques isolés en analyses contextualisées et lisibles.

---

### US-466 : Rapport narratif automatique à partir de données `P0`

**Description** : En tant qu'analyste financier, je veux que l'IA génère automatiquement un récit narratif structuré (introduction, faits saillants, contexte, implications) autour d'un jeu de données financières, afin d'obtenir une analyse lisible et actionnable.

**Critères d'acceptation** :
- [ ] Le récit est structuré en sections : Synthèse, Faits saillants, Analyse détaillée, Implications
- [ ] Chaque section est streamée séquentiellement avec des animations d'apparition
- [ ] Les valeurs quantitatives clés sont mises en évidence (badges inline, gras)
- [ ] Le récit fait référence aux graphiques affichés (ex. "Comme visible sur le graphique ci-dessus...")
- [ ] Le niveau de détail est adapté au profil utilisateur (junior vs senior)

---

### US-467 : Graphiques inline dans le récit narratif `P0`

**Description** : En tant qu'analyste financier, je veux que les graphiques pertinents soient insérés directement dans le flux du récit narratif (et non affichés séparément), afin de lire une analyse fluide mêlant texte et visualisations.

**Critères d'acceptation** :
- [ ] Les graphiques sont insérés entre les paragraphes de texte, là où ils sont pertinents
- [ ] Chaque graphique est introduit par une phrase de contextualisation
- [ ] Les graphiques sont dimensionnés de manière cohérente avec le texte (pas pleine largeur systématique)
- [ ] Les graphiques sont interactifs (hover tooltips) même dans le flux narratif
- [ ] L'ordre texte/graphique crée une progression logique dans l'analyse

---

### US-468 : Métriques clés en cartes visuelles `P0`

**Description** : En tant qu'analyste financier, je veux que les KPIs essentiels soient affichés en cartes visuelles (avec icône, valeur, variation, indicateur couleur) en tête du récit, afin d'avoir une vue d'ensemble immédiate.

**Critères d'acceptation** :
- [ ] Les 4 à 6 KPIs les plus pertinents sont affichés en cartes horizontales
- [ ] Chaque carte affiche : label, valeur formatée, variation vs période précédente (↑/↓ + %)
- [ ] Un code couleur indique la tendance (vert = positif, rouge = négatif)
- [ ] Les cartes apparaissent avec une animation stagger
- [ ] Les valeurs sont formatées selon les conventions financières (%, devise, multiples)

---

### US-469 : Callouts d'insights dans le récit `P1`

**Description** : En tant qu'analyste financier, je veux que les insights clés soient mis en évidence dans des callout boxes distinctes du texte courant, afin de repérer immédiatement les points d'attention.

**Critères d'acceptation** :
- [ ] 3 types de callouts : Insight (bleu/info), Alerte (orange/warning), Point fort (vert/success)
- [ ] Chaque callout a une icône, un titre et un texte court
- [ ] Les callouts sont insérés dans le flux narratif aux endroits pertinents
- [ ] Les callouts sont animés (slide-in depuis la gauche)

---

### US-470 : Timeline des événements significatifs `P1`

**Description** : En tant qu'analyste financier, je veux qu'une timeline visuelle des événements significatifs soit intégrée dans le récit, afin de contextualiser les variations observées dans les graphiques.

**Critères d'acceptation** :
- [ ] La timeline affiche les événements clés (appels, distributions, changements de marché) sur un axe horizontal
- [ ] Chaque événement est cliquable pour afficher un détail contextuel
- [ ] La timeline est synchronisée visuellement avec les graphiques du récit
- [ ] Les événements sont catégorisés par type (fonds, marché, réglementaire)
- [ ] La timeline apparaît avec une animation progressive (points qui se révèlent)

---

### US-471 : Section de comparaison narrative `P1`

**Description** : En tant qu'analyste financier, je veux que le récit inclue une section comparative contextuelle (vs benchmark, vs période précédente, vs pairs), afin de situer la performance dans son contexte.

**Critères d'acceptation** :
- [ ] La comparaison est présentée en prose avec des références quantitatives
- [ ] Un mini-graphique comparatif inline illustre les écarts principaux
- [ ] Les écarts significatifs (> 2 écarts-types) sont signalés en callout
- [ ] Le benchmark de comparaison est identifié et sourcé

---

### US-472 : Résumé exécutif généré `P0`

**Description** : En tant qu'analyste financier, je veux qu'un résumé exécutif de 3-5 phrases soit généré en tête du récit, afin de permettre une lecture rapide pour les décideurs.

**Critères d'acceptation** :
- [ ] Le résumé est affiché dans un encadré distinct en haut du récit
- [ ] Il capture les 2-3 points les plus importants de l'analyse
- [ ] Il inclut les chiffres clés sans détail excessif
- [ ] Il se termine par une recommandation ou une orientation (ex. "à surveiller", "en ligne avec les attentes")
- [ ] Le résumé est copiable en un clic (pour email/Slack)

---

### US-473 : Contrôle du niveau de détail `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir ajuster le niveau de détail du récit narratif (synthétique / standard / détaillé), afin de l'adapter à mon audience.

**Critères d'acceptation** :
- [ ] Un sélecteur 3 positions permet de choisir le niveau de détail
- [ ] Le mode synthétique produit un récit de ~200 mots avec KPIs et résumé uniquement
- [ ] Le mode standard produit un récit de ~500 mots avec graphiques et analyse
- [ ] Le mode détaillé produit un récit de ~1000+ mots avec contexte, comparaisons et recommandations
- [ ] Le changement de niveau régénère le récit avec animation de transition

---

### US-474 : Export du récit en PDF `P2`

**Description** : En tant qu'analyste financier, je veux exporter le récit narratif complet (texte + graphiques + KPIs) en PDF professionnel, afin de le partager avec les parties prenantes.

**Critères d'acceptation** :
- [ ] L'export inclut tous les éléments : texte, graphiques, cartes KPI, callouts
- [ ] La mise en page est professionnelle avec en-tête Decider et date
- [ ] Les graphiques sont rendus en haute résolution
- [ ] Le PDF est généré en un clic
- [ ] Le nom du fichier inclut le fonds et la date
