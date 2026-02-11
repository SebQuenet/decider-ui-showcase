# 18 — Responsive et mobile

Fonctionnalités liées au layout responsive, à la Progressive Web App et aux gestes tactiles.

**Plateformes de référence** : ChatGPT, Claude, Gemini, Copilot, Perplexity, Pi, DeepSeek

---

### US-229 : Layout responsive desktop/tablette/mobile `P0`

**Description** : En tant qu'utilisateur, je veux que l'interface s'adapte automatiquement à la taille de mon écran, afin d'avoir une expérience optimale sur tout appareil.

**Critères d'acceptation** :
- [ ] L'interface est fluide entre 320px et 2560px de largeur
- [ ] Les breakpoints principaux sont définis (mobile < 768px, tablette < 1024px, desktop ≥ 1024px)
- [ ] Les éléments se réorganisent intelligemment selon la taille d'écran
- [ ] Aucun scroll horizontal n'apparaît à aucune taille
- [ ] Les textes et images sont redimensionnés proportionnellement

---

### US-230 : Sidebar responsive `P0`

**Description** : En tant qu'utilisateur mobile, je veux que la sidebar se transforme en drawer/overlay sur petit écran, afin de maximiser l'espace disponible pour la conversation.

**Critères d'acceptation** :
- [ ] Sur mobile, la sidebar est masquée par défaut
- [ ] Un bouton hamburger permet d'ouvrir la sidebar en overlay
- [ ] La sidebar s'ouvre avec une animation de slide depuis la gauche
- [ ] Cliquer en dehors de la sidebar la ferme
- [ ] La sidebar se ferme automatiquement quand une conversation est sélectionnée

---

### US-231 : Zone de composition mobile optimisée `P0`

**Description** : En tant qu'utilisateur mobile, je veux que la zone de saisie soit optimisée pour le tactile, afin de taper et envoyer des messages confortablement.

**Critères d'acceptation** :
- [ ] La zone de saisie est toujours visible en bas de l'écran
- [ ] La textarea s'agrandit correctement quand le clavier virtuel est ouvert
- [ ] Les boutons d'action (envoi, upload) sont suffisamment grands (min 44×44px)
- [ ] La zone de composition ne recouvre pas les messages
- [ ] Le scroll vers le dernier message fonctionne correctement avec le clavier ouvert

---

### US-232 : Gestes tactiles `P1`

**Description** : En tant qu'utilisateur mobile, je veux pouvoir utiliser des gestes tactiles courants, afin d'interagir naturellement avec l'interface.

**Critères d'acceptation** :
- [ ] Le swipe depuis le bord gauche ouvre la sidebar
- [ ] Le swipe vers la droite sur la sidebar la ferme
- [ ] Le pull-to-refresh recharge la conversation si applicable
- [ ] Le long press sur un message ouvre le menu contextuel
- [ ] Les gestes ne conflictent pas avec les gestes natifs du navigateur

---

### US-233 : Installation PWA `P1`

**Description** : En tant qu'utilisateur, je veux pouvoir installer l'application comme une Progressive Web App, afin de l'utiliser comme une application native depuis mon écran d'accueil.

**Critères d'acceptation** :
- [ ] Un manifest.json est configuré avec les métadonnées de l'application
- [ ] L'application propose l'installation via une bannière ou un bouton
- [ ] L'application installée s'ouvre en mode standalone (sans barre de navigateur)
- [ ] L'icône de l'application est affichée sur l'écran d'accueil
- [ ] Le splash screen est affiché au lancement

---

### US-234 : Mode hors-ligne basique `P2`

**Description** : En tant qu'utilisateur, je veux que l'application reste partiellement utilisable hors connexion, afin de pouvoir au minimum consulter mes conversations récentes.

**Critères d'acceptation** :
- [ ] Un service worker cache les ressources statiques de l'application
- [ ] Les conversations récentes sont accessibles en lecture hors-ligne
- [ ] Un indicateur clair signale le mode hors-ligne
- [ ] Les messages rédigés hors-ligne sont mis en file d'attente et envoyés à la reconnexion
- [ ] La transition hors-ligne/en-ligne est transparente

---

### US-235 : Notifications push mobiles `P2`

**Description** : En tant qu'utilisateur mobile, je veux recevoir des notifications push, afin d'être alerté des réponses ou des événements importants.

**Critères d'acceptation** :
- [ ] Les notifications push sont supportées via le service worker
- [ ] L'utilisateur autorise les notifications lors de la première utilisation
- [ ] Les notifications affichent un aperçu du message
- [ ] Cliquer sur la notification ouvre la conversation concernée
- [ ] Les notifications sont configurables (activer/désactiver par type)

---

### US-236 : Adaptation des images et médias au mobile `P1`

**Description** : En tant qu'utilisateur mobile, je veux que les images et médias soient correctement dimensionnés sur petit écran, afin de ne pas casser la mise en page.

**Critères d'acceptation** :
- [ ] Les images sont redimensionnées pour ne pas dépasser la largeur de l'écran
- [ ] Les images sont chargées en résolution adaptée (srcset ou lazy loading)
- [ ] Les galeries d'images sont scrollables horizontalement sur mobile
- [ ] Le tap sur une image ouvre un viewer plein écran avec zoom
- [ ] Les vidéos embed sont responsives

---

### US-237 : Panneau latéral adaptatif `P1`

**Description** : En tant qu'utilisateur, je veux que les panneaux latéraux (artifacts, paramètres) s'adaptent à la taille de l'écran, afin de rester utilisables sur tous les appareils.

**Critères d'acceptation** :
- [ ] Sur desktop, le panneau latéral coexiste avec la conversation (split view)
- [ ] Sur tablette, le panneau peut être en overlay ou en split selon la largeur
- [ ] Sur mobile, le panneau s'ouvre en plein écran avec un bouton retour
- [ ] La transition entre les modes est fluide
- [ ] Le contenu du panneau est correctement mis en forme à chaque taille

---

### US-238 : Performance mobile optimisée `P0`

**Description** : En tant qu'utilisateur mobile, je veux que l'application soit performante sur les appareils mobiles, afin d'avoir une expérience fluide sans lag ni freeze.

**Critères d'acceptation** :
- [ ] Le temps de chargement initial est inférieur à 3 secondes sur 4G
- [ ] Le scroll dans les conversations longues est fluide (60 FPS)
- [ ] Les animations ne causent pas de jank sur les appareils mid-range
- [ ] Le bundle JavaScript est optimisé et code-splitté
- [ ] La consommation mémoire est maîtrisée pour les conversations longues

---

### US-239 : Orientation portrait et paysage `P1`

**Description** : En tant qu'utilisateur mobile/tablette, je veux que l'interface fonctionne en orientation portrait et paysage, afin de l'utiliser dans l'orientation de mon choix.

**Critères d'acceptation** :
- [ ] L'interface s'adapte aux deux orientations sans rechargement
- [ ] La zone de conversation utilise la largeur disponible dans les deux orientations
- [ ] Le clavier virtuel ne casse pas le layout en mode paysage
- [ ] Les éléments restent accessibles et correctement dimensionnés
- [ ] La rotation est fluide sans perte de contexte (scroll position, texte en cours)

---

### US-240 : Navigation mobile native-like `P1`

**Description** : En tant qu'utilisateur mobile, je veux que la navigation dans l'application ressemble à une application native, afin d'avoir une expérience familière et intuitive.

**Critères d'acceptation** :
- [ ] La barre d'en-tête est fixe en haut avec le titre de la conversation et les actions
- [ ] La barre de composition est fixe en bas
- [ ] Les transitions entre écrans utilisent des animations natives (slide, fade)
- [ ] Le bouton retour du système fonctionne pour naviguer en arrière
- [ ] La navigation ne provoque pas de rechargement de page
