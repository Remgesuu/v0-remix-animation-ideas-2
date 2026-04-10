import type { Variants, Transition } from "framer-motion";

// Standard easing curves
export const easings = {
  smooth: [0.4, 0, 0.2, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  spring: { type: "spring", stiffness: 300, damping: 30 } as const,
};

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Stagger children
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Transition presets
export const transitions = {
  fast: { duration: 0.2, ease: easings.smooth } as Transition,
  normal: { duration: 0.4, ease: easings.smooth } as Transition,
  slow: { duration: 0.6, ease: easings.smooth } as Transition,
  spring: easings.spring as Transition,
};

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
};

export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

export const tapScale = {
  scale: 0.98,
};

// Card hover animation
export const cardHover: Variants = {
  rest: { 
    scale: 1, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
  },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
    transition: transitions.fast,
  },
};

// Count up animation helper
export function createCountUpConfig(
  start: number = 0,
  end: number,
  duration: number = 2
) {
  return {
    initial: start,
    target: end,
    duration,
  };
}

// Viewport trigger options
export const viewportOnce = {
  once: true,
  margin: "-100px",
};

export const viewportRepeating = {
  once: false,
  margin: "-100px",
  amount: 0.3,
};
