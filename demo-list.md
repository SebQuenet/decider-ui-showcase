## PHASE 1 — Setup & Import

### Étape 1.1 — Connexion

> *Le présentateur ouvre l'interface Decider dans le navigateur.*
> 

**Narration** : « Decider est accessible depuis n'importe quel navigateur, hébergé sur un cloud sécurisé. Il peut etre hebergé sur un cloud Amazon (le moins cher), SOC2, ou sur site. Je me connecte avec mes identifiants.  »

**Écran** : Page de login → Dashboard vide (ou avec quelques projets existants).

---

### Étape 1.2 — Import de la première data room

**Action** : Le présentateur clique sur « Nouveau projet » ou « Importer une data room ». Il sélectionne les fichiers de la Data Room 1 (Fonds Alpha).

**Écran** : Barre de progression de l'import → Le projet « Fonds Alpha » apparaît automatiquement dans le dashboard.

**Narration** : « J'importe ma première data room. Decider crée automatiquement un projet. Je n'ai rien à configurer — pas de tags, pas de classement à faire, tout est indexé automatiquement. »

---

### Étape 1.3 — Import de la deuxième data room

**Action** : Même manipulation. Import de la Data Room 2 (Fonds Beta).

**Écran** : Un deuxième projet « Fonds Beta » apparaît dans le dashboard. Les deux projets sont visibles côte à côte.

**Narration** : « Je fais la même chose avec une deuxième data room. Maintenant j'ai deux projets. Et par défaut, je peux aussi sélectionner "Tous les projets" pour interroger l'ensemble de mes données en même temps. »

**Point clé** : Montrer le sélecteur de projets (Fonds Alpha / Fonds Beta / Tous les projets).

---

## PHASE 2 — Interrogation

> *Le présentateur ouvre le chatbot. Le sélecteur est sur « Tous les projets ».*
> 

**Narration** : « Maintenant, je vais interroger mes data rooms. Je suis en mode "Tous les projets", donc Decider va chercher dans les deux fonds à la fois. »

---

### Q1 — Extraction

**User** : « Quelle est la date de création du fonds Alpha ? »

**Decider** : Répond avec la date précise, en citant le document source (ex. : *Prospectus Fonds Alpha, page 3*).

**Narration** : « Première question : une extraction simple. Decider retrouve l'information en quelques secondes et me montre exactement d'où elle vient. Pas d'approximation, pas d'hallucination — c'est sourcé. Liste des sources dépliables s’inspirer d’un LLM »

**Ce qu'on démontre** : Rapidité, traçabilité, zéro latence.

---

### Q2 — Comparaison

**User** : « Quel est le fonds qui a le plus gros track record ? »

**Decider** : Compare les deux fonds, affiche les track records respectifs (années d'existence, historique de performance), et désigne le fonds avec le plus long historique. 
Sources citées pour chaque donnée (snipet)

**Narration** : « Là, c'est une question qui nécessite de croiser les deux data rooms. Decider compare automatiquement et me donne une réponse argumentée. Essayez de faire ça manuellement en ouvrant 50 PDFs dans deux data rooms différentes… »

**Ce qu'on démontre** : Comparaison cross-data rooms, capacité d'analyse (pas juste de la recherche).

---

### Q3 — Graphique

**User** : « Peux-tu me comparer les rendements des 2 fonds sur la période 2021–2026 ? »

**Decider** : Génère un graphique comparatif (courbes ou barres) montrant les rendements annuels des deux fonds côte à côte sur 5 ans.

**Narration** : « Et si je veux une vue visuelle, Decider génère directement un graphique. Les données sont extraites des data rooms, compilées et mises en forme. C'est prêt à être intégré dans une présentation. »

**Ce qu'on démontre** : Capacité de visualisation, mise en forme automatique, pas juste du texte.

---

### Q4 — Jackpot 🎰

**User** : « En allant sur mes sources, peux-tu me dire s'il y a des informations contradictoires entre les affirmations faites en data room sur la société X / Le fond Y / Le fournisseur Z et les informations publiées par la presse ? 

**Decider** : Analyse croisée entre le contenu des data rooms et les sources presse accessibles. Identifie les incohérences potentielles (ex. : *« Le prospectus du Fonds Alpha annonce un rendement annualisé de 12% sur 2023, mais un article des Échos daté du 15/03/2024 mentionne une performance de 8,5% sur la même période. »*).

**Narration** : « C'est LA question qui change tout. Decider ne se contente pas de chercher dans vos documents — il croise vos data rooms avec des sources externes pour détecter des incohérences. Imaginez le temps que ça prend de faire ça manuellement. Imaginez surtout le risque de passer à côté d'une contradiction. »

**Ce qu'on démontre** : Intelligence croisée data room + sources externes. C'est le moment "wow" de la démo — là où Decider n'est plus un simple moteur de recherche mais un vrai assistant d'analyse.

---

## PHASE 3 — Génération de document

**Narration** : « Maintenant que j'ai exploré mes données, je vais demander à Decider de me produire un document de synthèse. »

---

### Étape 3.1 — Lancement de la génération

**User** : « Maintenant s'il te plaît, génère-moi le document de synthèse basé sur la data room du Fonds Alpha. »

---

### Étape 3.2 — Dialogue interactif (scénario A : le chatbot a besoin de clarifications)

> *Decider ne génère pas aveuglément — il pose les bonnes questions d'abord.*
> 

**Decider** :

> « J'ai besoin de toi pour produire le meilleur document possible. Voici une liste d'éléments à éclaircir, peux-tu regarder ?
> 
> 1. Peux-tu confirmer les éléments manquants suivants pour compléter l'analyse : comparaison avec le Fonds Beta, horizon d'investissement (3 ou 5 ans), et destination du document (comité d'investissement ou usage interne) ?
> 2. Quel horizon d'investissement retenir pour l'analyse de performance : 3 ans ou 5 ans ?
> 3. Le document est destiné à un comité d'investissement ou à un usage interne exploratoire ?
> 4. Faut-il intégrer l'analyse des frais de gestion et de la structure de commission ?
> 5. Souhaites-tu une section dédiée aux risques identifiés ?
> 6. Dois-je inclure les informations contradictoires détectées avec la presse ?
> 7. Quel niveau de détail pour la section "Équipe de gestion" : résumé ou profils complets ?
> 8. Le document doit-il inclure des recommandations ou rester purement factuel ? »

**Narration** : « Notez que Decider ne se lance pas tête baissée. Il pose des questions pertinentes pour s'assurer que le document correspond exactement à ce dont vous avez besoin. C'est ce qui fait la différence entre un document générique et un document véritablement utile. »

**Ce qu'on démontre** : Intelligence du process de génération, Decider se comporte comme un vrai analyste junior qui clarifie le brief avant de bosser.

---

### Étape 3.3 — L'utilisateur répond

**User** : Répond aux questions (ex. : « Oui pour la comparaison, horizon 5 ans, c'est pour un comité, oui aux risques et contradictions presse, résumé pour l'équipe, factuel. »)

---

### Étape 3.4 — Génération

**Decider** : « C'est noté ! La génération du document est en cours, cela va prendre un moment. »

**Écran** : Indicateur de progression / animation de génération.

> *Attente de 30 secondes à 1 minute — le présentateur peut commenter pendant ce temps.*
> 

**Narration pendant l'attente** : « Decider est en train de compiler les données des data rooms, structurer le document, et intégrer les analyses qu'on a faites ensemble. Le résultat sera un document complet, sourcé, prêt à être présenté. »

---

### Étape 3.5 — Document prêt

**Decider** : « Le document de synthèse est prêt ! »

**Écran** : Aperçu du document dans l'interface + bouton **Télécharger**.

**Action** : Le présentateur clique sur Télécharger, ouvre le fichier, et fait défiler rapidement les sections pour montrer la qualité du livrable.

**Narration** : « Voilà le document final. Résumé exécutif, performance sur 5 ans, analyse des risques, comparaison avec le Fonds Beta, contradictions presse signalées, le tout sourcé. Il est téléchargeable en un clic, prêt à être envoyé à votre comité d'investissement. »

---

## Conclusion

**Narration** :

> 
> 
> 
> — Import et indexation automatique de deux data rooms
> — Interrogation instantanée avec des réponses sourcées
> — Comparaison entre fonds en une question
> — Détection automatique de contradictions avec la presse
> — Génération d'un document de synthèse professionnel et complet
>
