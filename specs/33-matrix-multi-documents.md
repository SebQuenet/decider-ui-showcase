# 33 — Matrix multi-documents

Interface tabulaire inspirée de Hebbia Matrix : l'IA décompose une question complexe en sous-requêtes parallèles exécutées sur N documents, et remplit une grille en temps réel.

**Plateformes de référence** : Hebbia Matrix, AlphaSense, DiligenceVault

**Axe stratégique** : Différenciant fort / Paradigme alternatif au chat linéaire

> **Complémente** : US-283+ (Interrogation financière) et US-297+ (Comparaison cross-fonds) — la Matrix offre un paradigme tabulaire pour les mêmes besoins d'extraction cross-documents, là où le chat reste linéaire.

---

### US-451 : Grille Matrix vide avec sélection de documents `P0`

**Description** : En tant qu'analyste financier, je veux créer une grille Matrix en sélectionnant les documents à analyser (un par colonne), afin de structurer mon analyse cross-documents.

**Critères d'acceptation** :
- [ ] L'utilisateur sélectionne 2 à 10 documents depuis la data room
- [ ] Chaque document devient une colonne de la grille
- [ ] Le nom du document et son type sont affichés dans l'en-tête de colonne
- [ ] Les colonnes sont réordonnables par drag-and-drop
- [ ] L'utilisateur peut ajouter ou retirer des documents après la création

---

### US-452 : Ajout de questions en lignes `P0`

**Description** : En tant qu'analyste financier, je veux ajouter des questions en tant que lignes de la grille, afin de structurer les informations que je cherche à extraire.

**Critères d'acceptation** :
- [ ] L'utilisateur saisit une question en langage naturel (ex. "Quel est l'IRR net ?")
- [ ] La question devient une nouvelle ligne de la grille
- [ ] Des suggestions de questions sont proposées en fonction du type de documents sélectionnés
- [ ] L'utilisateur peut réordonner, modifier ou supprimer les questions
- [ ] Un bouton « Ajouter les questions standard » pré-remplit les métriques PE classiques (IRR, TVPI, DPI, etc.)

---

### US-453 : Remplissage automatique des cellules par l'IA `P0`

**Description** : En tant qu'analyste financier, je veux que l'IA remplisse automatiquement chaque cellule de la grille en extrayant la réponse du document correspondant, afin d'obtenir une vue comparative instantanée.

**Critères d'acceptation** :
- [ ] Dès qu'une question est ajoutée, l'IA lance l'extraction en parallèle sur tous les documents
- [ ] Chaque cellule affiche un état de chargement (shimmer) pendant l'extraction
- [ ] La réponse extraite est affichée dans la cellule avec un indicateur de confiance (haute/moyenne/basse)
- [ ] En cas d'information non trouvée, la cellule affiche "Non disponible" avec un style distinct
- [ ] Le temps d'extraction total est affiché dans un compteur

---

### US-454 : Citation source par cellule `P0`

**Description** : En tant qu'analyste financier, je veux que chaque cellule remplie par l'IA soit traçable jusqu'au passage exact du document source, afin de vérifier la fiabilité de l'extraction.

**Critères d'acceptation** :
- [ ] Chaque cellule affiche une icône de citation cliquable
- [ ] Au clic, un popover affiche l'extrait exact du document source avec le numéro de page
- [ ] Le passage pertinent est surligné dans l'extrait
- [ ] L'utilisateur peut naviguer vers le document complet depuis le popover

---

### US-455 : Détection de divergences dans la grille `P1`

**Description** : En tant qu'analyste financier, je veux que la grille surligne automatiquement les divergences significatives entre les valeurs extraites des différents documents, afin d'identifier rapidement les incohérences.

**Critères d'acceptation** :
- [ ] Les cellules d'une même ligne dont les valeurs divergent significativement sont surlignées en orange/rouge
- [ ] Le seuil de divergence est configurable (ex. > 5% d'écart)
- [ ] Un tooltip explique la nature de la divergence
- [ ] Un compteur de divergences est affiché en haut de la grille
- [ ] L'utilisateur peut filtrer pour n'afficher que les lignes avec divergences

---

### US-456 : Templates de questions par type d'analyse `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir appliquer un template de questions pré-configuré (Due Diligence, Term Sheet, Performance Review), afin de démarrer rapidement une analyse structurée.

**Critères d'acceptation** :
- [ ] Au moins 3 templates sont disponibles : Due Diligence (15+ questions), Term Sheet (10+ questions), Performance Review (10+ questions)
- [ ] L'application d'un template pré-remplit les lignes de la grille
- [ ] L'utilisateur peut personnaliser un template après application
- [ ] Les templates sont accessibles depuis un menu dédié
- [ ] L'utilisateur peut sauvegarder ses propres templates

---

### US-457 : Export de la grille `P1`

**Description** : En tant qu'analyste financier, je veux exporter la grille Matrix complète en format tableur, afin de l'intégrer dans mes outils de reporting.

**Critères d'acceptation** :
- [ ] L'export est disponible en CSV et Excel
- [ ] Toutes les valeurs, sources et indicateurs de confiance sont inclus
- [ ] Les en-têtes de colonnes (noms de documents) et de lignes (questions) sont conservés
- [ ] L'export est accessible en un clic

---

### US-458 : Question de suivi sur une cellule `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir poser une question de suivi sur une cellule spécifique de la grille (ex. "Développe cette réponse"), afin d'approfondir un point sans quitter la vue Matrix.

**Critères d'acceptation** :
- [ ] Un clic droit ou un bouton sur une cellule ouvre un mini-chat contextuel
- [ ] La question de suivi est envoyée avec le contexte du document et de la question initiale
- [ ] La réponse peut remplacer le contenu de la cellule ou s'ajouter en note
- [ ] L'historique des échanges sur une cellule est conservé
