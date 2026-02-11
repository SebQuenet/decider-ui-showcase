# 26 — Génération de documents financiers

Fonctionnalités liées à la génération de rapports financiers types, au dialogue interactif pré-génération et aux templates de documents professionnels.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Morningstar Direct, eFront, Ekimetrics Radians

**Axe stratégique** : Vélocité

---

### US-337 : Dialogue interactif pré-génération `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant me pose des questions de clarification avant de générer un document, afin de produire un livrable adapté à mon besoin exact.

**Critères d'acceptation** :
- [ ] L'assistant identifie les paramètres manquants et pose des questions structurées (horizon, destinataire, sections à inclure)
- [ ] Les questions sont pertinentes et adaptées au type de document demandé
- [ ] L'utilisateur peut répondre en langage naturel à toutes les questions en une fois
- [ ] L'assistant confirme sa compréhension avant de lancer la génération
- [ ] L'utilisateur peut demander à ignorer les questions et générer avec les valeurs par défaut

---

### US-338 : Checklist intelligente pré-génération `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant affiche une checklist des informations disponibles et manquantes avant la génération d'un document, afin de savoir exactement ce qui sera couvert.

**Critères d'acceptation** :
- [ ] La checklist liste les sections du document avec le statut des données (disponible, partiel, manquant)
- [ ] Les sections avec données manquantes sont signalées avec une recommandation
- [ ] L'utilisateur peut cocher/décocher les sections à inclure
- [ ] La checklist est adaptée au type de document demandé
- [ ] L'assistant propose des alternatives quand des données sont manquantes (ex. : estimation, fourchette)

---

### US-339 : Génération de factsheet fonds `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir générer une factsheet synthétique d'un fonds (1-2 pages), afin de disposer d'un résumé standardisé pour la présentation du fonds.

**Critères d'acceptation** :
- [ ] La factsheet inclut : description du fonds, stratégie, métriques clés, performance historique, équipe de gestion
- [ ] Le format est standardisé et professionnel (1-2 pages)
- [ ] Les données sont extraites automatiquement de la data room
- [ ] Les graphiques pertinents (performance, répartition) sont intégrés
- [ ] La factsheet est téléchargeable en PDF

---

### US-340 : Génération de reporting investisseur `P0`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir générer un reporting périodique pour les investisseurs (LP report), afin de communiquer la performance et l'activité du fonds.

**Critères d'acceptation** :
- [ ] Le reporting inclut : résumé exécutif, performance (NAV, TRI, multiples), activité du portefeuille, perspectives
- [ ] La période du reporting est configurable (mensuel, trimestriel, annuel)
- [ ] Les graphiques de performance et de répartition sont générés automatiquement
- [ ] Le reporting est cohérent d'une période à l'autre (même structure, même métriques)
- [ ] Le document est téléchargeable en PDF et DOCX

---

### US-341 : Génération de mémo d'investissement `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer un mémo d'investissement structuré à partir de la data room, afin de présenter un dossier complet au comité d'investissement.

**Critères d'acceptation** :
- [ ] Le mémo inclut : thèse d'investissement, analyse financière, risques identifiés, termes proposés, recommandation
- [ ] La structure est conforme aux standards de l'industrie
- [ ] Les données sont sourcées avec renvoi aux documents de la data room
- [ ] L'assistant intègre les contradictions détectées si demandé
- [ ] Le document est modifiable après génération

---

### US-342 : Génération de note de synthèse `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer une note de synthèse comparant plusieurs fonds, afin de supporter une décision d'allocation.

**Critères d'acceptation** :
- [ ] La note inclut une comparaison structurée des fonds analysés
- [ ] Les tableaux comparatifs et graphiques sont intégrés automatiquement
- [ ] Les forces et faiblesses de chaque fonds sont identifiées
- [ ] La note reste factuelle ou inclut une recommandation selon le choix de l'utilisateur
- [ ] La synthèse est sourcée et traçable

---

### US-343 : Détection d'informations manquantes pour la génération `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant m'informe des informations manquantes nécessaires à la génération d'un document complet, afin de compléter la data room ou ajuster mes attentes.

**Critères d'acceptation** :
- [ ] L'assistant identifie les données manquantes par rapport au template du document demandé
- [ ] Chaque donnée manquante est décrite avec son importance (bloquante, optionnelle)
- [ ] L'assistant propose des alternatives (fourchette estimée, mention « non disponible »)
- [ ] L'utilisateur peut choisir de générer malgré les données manquantes
- [ ] La liste des données manquantes est exportable pour demande de compléments

---

### US-344 : Templates de documents personnalisables `P1`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir créer et sauvegarder des templates de documents avec ma propre structure et mes sections, afin de standardiser les livrables de mon équipe.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer un template en définissant les sections, leur ordre et leur contenu attendu
- [ ] Les templates sauvegardés sont réutilisables pour tout projet fonds
- [ ] Des templates par défaut sont fournis pour les types de documents courants
- [ ] Les templates sont partageables entre membres de l'équipe
- [ ] L'utilisateur peut modifier un template existant sans affecter les documents déjà générés

---

### US-345 : Génération de présentation PowerPoint `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir générer une présentation PowerPoint à partir de l'analyse d'un fonds, afin de disposer d'un support prêt pour un comité ou une réunion.

**Critères d'acceptation** :
- [ ] La présentation inclut les slides types : couverture, résumé, performance, risques, comparaison, recommandation
- [ ] Les graphiques et tableaux sont intégrés comme objets natifs PowerPoint
- [ ] Le template respecte le theming Decider
- [ ] Le nombre de slides est configurable (version courte ou détaillée)
- [ ] Le fichier PPTX est téléchargeable et éditable

---

### US-346 : Génération de questionnaire de due diligence `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer un questionnaire de due diligence pré-rempli à partir de la data room, afin d'identifier les points à clarifier avec le gestionnaire du fonds.

**Critères d'acceptation** :
- [ ] Le questionnaire est basé sur les standards ILPA ou un template personnalisé
- [ ] Les questions dont la réponse est déjà dans la data room sont pré-remplies avec source
- [ ] Les questions sans réponse sont mises en évidence
- [ ] L'utilisateur peut ajouter ou retirer des questions
- [ ] Le questionnaire est exportable en DOCX ou PDF

---

### US-347 : Versionnage des documents générés `P2`

**Description** : En tant qu'analyste financier, je veux que chaque document généré soit versionné et que les versions précédentes restent accessibles, afin de suivre l'évolution de mes analyses.

**Critères d'acceptation** :
- [ ] Chaque génération crée une nouvelle version numérotée
- [ ] Les versions précédentes sont listées avec date et paramètres de génération
- [ ] Un diff entre deux versions est disponible
- [ ] L'utilisateur peut restaurer une version précédente
- [ ] L'historique des versions est consultable depuis la fiche projet

---

### US-348 : Intégration des graphiques dans les documents `P1`

**Description** : En tant qu'analyste financier, je veux que les graphiques générés pendant l'analyse soient automatiquement intégrés dans les documents générés, afin d'obtenir des rapports visuellement complets.

**Critères d'acceptation** :
- [ ] Les graphiques créés pendant la conversation sont proposés pour intégration dans le document
- [ ] L'assistant sélectionne les graphiques pertinents en fonction du type de document
- [ ] Les graphiques sont insérés en haute résolution avec légende et source
- [ ] L'utilisateur peut choisir quels graphiques inclure ou exclure
- [ ] Le positionnement des graphiques dans le document est cohérent avec la mise en page

---

### US-349 : Personnalisation du ton et du style `P2`

**Description** : En tant que gestionnaire de fonds, je veux pouvoir choisir le ton et le style du document généré (formel, synthétique, analytique), afin de l'adapter au destinataire.

**Critères d'acceptation** :
- [ ] Des presets de style sont disponibles : formel institutionnel, synthétique exécutif, analytique détaillé
- [ ] Le style influence la longueur, le vocabulaire et le niveau de détail
- [ ] L'utilisateur peut définir un style par défaut dans ses préférences
- [ ] Le style est sélectionnable pendant le dialogue pré-génération
- [ ] Un aperçu du style est disponible avant la génération

---

### US-350 : Section dédiée aux risques `P1`

**Description** : En tant qu'analyste financier, je veux que les documents générés incluent une section structurée sur les risques identifiés, afin de documenter les facteurs de risque pour le comité d'investissement.

**Critères d'acceptation** :
- [ ] Les risques sont catégorisés : marché, crédit, liquidité, opérationnel, réglementaire, key man
- [ ] Chaque risque est décrit avec son impact potentiel et sa probabilité
- [ ] Les risques sont classés par ordre de priorité
- [ ] Les mitigants identifiés dans la data room sont associés à chaque risque
- [ ] La section inclut les contradictions détectées comme facteur de risque additionnel

---

### US-351 : Génération de comparatif de fonds `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir générer un document comparatif de plusieurs fonds, afin de présenter les options à un comité d'investissement.

**Critères d'acceptation** :
- [ ] Le document compare 2 à 5 fonds sur les dimensions clés (performance, risque, frais, stratégie, équipe)
- [ ] Les tableaux comparatifs et graphiques sont intégrés
- [ ] Les forces et faiblesses relatives sont identifiées
- [ ] Le document inclut un résumé exécutif avec les points saillants de la comparaison
- [ ] Le document est sourcé avec renvoi aux data rooms respectives

---

### US-352 : Export multi-format `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir exporter tout document généré en PDF, DOCX et PPTX, afin de l'intégrer dans mes workflows existants.

**Critères d'acceptation** :
- [ ] L'export est disponible en PDF, DOCX et PPTX pour chaque document généré
- [ ] La mise en forme est fidèle au rendu écran dans chaque format
- [ ] Le document exporté inclut les métadonnées (auteur, date, projet, version)
- [ ] L'export est accessible en un clic depuis le bouton de téléchargement
- [ ] Les graphiques sont intégrés comme objets natifs dans chaque format
