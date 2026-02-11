# 06 — Sélection de modèles

Fonctionnalités liées au choix du modèle IA, au routage automatique et aux paramètres de génération.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Perplexity, Copilot, Mistral Le Chat, Grok, DeepSeek, Poe, HuggingChat, You.com

---

### US-080 : Sélecteur de modèle dans le header `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir choisir le modèle IA à utiliser via un sélecteur dans le header de la conversation, afin de contrôler quel modèle répond à mes messages.

**Critères d'acceptation** :
- [ ] Un sélecteur (dropdown ou menu) est affiché dans le header de la conversation
- [ ] La liste affiche les modèles disponibles avec leur nom et leur icône/logo
- [ ] Le modèle actuellement sélectionné est clairement indiqué
- [ ] Le changement de modèle est immédiat et s'applique au prochain message
- [ ] Le sélecteur est désactivé pendant une génération en cours

---

### US-081 : Carte de modèle avec métadonnées `P1`

**Description** : En tant qu'utilisateur, je veux voir les caractéristiques clés de chaque modèle dans le sélecteur, afin de choisir le modèle le plus adapté à mon besoin.

**Critères d'acceptation** :
- [ ] Chaque modèle affiche ses capacités (vision, code, raisonnement, multilingue)
- [ ] La taille de contexte maximale est indiquée
- [ ] Le coût relatif ou le tier (gratuit, pro) est visible
- [ ] Un badge indique les modèles récents ou en preview
- [ ] Un tooltip ou une section détail fournit une description courte du modèle

---

### US-082 : Modèles favoris et récents `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir marquer des modèles comme favoris et voir les modèles récemment utilisés, afin d'accéder rapidement à mes modèles préférés.

**Critères d'acceptation** :
- [ ] Un bouton étoile permet de marquer un modèle comme favori
- [ ] Les favoris sont affichés en haut de la liste du sélecteur
- [ ] Une section "Récemment utilisés" liste les 3-5 derniers modèles utilisés
- [ ] Les favoris sont persistés dans les préférences utilisateur
- [ ] Les favoris sont accessibles via un raccourci rapide

---

### US-083 : Routage automatique de modèle `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir activer un mode de routage automatique, afin que le système choisisse le modèle le plus adapté en fonction de ma requête.

**Critères d'acceptation** :
- [ ] Un mode "Auto" est disponible dans le sélecteur de modèle
- [ ] Le système analyse la complexité et le type de la requête pour router vers le bon modèle
- [ ] Le modèle effectivement utilisé est indiqué dans la réponse
- [ ] L'utilisateur peut désactiver le routage auto à tout moment
- [ ] Le routage priorise les modèles rapides pour les tâches simples et les modèles puissants pour les tâches complexes

---

### US-084 : Comparaison de réponses multi-modèles `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir envoyer une même requête à plusieurs modèles simultanément, afin de comparer la qualité de leurs réponses.

**Critères d'acceptation** :
- [ ] Un mode "Comparer" permet de sélectionner 2 à 4 modèles
- [ ] Les réponses sont affichées côte à côte ou en colonnes
- [ ] Chaque réponse est identifiée par le nom du modèle
- [ ] L'utilisateur peut voter pour la meilleure réponse
- [ ] Les temps de réponse de chaque modèle sont affichés

---

### US-085 : Indicateur de modèle par message `P1`

**Description** : En tant qu'utilisateur, je veux voir quel modèle a généré chaque réponse, afin d'identifier le modèle utilisé, surtout quand je change de modèle en cours de conversation.

**Critères d'acceptation** :
- [ ] Le nom ou l'icône du modèle est affiché sur chaque message de l'assistant
- [ ] L'indicateur est discret et ne surcharge pas l'interface
- [ ] Le modèle est affiché de manière plus visible si différent du modèle par défaut
- [ ] Cliquer sur l'indicateur affiche les métadonnées de la génération (tokens, durée)
- [ ] L'indicateur est cohérent avec le sélecteur de modèle

---

### US-086 : Réglage de la température `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir ajuster la température de génération, afin de contrôler la créativité vs la précision des réponses.

**Critères d'acceptation** :
- [ ] Un slider ou un champ numérique permet de régler la température (0 à 2)
- [ ] La valeur par défaut est prédéfinie selon le modèle sélectionné
- [ ] Un tooltip explique l'effet de la température (basse = déterministe, haute = créatif)
- [ ] Le réglage est accessible depuis un panneau de paramètres avancés
- [ ] Le réglage est persisté par conversation ou globalement selon le choix utilisateur

---

### US-087 : Réglage de la longueur maximale `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir définir la longueur maximale de la réponse, afin de contrôler la verbosité de l'assistant.

**Critères d'acceptation** :
- [ ] Un champ ou slider permet de définir le max tokens de la réponse
- [ ] Des presets sont proposés (court, moyen, long, illimité)
- [ ] La limite est appliquée à chaque génération
- [ ] Un indicateur montre quand la réponse a été tronquée à cause de la limite
- [ ] L'utilisateur peut demander de continuer si la réponse est tronquée

---

### US-088 : Presets de paramètres `P2`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir sauvegarder des combinaisons de paramètres en presets, afin de basculer rapidement entre différentes configurations de génération.

**Critères d'acceptation** :
- [ ] L'utilisateur peut créer un preset avec un nom personnalisé
- [ ] Chaque preset sauvegarde le modèle, la température, le max tokens et le system prompt
- [ ] Les presets sont accessibles via un menu rapide
- [ ] Les presets peuvent être modifiés et supprimés
- [ ] Des presets par défaut sont fournis (créatif, précis, code, etc.)

---

### US-089 : System prompt personnalisé par conversation `P1`

**Description** : En tant qu'utilisateur avancé, je veux pouvoir définir un system prompt spécifique pour une conversation, afin de personnaliser le comportement de l'assistant.

**Critères d'acceptation** :
- [ ] Un champ d'édition du system prompt est accessible dans les paramètres de la conversation
- [ ] Le system prompt est appliqué à toutes les générations de la conversation
- [ ] Un indicateur montre quand un system prompt custom est actif
- [ ] Le system prompt peut être modifié en cours de conversation
- [ ] Des templates de system prompts sont proposés

---

### US-090 : Changement de modèle en cours de conversation `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir changer de modèle au milieu d'une conversation, afin d'utiliser un modèle plus adapté selon l'évolution de la discussion.

**Critères d'acceptation** :
- [ ] Le changement de modèle ne crée pas de nouvelle conversation
- [ ] Le contexte de la conversation est maintenu après le changement
- [ ] Un séparateur visuel indique le changement de modèle dans le fil
- [ ] L'historique complet est envoyé au nouveau modèle
- [ ] Un avertissement est affiché si le contexte dépasse la capacité du nouveau modèle

---

### US-091 : Filtrage des modèles par capacité `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir filtrer les modèles par capacité dans le sélecteur, afin de trouver rapidement un modèle adapté à ma tâche.

**Critères d'acceptation** :
- [ ] Des filtres par capacité sont disponibles (vision, code, raisonnement, multilingue)
- [ ] Un filtre par provider/éditeur est disponible
- [ ] Un filtre par coût/tier est disponible
- [ ] Les filtres sont combinables
- [ ] Le nombre de résultats est mis à jour en temps réel
