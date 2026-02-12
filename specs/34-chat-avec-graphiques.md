# 34 — Chat avec les graphiques

Interface conversationnelle où l'utilisateur peut interroger les graphiques affichés en langage naturel. L'IA contextualise ses réponses en fonction de la visualisation sélectionnée.

**Plateformes de référence** : Julius AI, ChartPixel, OpenBB Workspace, vizGPT

**Axe stratégique** : Différenciant fort / Analytics conversationnel

> **Enrichit** : US-309+ (Dataviz financière) — les graphiques existants deviennent interrogeables. Ce fichier ajoute la couche d'interaction conversationnelle sur les visualisations.

---

### US-459 : Sélection d'un graphique comme contexte de conversation `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir sélectionner un graphique affiché dans le chat pour le définir comme contexte de ma prochaine question, afin que l'IA comprenne de quelle visualisation je parle.

**Critères d'acceptation** :
- [ ] Un clic sur un graphique dans le chat le met en surbrillance (bordure accent)
- [ ] Le graphique sélectionné est affiché en miniature au-dessus de la zone de saisie
- [ ] L'utilisateur peut désélectionner le graphique en cliquant à nouveau ou via un bouton ✕
- [ ] Les données sous-jacentes du graphique sont automatiquement transmises comme contexte à l'IA
- [ ] Un indicateur visuel confirme que le mode "Chat avec graphique" est actif

---

### US-460 : Questions en langage naturel sur un graphique `P0`

**Description** : En tant qu'analyste financier, je veux poser des questions en langage naturel sur un graphique sélectionné (ex. "Pourquoi la baisse en Q3 ?"), afin d'obtenir une analyse contextuelle.

**Critères d'acceptation** :
- [ ] L'IA répond en tenant compte des données affichées dans le graphique
- [ ] La réponse peut référencer des points de données spécifiques (dates, valeurs)
- [ ] Des suggestions de questions pertinentes sont affichées sous le graphique sélectionné
- [ ] La réponse peut inclure des annotations visuelles sur le graphique (surlignage de zones)
- [ ] Les réponses mentionnent les données quantitatives exactes extraites du graphique

---

### US-461 : Annotations IA sur les graphiques `P0`

**Description** : En tant qu'analyste financier, je veux que l'IA puisse annoter visuellement un graphique en réponse à ma question (cercler une zone, tracer une tendance), afin de mieux comprendre son analyse.

**Critères d'acceptation** :
- [ ] L'IA peut surligner une zone spécifique du graphique (rectangle semi-transparent)
- [ ] L'IA peut ajouter des marqueurs sur des points de données spécifiques
- [ ] L'IA peut tracer des lignes de tendance ou des seuils visuels
- [ ] Les annotations sont animées (apparition progressive)
- [ ] L'utilisateur peut masquer les annotations

---

### US-462 : Transformation de graphique par commande `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir demander à l'IA de transformer un graphique (ex. "Montre ça en barres plutôt qu'en courbe", "Ajoute le fonds Beta"), afin d'explorer les données sous différents angles.

**Critères d'acceptation** :
- [ ] L'IA comprend les commandes de transformation : changer le type de graphique, ajouter/retirer des séries, modifier la période
- [ ] Le graphique est mis à jour avec une animation de transition fluide
- [ ] L'état précédent est conservé pour permettre un undo
- [ ] Les transformations supportées sont suggérées dans le menu contextuel du graphique

---

### US-463 : Drill-down conversationnel `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir demander à l'IA de "zoomer" sur une portion du graphique pour obtenir plus de détails, afin d'approfondir mon analyse.

**Critères d'acceptation** :
- [ ] L'utilisateur peut demander "Zoom sur Q3 2024" ou cliquer-glisser pour sélectionner une zone
- [ ] Le graphique s'anime pour zoomer sur la période sélectionnée
- [ ] Des données supplémentaires (granularité plus fine) sont affichées dans la vue zoomée
- [ ] Un bouton "Revenir à la vue complète" permet de dézoomer
- [ ] L'IA adapte son analyse au niveau de zoom courant

---

### US-464 : Comparaison conversationnelle `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir demander "Compare ce graphique avec le fonds X" et obtenir un graphique comparatif généré par l'IA, afin de faciliter l'analyse relative.

**Critères d'acceptation** :
- [ ] L'IA génère un nouveau graphique comparatif en réponse
- [ ] Les deux séries sont normalisées si nécessaire (base 100)
- [ ] Les points de divergence significative sont annotés automatiquement
- [ ] L'IA commente les principales différences dans sa réponse textuelle

---

### US-465 : Suggestions contextuelles sous chaque graphique `P0`

**Description** : En tant qu'analyste financier, je veux que des suggestions de questions pertinentes soient affichées sous chaque graphique, afin de guider mon exploration analytique.

**Critères d'acceptation** :
- [ ] 3 à 5 suggestions sont affichées sous chaque graphique sous forme de chips cliquables
- [ ] Les suggestions sont contextuelles (adaptées au type de graphique et aux données affichées)
- [ ] Un clic sur une suggestion envoie la question et sélectionne le graphique comme contexte
- [ ] Les suggestions changent après chaque interaction (pas de répétition)
