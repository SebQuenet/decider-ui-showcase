# 19 — Sécurité et vie privée

Fonctionnalités liées aux conversations temporaires, à la conformité RGPD, à la modération et au chiffrement.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Mistral Le Chat, DeepSeek, HuggingChat

---

### US-241 : Mode conversation temporaire `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir démarrer une conversation temporaire qui ne sera pas sauvegardée, afin d'échanger des informations sensibles sans laisser de trace.

**Critères d'acceptation** :
- [ ] Un toggle ou bouton "Conversation temporaire" est accessible avant ou pendant une conversation
- [ ] La conversation temporaire est clairement identifiée visuellement (badge, couleur)
- [ ] Aucune donnée de la conversation n'est persistée après la fermeture
- [ ] La conversation n'apparaît pas dans l'historique
- [ ] L'utilisateur est averti que la conversation sera perdue à la fermeture

---

### US-242 : Exclusion de l'entraînement du modèle `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir exclure mes conversations de l'entraînement du modèle IA, afin de protéger la confidentialité de mes échanges.

**Critères d'acceptation** :
- [ ] Un toggle dans les paramètres permet d'opt-out de l'entraînement
- [ ] Le choix est clairement expliqué avec les implications
- [ ] Le réglage est applicable rétroactivement aux conversations existantes
- [ ] Un indicateur montre le statut d'opt-out actif
- [ ] Le choix est respecté immédiatement sans délai

---

### US-243 : Export des données personnelles (RGPD) `P0`

**Description** : En tant qu'utilisateur européen, je veux pouvoir exporter toutes mes données personnelles, afin d'exercer mon droit de portabilité conformément au RGPD.

**Critères d'acceptation** :
- [ ] Un bouton d'export est accessible dans les paramètres de confidentialité
- [ ] L'export inclut toutes les conversations, fichiers, préférences et souvenirs
- [ ] Le format d'export est lisible (JSON, HTML ou combinaison)
- [ ] L'export est généré dans un délai raisonnable (max 24h pour les gros volumes)
- [ ] L'utilisateur est notifié quand l'export est prêt au téléchargement

---

### US-244 : Droit à l'effacement (RGPD) `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir demander la suppression de toutes mes données, afin d'exercer mon droit à l'oubli.

**Critères d'acceptation** :
- [ ] Une demande de suppression est initiable depuis les paramètres
- [ ] Les données supprimées incluent conversations, fichiers, mémoire, préférences et compte
- [ ] Une période de grâce permet d'annuler la demande (ex. 30 jours)
- [ ] La suppression est confirmée par email
- [ ] Les données sont effectivement supprimées des systèmes après la période de grâce

---

### US-245 : Modération automatique du contenu `P1`

**Description** : En tant qu'opérateur de la plateforme, je veux que le contenu soit automatiquement modéré, afin de prévenir les usages abusifs et protéger les utilisateurs.

**Critères d'acceptation** :
- [ ] Les requêtes contenant du contenu dangereux sont détectées et bloquées
- [ ] Un message clair explique pourquoi la requête a été refusée
- [ ] Les faux positifs sont minimisés pour ne pas gêner les usages légitimes
- [ ] L'utilisateur peut signaler une modération incorrecte
- [ ] Les catégories de modération sont configurables (violence, NSFW, illégal)

---

### US-246 : Signalement de contenu `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir signaler du contenu problématique généré par l'assistant, afin de contribuer à l'amélioration de la sécurité.

**Critères d'acceptation** :
- [ ] Un bouton "Signaler" est disponible sur chaque message de l'assistant
- [ ] Le formulaire de signalement propose des catégories (incorrect, dangereux, biaisé, offensant)
- [ ] Un champ de commentaire libre est disponible
- [ ] Le signalement est confirmé à l'utilisateur
- [ ] Le message signalé et son contexte sont envoyés pour revue

---

### US-247 : Chiffrement des données au repos `P1`

**Description** : En tant qu'utilisateur, je veux que mes données soient chiffrées au repos, afin de protéger mes conversations même en cas de compromission du stockage.

**Critères d'acceptation** :
- [ ] Toutes les données utilisateur sont chiffrées au repos (AES-256 ou équivalent)
- [ ] Les clés de chiffrement sont gérées de manière sécurisée
- [ ] Le chiffrement est transparent et n'impacte pas les performances perceptibles
- [ ] Les sauvegardes sont également chiffrées
- [ ] La politique de chiffrement est documentée et vérifiable

---

### US-248 : Chiffrement de bout en bout (optionnel) `P3`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir activer le chiffrement de bout en bout pour mes conversations, afin que même l'opérateur ne puisse pas lire mes messages.

**Critères d'acceptation** :
- [ ] Le chiffrement E2E est activable par conversation
- [ ] Les clés sont générées et stockées côté client uniquement
- [ ] Un indicateur clair montre quand le E2E est actif
- [ ] L'utilisateur est averti que la récupération est impossible sans la clé
- [ ] Les fonctionnalités dépendantes du serveur (recherche, mémoire) sont désactivées en mode E2E

---

### US-249 : Authentification multi-facteurs (MFA) `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir activer l'authentification à deux facteurs, afin de sécuriser l'accès à mon compte.

**Critères d'acceptation** :
- [ ] Le MFA est activable via les paramètres de sécurité
- [ ] Les méthodes supportées incluent TOTP (Google Authenticator) et WebAuthn/passkeys
- [ ] Des codes de récupération sont générés et affichés une seule fois
- [ ] Le MFA est demandé à chaque connexion depuis un nouvel appareil
- [ ] L'utilisateur peut désactiver le MFA avec une confirmation

---

### US-250 : Politique de rétention des données `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir configurer la durée de rétention de mes données, afin de décider combien de temps mes conversations sont conservées.

**Critères d'acceptation** :
- [ ] Des options de rétention sont proposées (indéfinie, 1 an, 6 mois, 3 mois, 1 mois)
- [ ] Les conversations au-delà de la période sont automatiquement supprimées
- [ ] Un avertissement est affiché avant la suppression automatique
- [ ] L'utilisateur peut exporter les conversations avant leur expiration
- [ ] Les conversations marquées comme favorites sont exemptées de la politique

---

### US-251 : Journal d'activité du compte `P2`

**Description** : En tant qu'utilisateur, je veux accéder à un journal des activités de mon compte, afin de détecter des activités suspectes.

**Critères d'acceptation** :
- [ ] Le journal liste les connexions, les changements de paramètres et les actions sensibles
- [ ] Chaque entrée affiche la date, l'heure, l'adresse IP et l'appareil
- [ ] Les activités inhabituelles sont mises en évidence
- [ ] Le journal est filtrable par type d'événement et par date
- [ ] Le journal couvre au minimum les 90 derniers jours

---

### US-252 : Watermark et traçabilité des contenus générés `P3`

**Description** : En tant qu'opérateur de la plateforme, je veux que les contenus générés (texte, images) incluent un watermark invisible, afin de pouvoir tracer leur origine en cas de mauvais usage.

**Critères d'acceptation** :
- [ ] Un watermark invisible est inclus dans les images générées
- [ ] Le texte généré peut être identifié par un algorithme de détection
- [ ] Le watermark ne dégrade pas la qualité perceptible du contenu
- [ ] L'utilisateur est informé de l'existence du watermark
- [ ] Le watermark résiste aux modifications courantes (recadrage, compression)
