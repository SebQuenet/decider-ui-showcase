# 09b — Projets

Définition du « projet » comme entité de premier ordre : cycle de vie, types, métadonnées extensibles, dashboard et recherche. Cette spec complète US-124 (Base de connaissances par projet) qui ne définit que la brique minimale (nom + description + fichiers).

**Plateformes de référence** : Claude (Projects), ChatGPT (GPTs + Files), Notion, Linear

> **Étend** : US-124 (Base de connaissances par projet, fichier 09). US-124 reste la brique de création minimale ; ce fichier ajoute le cycle de vie, les types, le dashboard et l'extensibilité nécessaires pour les spécialisations métier (cf. fichier 21 pour la finance).

---

### US-431 : Projet comme entité structurée `P0`

**Description** : En tant qu'utilisateur, je veux que le projet soit une entité de premier ordre avec un identifiant unique, un propriétaire, une date de création et un statut, afin de disposer d'un conteneur structuré pour organiser mes données et conversations.

**Critères d'acceptation** :
- [ ] Un projet possède : identifiant unique, nom, description, propriétaire, date de création, statut
- [ ] Les conversations peuvent être rattachées à un projet
- [ ] Les fichiers uploadés sont associés au projet et utilisés comme contexte par l'assistant
- [ ] Le projet est accessible depuis le menu principal et la sidebar
- [ ] La suppression d'un projet requiert une confirmation et archive les données associées

---

### US-432 : Types de projet `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir créer des projets de différents types (générique, fonds, crédit, énergie, etc.), afin d'adapter les métadonnées et les fonctionnalités disponibles au cas d'usage.

**Critères d'acceptation** :
- [ ] Un type par défaut « Générique » est disponible sans configuration
- [ ] D'autres types sont activables (fonds d'investissement, crédit, énergie, achat)
- [ ] Chaque type définit des métadonnées spécifiques, des prompts contextuels et des fonctionnalités activées
- [ ] Le type est choisi à la création et modifiable ultérieurement
- [ ] De nouveaux types sont ajoutables par l'administrateur

---

### US-433 : Cycle de vie du projet `P0`

**Description** : En tant qu'utilisateur, je veux que chaque projet ait un cycle de vie clair (actif → archivé → supprimé), afin de gérer mes projets dans le temps sans perdre d'historique.

**Critères d'acceptation** :
- [ ] Un projet est « actif » par défaut à la création
- [ ] Un projet peut être archivé : il disparaît du dashboard actif mais reste consultable en lecture seule
- [ ] Un projet archivé peut être restauré en statut actif
- [ ] La suppression définitive requiert une confirmation et respecte les durées de rétention configurées
- [ ] Le statut du projet est visible dans le dashboard et le sélecteur de contexte

---

### US-434 : Dashboard de projet `P0`

**Description** : En tant qu'utilisateur, je veux que chaque projet dispose d'un dashboard affichant ses fichiers, conversations et activité récente, afin d'avoir une vue consolidée de mon travail.

**Critères d'acceptation** :
- [ ] Le dashboard affiche : nombre de fichiers, nombre de conversations, dernière activité
- [ ] La liste des fichiers est consultable avec nom, type, taille et date d'ajout
- [ ] Les conversations liées sont listées avec date et aperçu
- [ ] L'activité récente est affichée dans un fil chronologique
- [ ] Le dashboard est la vue par défaut quand on ouvre un projet

---

### US-435 : Métadonnées extensibles par type de projet `P1`

**Description** : En tant qu'utilisateur, je veux que les métadonnées d'un projet soient adaptées à son type (ex. : un projet fonds affiche devise, stratégie, taille), afin de structurer les informations selon le domaine métier.

**Critères d'acceptation** :
- [ ] Le type « Générique » propose des métadonnées de base : tags, catégorie, description longue
- [ ] Chaque type spécialisé ajoute ses propres champs (définis dans les specs du vertical concerné)
- [ ] Les métadonnées sont éditables depuis la page de paramètres du projet
- [ ] L'assistant utilise les métadonnées pour contextualiser ses réponses
- [ ] Les métadonnées sont consultables et filtrables dans le dashboard global

---

### US-436 : Fil d'activité du projet `P1`

**Description** : En tant qu'utilisateur, je veux consulter un fil d'activité retraçant toutes les actions effectuées sur un projet (imports, interrogations, documents générés), afin de suivre l'historique de travail.

**Critères d'acceptation** :
- [ ] Le fil liste chronologiquement : ajout/suppression de fichiers, conversations, documents générés, partages
- [ ] Chaque entrée affiche l'action, l'auteur, la date et un lien vers l'élément concerné
- [ ] Le fil est filtrable par type d'action
- [ ] Le fil est partagé entre tous les membres ayant accès au projet
- [ ] Le fil est paginé pour les projets avec beaucoup d'activité

---

### US-437 : Recherche cross-projets `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir rechercher un terme ou une information dans l'ensemble de mes projets, afin de retrouver rapidement une donnée sans connaître le projet exact.

**Critères d'acceptation** :
- [ ] Un champ de recherche global est accessible depuis le dashboard principal
- [ ] La recherche couvre les fichiers, les conversations et les métadonnées de tous les projets accessibles
- [ ] Les résultats sont groupés par projet avec un extrait contextuel
- [ ] La recherche respecte les permissions (seuls les projets accessibles sont inclus)
- [ ] Les résultats sont classés par pertinence avec le projet source identifié

---

### US-438 : Import/export de projet `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir exporter un projet complet (fichiers, métadonnées, conversations) et le réimporter, afin de sauvegarder ou migrer mes données.

**Critères d'acceptation** :
- [ ] L'export génère un package ZIP contenant fichiers, métadonnées (JSON) et conversations
- [ ] L'import restaure le projet à l'identique dans un nouvel espace
- [ ] Un avertissement est affiché si le projet importé entre en conflit avec un projet existant
- [ ] L'intégrité de l'export est vérifiable (checksum)
- [ ] L'export/import est traçé dans le journal d'activité

---

### US-439 : Templates de projet `P2`

**Description** : En tant qu'administrateur, je veux pouvoir créer des templates de projet avec des paramètres, métadonnées et prompts prédéfinis, afin de standardiser la création de projets dans l'organisation.

**Critères d'acceptation** :
- [ ] Un template définit : type de projet, métadonnées par défaut, instructions personnalisées, prompts de démarrage
- [ ] Les templates sont sélectionnables à la création d'un projet
- [ ] Les templates sont partageables au sein de l'organisation
- [ ] Un template peut être modifié sans affecter les projets déjà créés à partir de celui-ci
- [ ] Des templates par défaut sont fournis pour les cas d'usage courants

---

### US-440 : Paramètres et configuration du projet `P1`

**Description** : En tant qu'utilisateur, je veux accéder à une page de paramètres pour chaque projet (instructions personnalisées, modèle IA, partage, notifications), afin de configurer le comportement de l'assistant et les règles du projet.

**Critères d'acceptation** :
- [ ] La page de paramètres inclut : instructions personnalisées, modèle IA par défaut, langue de réponse
- [ ] Les paramètres de partage permettent de gérer les membres et leurs permissions
- [ ] Les notifications par projet sont configurables (activité, alertes)
- [ ] Les paramètres sont accessibles depuis le dashboard du projet
- [ ] Les modifications de paramètres sont tracées dans le fil d'activité
