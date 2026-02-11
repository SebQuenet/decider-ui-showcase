# 19b — Anonymisation

Fonctionnalités d'anonymisation des données sensibles, couvrant deux briques : l'anonymisation pipeline (à la volée, avant chaque appel LLM) et l'anonymisation outil (standalone, pour les exports et partages).

**Plateformes de référence** : Decider.ai, Microsoft Presidio, AWS Comprehend PII, Google DLP, Privafy, Private AI

> **Étend** : US-360 (Classification des données sensibles, fichier 27) qui détecte et tagge les PII sans les anonymiser. Ce fichier ajoute les mécanismes de substitution, de réversibilité et de contrôle utilisateur.

---

### US-441 : Anonymisation pipeline avant appel LLM `P0`

**Description** : En tant qu'administrateur, je veux que les données sensibles (noms, montants, IBAN, adresses) soient automatiquement remplacées par des tokens neutres avant chaque envoi au LLM, afin de garantir qu'aucune donnée identifiable ne quitte l'infrastructure sécurisée.

**Critères d'acceptation** :
- [ ] Les PII détectées (noms de personnes, sociétés, adresses, IBAN, numéros d'identification) sont remplacées par des tokens neutres avant l'appel API
- [ ] La substitution est transparente pour l'utilisateur (il ne voit pas les tokens)
- [ ] La réponse du LLM est dé-anonymisée automatiquement en restituant les valeurs originales
- [ ] Le mapping token ↔ valeur réelle est stocké exclusivement côté infrastructure sécurisée, jamais envoyé au LLM
- [ ] L'anonymisation pipeline est activée par défaut en mode cloud et désactivable en mode on-premise

---

### US-442 : Configuration des règles d'anonymisation pipeline `P1`

**Description** : En tant qu'administrateur, je veux pouvoir configurer les types de données anonymisées dans le pipeline (noms, montants, dates, IBAN, etc.), afin d'adapter le niveau de protection au contexte réglementaire.

**Critères d'acceptation** :
- [ ] Les types de PII sont configurables individuellement : noms de personnes, noms de sociétés, montants, dates, IBAN, numéros d'identification, adresses
- [ ] Des profils d'anonymisation prédéfinis sont disponibles (minimal, standard, strict)
- [ ] L'administrateur peut créer des profils personnalisés
- [ ] Les entités à exclure de l'anonymisation sont configurables (ex. : noms de fonds connus)
- [ ] Les modifications de configuration sont tracées dans le journal d'audit

---

### US-443 : Anonymisation cohérente intra-session `P0`

**Description** : En tant qu'analyste financier, je veux que la même entité soit toujours remplacée par le même token au sein d'une conversation, afin que le LLM puisse raisonner de manière cohérente sur les données anonymisées.

**Critères d'acceptation** :
- [ ] Le même nom de personne est toujours remplacé par le même pseudonyme dans la même conversation
- [ ] Le même nom de société est remplacé par le même token tout au long de la session
- [ ] Les relations entre entités sont préservées après anonymisation (ex. : « X est le gérant de Y » reste cohérent)
- [ ] Le mapping est maintenu pendant toute la durée de la conversation
- [ ] Le mapping est détruit à la fin de la session (ou archivé selon la politique de rétention)

---

### US-444 : Prévisualisation de l'anonymisation pipeline `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir visualiser ce que le LLM reçoit réellement après anonymisation, afin de vérifier que le contexte reste compréhensible et que l'anonymisation est correcte.

**Critères d'acceptation** :
- [ ] Un mode « debug anonymisation » est activable dans les paramètres développeur
- [ ] Ce mode affiche côte à côte le message original et le message anonymisé envoyé au LLM
- [ ] Les tokens de substitution sont surlignés avec un code couleur par type (personne, société, montant)
- [ ] Ce mode est réservé aux administrateurs et aux utilisateurs autorisés
- [ ] Les données prévisualisées ne sont pas loggées

---

### US-445 : Anonymisation d'un document (outil standalone) `P0`

**Description** : En tant qu'analyste financier, je veux pouvoir anonymiser un document de la data room avant de le partager en externe, afin de protéger les données confidentielles tout en permettant l'analyse par des tiers.

**Critères d'acceptation** :
- [ ] L'utilisateur peut sélectionner un document et lancer l'anonymisation
- [ ] Les entités détectées sont listées avec leur type et une proposition de remplacement
- [ ] L'utilisateur peut valider, modifier ou exclure chaque substitution avant application
- [ ] Le document anonymisé est généré comme un nouveau fichier (l'original est préservé)
- [ ] Le mapping d'anonymisation est conservé pour permettre la dé-anonymisation par les utilisateurs autorisés

---

### US-446 : Anonymisation sélective par type d'entité `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir choisir quels types de données anonymiser dans un document (ex. : anonymiser les noms mais garder les montants), afin d'adapter le niveau de protection au destinataire.

**Critères d'acceptation** :
- [ ] Chaque type d'entité est activable/désactivable individuellement pour l'anonymisation
- [ ] Un aperçu temps réel montre le résultat au fur et à mesure des choix
- [ ] Les profils de sélection sont sauvegardables et réutilisables
- [ ] L'utilisateur peut traiter des entités individuelles comme exceptions (garder un nom précis visible)
- [ ] Le choix de sélection est documenté dans les métadonnées du document anonymisé

---

### US-447 : Anonymisation des réponses de l'assistant `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir anonymiser à la volée les réponses de l'assistant avant de les copier ou exporter, afin de partager des analyses sans exposer les données confidentielles.

**Critères d'acceptation** :
- [ ] Un bouton « Copier anonymisé » est disponible sur chaque réponse de l'assistant
- [ ] Les entités sensibles sont remplacées dans le texte copié selon les règles configurées
- [ ] L'export d'une conversation peut être anonymisé en un clic
- [ ] Les graphiques exportés anonymisent les légendes et labels contenant des données sensibles
- [ ] L'utilisateur est averti si des données potentiellement sensibles n'ont pas pu être anonymisées

---

### US-448 : Dé-anonymisation contrôlée `P2`

**Description** : En tant qu'administrateur, je veux pouvoir dé-anonymiser un document ou une conversation anonymisée, afin de restaurer les données originales quand c'est nécessaire (audit, vérification).

**Critères d'acceptation** :
- [ ] La dé-anonymisation requiert les droits administrateur
- [ ] Le mapping d'anonymisation est stocké de manière sécurisée et chiffrée
- [ ] La dé-anonymisation est traçée dans le journal d'audit (qui, quand, pourquoi)
- [ ] La dé-anonymisation peut être partielle (restaurer certaines entités seulement)
- [ ] Le mapping expire selon la politique de rétention configurée

---

### US-449 : Rapport d'anonymisation `P1`

**Description** : En tant qu'administrateur, je veux disposer d'un rapport montrant les statistiques d'anonymisation (nombre d'entités traitées, types, faux positifs signalés), afin de contrôler l'efficacité du système.

**Critères d'acceptation** :
- [ ] Le rapport affiche le nombre d'entités anonymisées par type et par période
- [ ] Les faux positifs signalés par les utilisateurs sont comptabilisés
- [ ] Le taux de détection est estimé par type d'entité
- [ ] Le rapport est exportable en CSV
- [ ] Les tendances sont visualisées sur un graphique temporel

---

### US-450 : Anonymisation des documents générés `P1`

**Description** : En tant qu'analyste financier, je veux que les documents générés par l'assistant (factsheets, reportings, mémos) puissent être exportés en version anonymisée, afin de les diffuser à des destinataires externes.

**Critères d'acceptation** :
- [ ] L'option « Exporter anonymisé » est disponible à côté de l'export standard
- [ ] Les règles d'anonymisation du projet sont appliquées automatiquement
- [ ] L'utilisateur peut ajuster les substitutions avant l'export final
- [ ] Le document anonymisé porte un watermark ou une mention indiquant qu'il est anonymisé
- [ ] Les graphiques inclus dans le document sont anonymisés (labels, légendes, tooltips)
