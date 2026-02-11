# Chat UI Showcase

Bac à sable d'expérimentation pour des interfaces de chat LLM modernes avec animations professionnelles.

## Stack

- **Build** : Vite + React 19 + TypeScript
- **Styling** : Tailwind CSS v4
- **Animations** : Framer Motion + GSAP
- **Package manager** : pnpm

## Structure

```
src/
├── components/        — Composants UI partagés
│   ├── chat/          — Composants de chat réutilisables
│   └── TabNavigation  — Navigation par onglets
├── experiments/       — Vues de chat indépendantes (une par expérimentation)
├── hooks/             — Custom React hooks
├── types/             — Types TypeScript partagés
└── lib/               — Utilitaires (animations, helpers)
```

## Navigation par onglets

Chaque vue de chat est un composant autonome dans `src/experiments/`. Les vues sont enregistrées dans le tableau `TABS` de `src/App.tsx` :

```ts
const TABS: TabView[] = [
  { id: 'demo', label: 'Chat Démo', component: DemoChat },
]
```

Pour ajouter une nouvelle vue :
1. Créer un composant dans `src/experiments/` (named export, state autonome)
2. L'ajouter au tableau `TABS` dans `src/App.tsx`

Les vues sont montées en parallèle et masquées via CSS (`hidden`/`block`) pour conserver leur état lors du changement d'onglet.

## Conventions

- Français pour les commentaires et la documentation
- Noms de variables/fonctions en anglais
- Composants : un fichier par composant, named exports
- Types : centralisés dans `src/types/`
- Animations : presets réutilisables dans `src/lib/animations.ts`
- Expérimentations : composants autonomes dans `src/experiments/`, déclarés dans `TABS`
