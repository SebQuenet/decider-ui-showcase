# 08 — Génération d'images

Fonctionnalités liées à la génération d'images par IA, à l'édition visuelle et à la gestion de galerie.

**Plateformes de référence** : ChatGPT (DALL-E), Gemini (Imagen), Copilot (Designer), Grok, Mistral Le Chat

---

### US-105 : Génération d'images par prompt `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir générer des images en décrivant ce que je veux en langage naturel, afin de créer des visuels sans compétences graphiques.

**Critères d'acceptation** :
- [ ] L'assistant détecte automatiquement les requêtes de génération d'images
- [ ] L'image générée est affichée inline dans la conversation
- [ ] Un indicateur de progression est affiché pendant la génération
- [ ] L'utilisateur peut spécifier un style, un format ou une ambiance
- [ ] L'image est affichée en résolution suffisante avec possibilité de zoom

---

### US-106 : Sélection du modèle de génération d'images `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir choisir le modèle de génération d'images, afin d'obtenir le style ou la qualité qui correspond à mon besoin.

**Critères d'acceptation** :
- [ ] Un sélecteur permet de choisir entre les modèles de génération disponibles
- [ ] Chaque modèle affiche son style caractéristique et ses capacités
- [ ] Le modèle sélectionné est persisté dans les préférences
- [ ] Les limites spécifiques de chaque modèle sont communiquées (résolution, styles)
- [ ] Un modèle par défaut est présélectionné

---

### US-107 : Variations d'une image générée `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir générer des variations d'une image existante, afin d'explorer différentes interprétations d'un même concept.

**Critères d'acceptation** :
- [ ] Un bouton "Variations" est disponible sur chaque image générée
- [ ] 2 à 4 variations sont générées simultanément
- [ ] Les variations sont affichées côte à côte pour faciliter la comparaison
- [ ] L'utilisateur peut sélectionner une variation comme base pour d'autres itérations
- [ ] Le prompt original est conservé et modifiable pour affiner les variations

---

### US-108 : Édition d'image par instruction `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir modifier une image générée en donnant des instructions en langage naturel, afin d'affiner le résultat sans repartir de zéro.

**Critères d'acceptation** :
- [ ] L'utilisateur peut décrire les modifications souhaitées en texte
- [ ] Les modifications sont appliquées en conservant le contexte de l'image originale
- [ ] Un avant/après est affiché pour comparer
- [ ] Plusieurs itérations d'édition sont possibles sur la même image
- [ ] L'historique des éditions est navigable

---

### US-109 : Inpainting (édition par zone) `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir sélectionner une zone précise de l'image à modifier, afin de ne changer qu'une partie spécifique tout en préservant le reste.

**Critères d'acceptation** :
- [ ] Un outil de masquage (pinceau) permet de sélectionner la zone à modifier
- [ ] La taille et l'opacité du pinceau sont ajustables
- [ ] L'utilisateur décrit en texte ce qui doit remplacer la zone masquée
- [ ] La zone modifiée s'intègre de manière cohérente avec le reste de l'image
- [ ] Le masque peut être annulé ou refait avant de lancer la génération

---

### US-110 : Réglages de génération (format, style, qualité) `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir définir les paramètres de génération d'image, afin de contrôler le format de sortie et le style artistique.

**Critères d'acceptation** :
- [ ] Le format est sélectionnable (carré, paysage, portrait, custom)
- [ ] Des styles prédéfinis sont proposés (photo-réaliste, illustration, aquarelle, pixel art, etc.)
- [ ] Le niveau de qualité/détail est ajustable
- [ ] Les paramètres sont accessibles avant la génération via un panneau compact
- [ ] Les paramètres par défaut sont configurables dans les préférences

---

### US-111 : Galerie des images générées `P1`

**Description** : En tant qu'utilisateur, je veux accéder à une galerie de toutes les images que j'ai générées, afin de les retrouver et les réutiliser facilement.

**Critères d'acceptation** :
- [ ] Une vue galerie regroupe toutes les images générées par l'utilisateur
- [ ] La galerie est filtrable par date, prompt ou conversation
- [ ] Chaque image affiche son prompt d'origine au survol ou au clic
- [ ] La galerie est accessible depuis le menu principal ou les paramètres
- [ ] La navigation dans la galerie est fluide avec chargement progressif

---

### US-112 : Téléchargement et partage d'images `P0`

**Description** : En tant qu'utilisateur, je veux pouvoir télécharger et partager les images générées, afin de les utiliser en dehors du chat.

**Critères d'acceptation** :
- [ ] Un bouton de téléchargement est disponible sur chaque image générée
- [ ] Le téléchargement est proposé en plusieurs formats (PNG, JPEG, WebP)
- [ ] Le choix de la résolution est proposé (standard, haute résolution)
- [ ] Un bouton de partage génère un lien ou permet un partage direct
- [ ] Les métadonnées du prompt sont optionnellement incluses dans le fichier

---

### US-113 : Upscaling d'image `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir augmenter la résolution d'une image générée, afin de l'utiliser dans des contextes nécessitant une haute résolution.

**Critères d'acceptation** :
- [ ] Un bouton "Upscale" est disponible sur les images générées
- [ ] Les facteurs d'upscaling proposés sont 2× et 4×
- [ ] La qualité de l'image est préservée ou améliorée après l'upscaling
- [ ] Un indicateur de progression est affiché pendant le traitement
- [ ] L'image upscalée est téléchargeable séparément

---

### US-114 : Génération à partir d'une image de référence `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir uploader une image de référence avec un prompt, afin de guider la génération vers un style ou une composition spécifique.

**Critères d'acceptation** :
- [ ] L'utilisateur peut uploader une image comme référence de style ou de composition
- [ ] Le niveau d'influence de l'image de référence est ajustable
- [ ] Le prompt textuel et l'image de référence sont combinés pour la génération
- [ ] L'image de référence est affichée en miniature à côté du prompt
- [ ] Plusieurs images de référence peuvent être combinées

---

### US-115 : Suppression d'arrière-plan `P2`

**Description** : En tant qu'utilisateur, je veux pouvoir supprimer l'arrière-plan d'une image générée ou uploadée, afin d'isoler le sujet principal.

**Critères d'acceptation** :
- [ ] Un bouton "Supprimer l'arrière-plan" est disponible sur les images
- [ ] Le résultat est affiché avec un fond transparent (damier)
- [ ] L'utilisateur peut affiner la détection du sujet si nécessaire
- [ ] Le résultat est téléchargeable en PNG avec transparence
- [ ] Le traitement est rapide (quelques secondes)

---

### US-116 : Historique des prompts d'images `P2`

**Description** : En tant qu'utilisateur, je veux retrouver les prompts que j'ai utilisés pour générer des images, afin de les réutiliser ou les modifier pour de nouvelles générations.

**Critères d'acceptation** :
- [ ] L'historique des prompts de génération d'images est accessible
- [ ] Chaque entrée affiche le prompt, l'image générée et les paramètres utilisés
- [ ] L'utilisateur peut relancer une génération depuis un prompt historique
- [ ] L'historique est filtrable et cherchable
- [ ] Les prompts peuvent être marqués comme favoris pour un accès rapide
