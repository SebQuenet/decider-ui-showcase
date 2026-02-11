import type { Variants, Transition } from 'framer-motion'

// --- Transitions de base ---

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
}

export const smoothTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
}

// --- Variants pour les messages ---

export const messageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothTransition,
  },
}

export const typingDotVariants: Variants = {
  hidden: { opacity: 0.3 },
  visible: { opacity: 1 },
}

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// --- Presets GSAP ---

export const gsapPresets = {
  fadeIn: {
    duration: 0.4,
    ease: 'power2.out',
    opacity: 0,
  },
  slideUp: {
    duration: 0.5,
    ease: 'power3.out',
    y: 30,
    opacity: 0,
  },
  slideDown: {
    duration: 0.5,
    ease: 'power3.out',
    y: -30,
    opacity: 0,
  },
  slideLeft: {
    duration: 0.4,
    ease: 'power2.inOut',
    x: 50,
    opacity: 0,
  },
  slideRight: {
    duration: 0.4,
    ease: 'power2.inOut',
    x: -50,
    opacity: 0,
  },
  scaleIn: {
    duration: 0.3,
    ease: 'back.out(1.7)',
    scale: 0.8,
    opacity: 0,
  },
  elasticIn: {
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)',
    scale: 0.5,
    opacity: 0,
  },
} as const

// --- Transitions de page ---

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// --- Sidebar ---

export const sidebarVariants: Variants = {
  expanded: {
    width: 280,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  collapsed: {
    width: 64,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const sidebarContentVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 },
  },
}

// --- Panel lateral ---

export const panelSlideVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
}

export const panelOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// --- Stagger pour les listes ---

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const staggerItemScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}
