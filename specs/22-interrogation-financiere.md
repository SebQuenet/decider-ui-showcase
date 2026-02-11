# 22 — Interrogation financière

Fonctionnalités liées à l'extraction d'informations financières à partir des data rooms, avec citations sourcées, métriques clés et analyse de documents.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv Workspace, PitchBook, Preqin

**Axe stratégique** : Performatif/Concurrentiel

> **Spécialise** : US-177 (Extraction de données structurées) — US-177 gère l'extraction générique (tableaux, listes, champs) ; ce fichier spécialise en extraction de term sheets, états financiers, métriques de fonds et données XBRL.

---

### US-283 : Extraction avec citation source et page `P0`

**Description** : En tant qu'analyste financier, je veux que chaque information extraite par l'assistant soit accompagnée de la source précise (document, page), afin de vérifier la traçabilité et l'exactitude des réponses.

**Critères d'acceptation** :
- [ ] Chaque fait cité dans la réponse est lié à un document source avec le numéro de page
- [ ] Les citations sont cliquables et ouvrent le document à la page concernée
- [ ] Le format de citation est normalisé (ex. : « Prospectus Fonds Alpha, p. 3 »)
- [ ] Plusieurs sources peuvent être citées pour un même fait
- [ ] L'absence de source est explicitement signalée quand l'assistant ne trouve pas de référence

---

### US-284 : Extraction de métriques clés `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir demander les métriques clés d'un fonds (TRI, multiple, volatilité, Sharpe, etc.) et obtenir une réponse structurée, afin de gagner du temps sur l'analyse préliminaire.

**Critères d'acceptation** :
- [ ] L'assistant reconnaît les métriques financières standards (TRI, TVPI, DPI, RVPI, Sharpe, volatilité, drawdown max)
- [ ] Les métriques sont présentées dans un format structuré (tableau ou liste)
- [ ] Chaque métrique est accompagnée de sa source et de la période concernée
- [ ] L'assistant signale quand une métrique n'est pas disponible dans la data room
- [ ] Les métriques numériques respectent le formatage financier (séparateurs de milliers, décimales)

---

### US-285 : Extraction de term sheets `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir extraire automatiquement les données clés d'une term sheet (taille du fonds, frais de gestion, carried interest, hurdle rate, etc.), afin de structurer rapidement les conditions d'investissement.

**Critères d'acceptation** :
- [ ] Les champs standards d'une term sheet sont extraits automatiquement (taille, frais, carry, hurdle, durée, période d'investissement)
- [ ] Les données sont présentées dans un tableau structuré
- [ ] L'utilisateur peut valider ou corriger chaque champ extrait
- [ ] Les données extraites sont exportables en CSV ou JSON
- [ ] L'extraction fonctionne sur les formats PDF et DOCX

---

### US-286 : Extraction d'états financiers `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir extraire les données des états financiers (bilan, compte de résultat, flux de trésorerie), afin de les analyser ou les comparer sans ressaisie manuelle.

**Critères d'acceptation** :
- [ ] Les trois états financiers principaux sont détectés et structurés (bilan, P&L, cash flow)
- [ ] Les postes comptables sont identifiés et normalisés
- [ ] Les valeurs sont extraites avec leur devise et leur période
- [ ] Les données multi-périodes sont présentées en colonnes comparatives
- [ ] Les totaux et sous-totaux sont vérifiés pour cohérence

---

### US-287 : Questions en langage naturel sur les documents `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir poser des questions complexes en langage naturel sur les documents de la data room, afin d'obtenir des réponses synthétiques sans avoir à parcourir les PDF.

**Critères d'acceptation** :
- [ ] L'assistant comprend les questions impliquant des calculs (ex. : « Quel est le ratio dette/EBITDA ? »)
- [ ] Les questions multi-documents sont supportées (ex. : « Résume les clauses de sortie dans tous les LPA »)
- [ ] L'assistant gère les questions conditionnelles (ex. : « Si le TRI est inférieur à 8 %, quelles sont les conséquences sur le carry ? »)
- [ ] Les réponses sont sourcées même pour des questions complexes
- [ ] L'assistant demande des clarifications quand la question est ambiguë

---

### US-288 : Résumé automatique d'un document financier `P1`

**Description** : En tant qu'analyste financier, je veux obtenir un résumé structuré de tout document de la data room, afin d'en comprendre le contenu essentiel en quelques secondes.

**Critères d'acceptation** :
- [ ] Le résumé est généré sur demande ou automatiquement à l'import
- [ ] Le format du résumé est adapté au type de document (prospectus → points clés, rapport annuel → faits saillants)
- [ ] Le résumé inclut les chiffres clés et les dates importantes
- [ ] La longueur du résumé est configurable (court, standard, détaillé)
- [ ] Le résumé est sourcé avec des liens vers les sections du document original

---

### US-289 : Snippet source avec surlignage `P0`

**Description** : En tant qu'analyste financier, je veux voir le passage exact du document source surligné quand l'assistant cite une information, afin de vérifier le contexte de la citation.

**Critères d'acceptation** :
- [ ] Un clic sur une citation affiche un extrait du document source dans un panneau latéral
- [ ] Le passage pertinent est surligné dans l'extrait
- [ ] Le contexte avant et après le passage est visible
- [ ] Un bouton permet d'ouvrir le document complet à la page concernée
- [ ] Le surlignage fonctionne pour le texte et les cellules de tableaux

---

### US-290 : Extraction de données XBRL `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant puisse parser et exploiter les données au format XBRL, afin d'interroger les rapports réglementaires dans un format structuré.

**Critères d'acceptation** :
- [ ] Les fichiers XBRL et iXBRL sont importables dans la data room
- [ ] Les taxonomies standards sont reconnues (IFRS, US GAAP, EBA)
- [ ] Les données sont accessibles en langage naturel comme pour les autres documents
- [ ] Les concepts XBRL sont traduits en termes financiers courants
- [ ] Les données extraites peuvent être exportées en tableau structuré

---

### US-291 : Historique des questions posées sur un fonds `P1`

**Description** : En tant qu'analyste financier, je veux consulter l'historique des questions posées sur un projet fonds, afin de retrouver des analyses précédentes et éviter les doublons.

**Critères d'acceptation** :
- [ ] L'historique est consultable depuis la fiche projet
- [ ] Chaque entrée affiche la question, la date et un aperçu de la réponse
- [ ] L'historique est filtrable par date et par mots-clés
- [ ] Un clic sur une entrée rouvre la conversation au message correspondant
- [ ] L'historique est partagé entre les utilisateurs ayant accès au projet

---

### US-292 : Extraction multi-langues `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir interroger des documents rédigés dans différentes langues et obtenir des réponses dans ma langue préférée, afin de traiter des data rooms internationales.

**Critères d'acceptation** :
- [ ] Les documents en anglais, français, allemand, espagnol et italien sont indexés correctement
- [ ] L'assistant répond dans la langue de l'utilisateur indépendamment de la langue des documents
- [ ] Les termes financiers techniques sont traduits avec précision
- [ ] Les citations sources restent dans la langue originale du document
- [ ] La langue détectée de chaque document est indiquée dans ses métadonnées

---

### US-293 : Extraction de covenants et clauses `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir extraire automatiquement les covenants financiers et les clauses clés des documents juridiques, afin de structurer rapidement les conditions contractuelles.

**Critères d'acceptation** :
- [ ] Les covenants financiers sont identifiés (ratio de couverture, leverage, DSCR, etc.)
- [ ] Les clauses clés sont extraites (distribution waterfall, key man, no fault divorce, clawback)
- [ ] Les seuils et conditions sont présentés dans un tableau structuré
- [ ] Les clauses similaires entre documents sont rapprochées automatiquement
- [ ] L'utilisateur peut annoter et commenter les clauses extraites

---

### US-294 : Calculs financiers à la volée `P2`

**Description** : En tant qu'analyste financier, je veux que l'assistant puisse effectuer des calculs financiers à partir des données extraites, afin d'obtenir des métriques dérivées sans quitter le chat.

**Critères d'acceptation** :
- [ ] L'assistant effectue des calculs courants (rendement annualisé, ratio dette/EBITDA, multiple d'investissement)
- [ ] Les formules utilisées sont affichées pour transparence
- [ ] Les données sources des calculs sont citées
- [ ] L'assistant signale les hypothèses prises quand des données manquent
- [ ] Les résultats sont formatés selon les conventions financières

---

### US-295 : Suggestions de questions pertinentes `P1`

**Description** : En tant qu'analyste financier, je veux que l'assistant me suggère des questions pertinentes à poser sur un fonds après chaque réponse, afin de guider mon analyse et ne pas oublier de points importants.

**Critères d'acceptation** :
- [ ] Des suggestions contextuelles sont affichées après chaque réponse
- [ ] Les suggestions sont adaptées au type de fonds et aux documents disponibles
- [ ] Les suggestions couvrent les dimensions clés (performance, risque, frais, gouvernance, stratégie)
- [ ] L'utilisateur peut masquer les suggestions s'il le souhaite
- [ ] Les suggestions s'affinent au fur et à mesure de la conversation

---

### US-296 : Détection de documents manquants `P0`

**Description** : En tant qu'analyste financier, je veux que l'assistant identifie les documents attendus mais absents de la data room, afin de compléter ma collecte d'informations.

**Critères d'acceptation** :
- [ ] L'assistant compare la data room à une checklist de documents standards pour le type de fonds
- [ ] Les documents manquants sont listés avec leur importance (critique, recommandé, optionnel)
- [ ] La détection est déclenchable manuellement ou proposée automatiquement après l'import
- [ ] La liste des documents manquants est exportable
- [ ] L'assistant explique pourquoi chaque document manquant est important pour l'analyse
