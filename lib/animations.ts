import type { Variants, Transition } from "framer-motion";

/**
 * Motion Grammar System
 * 
 * Visual Thesis: Editorial Techno-Minimalism
 * - Controlled, purposeful motion
 * - Tension → Release rhythm
 * - Temporal hierarchy (important elements animate first)
 * - No gratuitous motion
 */

// === EASING CURVES ===
// Three core curves for different contexts
export const easings = {
  // Default: Smooth deceleration for most transitions
  smooth: [0.4, 0, 0.2, 1] as const,
  // Entry: Slightly more dramatic for scroll reveals
  reveal: [0.16, 1, 0.3, 1] as const,
  // Exit: Quick out
  exit: [0.4, 0, 1, 1] as const,
  // Interaction: Responsive, snappy
  interaction: [0.25, 0.1, 0.25, 1] as const,
  // Spring configs
  springDefault: { type: "spring", stiffness: 300, damping: 30 } as const,
  springBouncy: { type: "spring", stiffness: 400, damping: 25 } as const,
  springStiff: { type: "spring", stiffness: 500, damping: 35 } as const,
};

// === TIMING HIERARCHY ===
// Consistent durations based on element importance
export const durations = {
  micro: 0.15,    // Button states, hovers
  fast: 0.25,     // Small UI elements
  normal: 0.4,    // Standard reveals
  slow: 0.6,      // Hero elements, large content
  dramatic: 0.8,  // Hero moments
};

// === STAGGER SYSTEM ===
// Consistent stagger delays
export const staggers = {
  tight: 0.03,    // List items, badges
  normal: 0.08,   // Cards, features
  relaxed: 0.12,  // Section elements
};

// === TRANSITION PRESETS ===
export const transitions = {
  micro: { duration: durations.micro, ease: easings.interaction } as Transition,
  fast: { duration: durations.fast, ease: easings.smooth } as Transition,
  normal: { duration: durations.normal, ease: easings.smooth } as Transition,
  reveal: { duration: durations.slow, ease: easings.reveal } as Transition,
  dramatic: { duration: durations.dramatic, ease: easings.reveal } as Transition,
  spring: easings.springDefault as Transition,
  springBouncy: easings.springBouncy as Transition,
};

// === REVEAL VARIANTS ===
// Used with useInView for scroll-triggered animations

// Default fade up (use sparingly - not for every section)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.reveal,
  },
};

// Subtle fade (for secondary content)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.normal,
  },
};

// Slide from direction (for asymmetric layouts)
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.reveal,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.reveal,
  },
};

// Scale reveal (for hero terminal, important visual moments)
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.reveal,
    },
  },
};

// === STAGGER CONTAINERS ===
export const staggerContainer = (
  staggerDelay: number = staggers.normal,
  delayChildren: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
};

// === HOVER STATES ===
// Subtle, intentional hover effects

export const hoverLift = {
  y: -2,
  transition: transitions.micro,
};

export const hoverScale = {
  scale: 1.02,
  transition: transitions.micro,
};

export const tapScale = {
  scale: 0.98,
};

// Card hover (subtle lift + shadow)
export const cardHover: Variants = {
  rest: { 
    y: 0,
    transition: transitions.fast,
  },
  hover: { 
    y: -4,
    transition: transitions.fast,
  },
};

// === VIEWPORT OPTIONS ===
export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};

export const viewportRepeating = {
  once: false,
  margin: "-80px" as const,
  amount: 0.3,
};

// === MAGNETIC EFFECT CONFIG ===
export const magneticConfig = {
  cta: { strength: 0.35, radius: 100 },
  button: { strength: 0.2, radius: 60 },
  subtle: { strength: 0.1, radius: 40 },
};

// === COUNT UP HELPER ===
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

// === SCROLL-LINKED HELPERS ===
// For use with useScroll and useTransform
export const scrollRanges = {
  // Element enters viewport from bottom
  enter: ["start end", "end start"] as const,
  // Element is in center of viewport
  center: ["start 80%", "end 20%"] as const,
  // Full scroll through element
  through: ["start end", "end start"] as const,
};
