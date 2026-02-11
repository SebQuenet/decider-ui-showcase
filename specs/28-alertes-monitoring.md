# 28 — Alertes & Monitoring

Fonctionnalités liées aux alertes de variation NAV, aux seuils configurables, aux événements marché et au briefing automatique pour le suivi de fonds.

**Plateformes de référence** : Decider.ai, Bloomberg Terminal, Refinitiv Workspace, Morningstar Direct, Preqin

**Axe stratégique** : Vélocité

---

### US-367 : Alertes de variation NAV `P1`

**Description** : En tant qu'analyste financier, je veux recevoir une alerte quand la NAV d'un fonds suivi varie au-delà d'un seuil défini, afin de réagir rapidement à un événement de valorisation.

**Critères d'acceptation** :
- [ ] Le seuil de variation est configurable par fonds (ex. : ± 5 %)
- [ ] L'alerte est envoyée en temps réel quand une nouvelle NAV est importée et dépasse le seuil
- [ ] L'alerte affiche la NAV précédente, la nouvelle NAV et la variation
- [ ] L'alerte est cliquable et ouvre le détail du fonds concerné
- [ ] L'historique des alertes déclenchées est consultable

---

### US-368 : Alertes de dépassement de seuil `P1`

**Description** : En tant qu'analyste financier, je veux pouvoir définir des seuils d'alerte sur n'importe quelle métrique financière, afin d'être notifié quand une valeur critique est atteinte.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer des alertes sur toute métrique disponible (TRI, volatilité, drawdown, etc.)
- [ ] Les conditions supportées sont : supérieur à, inférieur à, variation de plus de X %
- [ ] Chaque alerte est associée à un fonds et une métrique spécifiques
- [ ] Les alertes actives sont listées dans un tableau de bord dédié
- [ ] L'utilisateur peut activer, désactiver ou supprimer ses alertes

---

### US-369 : Alertes d'événements marché `P2`

**Description** : En tant qu'analyste financier, je veux recevoir des alertes quand un événement de marché significatif impacte les secteurs ou géographies de mes fonds, afin de contextualiser mes analyses.

**Critères d'acceptation** :
- [ ] Les événements sont détectés via les flux de presse et de données connectés
- [ ] Les alertes sont filtrées par pertinence avec les fonds suivis (secteur, géographie, contreparties)
- [ ] Chaque alerte résume l'événement et son impact potentiel
- [ ] L'alerte inclut un lien vers la source d'information
- [ ] La fréquence des alertes est configurable pour éviter le bruit

---

### US-370 : Briefing matinal automatique `P1`

**Description** : En tant qu'analyste financier, je veux recevoir un briefing quotidien synthétisant les événements pertinents de la nuit concernant mes fonds suivis, afin de démarrer ma journée informé.

**Critères d'acceptation** :
- [ ] Le briefing est généré automatiquement chaque matin à une heure configurable
- [ ] Le contenu couvre : variations de NAV, événements marché, nouvelles presse, alertes déclenchées
- [ ] Le briefing est personnalisé en fonction des fonds et secteurs suivis par l'utilisateur
- [ ] Le format est synthétique (bullet points avec liens vers les détails)
- [ ] Le briefing est consultable dans le chat ou envoyé par email

---

### US-371 : Monitoring de la presse sectorielle `P2`

**Description** : En tant qu'analyste financier, je veux que le système surveille en continu la presse financière pour détecter les articles mentionnant mes fonds ou leurs contreparties, afin de rester informé sans effort de veille manuelle.

**Critères d'acceptation** :
- [ ] Les sources de presse configurées sont surveillées en continu
- [ ] Les articles mentionnant les entités de mes data rooms sont identifiés
- [ ] Un résumé de chaque article pertinent est disponible
- [ ] Les articles sont croisés avec les données de la data room pour détecter d'éventuelles contradictions
- [ ] L'historique des articles détectés est consultable

---

### US-372 : Alertes de mise à jour de data room `P1`

**Description** : En tant qu'analyste financier, je veux être notifié quand un collaborateur ajoute ou modifie des documents dans un projet partagé, afin de rester synchronisé avec l'état de la data room.

**Critères d'acceptation** :
- [ ] Une notification est envoyée à chaque ajout, modification ou suppression de document
- [ ] La notification précise le document concerné et l'auteur de la modification
- [ ] Les notifications sont regroupées si plusieurs modifications interviennent en peu de temps
- [ ] L'utilisateur peut configurer ses préférences de notification par projet
- [ ] Un fil d'activité par projet liste toutes les modifications récentes

---

### US-373 : Configuration des seuils d'alerte `P1`

**Description** : En tant qu'analyste financier, je veux disposer d'une interface dédiée pour configurer et gérer tous mes seuils d'alerte, afin de centraliser le paramétrage de ma veille.

**Critères d'acceptation** :
- [ ] Une page de paramètres liste toutes les alertes configurées par l'utilisateur
- [ ] Chaque alerte affiche son statut (active, désactivée), son seuil et le fonds associé
- [ ] La création d'une nouvelle alerte est guidée (choix du fonds, de la métrique, du seuil)
- [ ] Les alertes peuvent être dupliquées pour les appliquer à d'autres fonds
- [ ] Un test permet de vérifier que l'alerte se déclencherait sur les données actuelles

---

### US-374 : Digest hebdomadaire automatique `P2`

**Description** : En tant qu'analyste financier, je veux recevoir un digest hebdomadaire récapitulant les événements clés de la semaine sur mes fonds suivis, afin de garder une vue d'ensemble sans suivi quotidien.

**Critères d'acceptation** :
- [ ] Le digest est généré automatiquement chaque semaine à un jour configurable
- [ ] Le contenu couvre : alertes déclenchées, mouvements de NAV, événements marché, modifications de data rooms
- [ ] Le digest est personnalisé en fonction du portefeuille de l'utilisateur
- [ ] Le format est concis avec des liens vers les détails
- [ ] Le digest est consultable dans l'interface et envoyable par email

---

### US-375 : Alertes sur les échéances contractuelles `P1`

**Description** : En tant que gestionnaire de fonds, je veux recevoir des alertes avant les échéances contractuelles clés (fin de période d'investissement, extension, appels de capitaux), afin de ne manquer aucun délai.

**Critères d'acceptation** :
- [ ] Les échéances sont extraites automatiquement des documents de la data room (LPA, side letters)
- [ ] Les alertes sont envoyées à J-30, J-7 et J-1 avant chaque échéance
- [ ] L'alerte affiche le contexte de l'échéance et les actions requises
- [ ] Les échéances sont listées dans un calendrier dédié
- [ ] L'utilisateur peut ajouter des échéances manuellement

---

### US-376 : Canal de notification configurable `P2`

**Description** : En tant qu'analyste financier, je veux pouvoir choisir le canal de réception de mes alertes (in-app, email, Slack, Teams), afin de les intégrer dans mes outils de communication habituels.

**Critères d'acceptation** :
- [ ] Les canaux disponibles sont : notification in-app, email, webhook
- [ ] Chaque alerte peut être associée à un ou plusieurs canaux
- [ ] L'intégration email est fonctionnelle sans configuration complexe
- [ ] Le webhook permet l'intégration avec Slack, Teams ou tout autre outil
- [ ] Les préférences de canal sont configurables globalement et par alerte

---

### US-377 : Tableau de bord des alertes `P1`

**Description** : En tant qu'analyste financier, je veux disposer d'un tableau de bord centralisant toutes mes alertes actives et leur historique, afin de suivre ma veille en un coup d'œil.

**Critères d'acceptation** :
- [ ] Le tableau de bord affiche les alertes récentes triées par date
- [ ] Les alertes non lues sont mises en évidence
- [ ] Un filtre par type (NAV, seuil, marché, data room) est disponible
- [ ] Les statistiques d'alertes sont affichées (nombre par semaine, par type)
- [ ] Le tableau de bord est accessible depuis le menu principal

---

### US-378 : Alertes de changement réglementaire `P2`

**Description** : En tant que gestionnaire de fonds, je veux recevoir des alertes quand un changement réglementaire impactant mes fonds est détecté, afin d'anticiper les ajustements nécessaires.

**Critères d'acceptation** :
- [ ] Les évolutions réglementaires pertinentes sont détectées via les sources connectées
- [ ] L'alerte résume le changement et son impact potentiel sur les fonds concernés
- [ ] Les réglementations surveillées sont configurables (AMF, FCA, AIFMD, ESMA)
- [ ] L'alerte inclut un lien vers le texte réglementaire source
- [ ] L'historique des changements réglementaires est consultable
