/**
 * Animation Constants
 * Timing and easing configurations for Reanimated
 */

export const ANIMATION_DURATION = {
  micro: 100,
  short: 200,
  standard: 300,
  medium: 400,
  long: 600,
  extraLong: 800,
} as const;

export const SPRING_CONFIG = {
  default: {
    damping: 15,
    stiffness: 150,
  },
  gentle: {
    damping: 20,
    stiffness: 120,
  },
  bouncy: {
    damping: 12,
    stiffness: 180,
  },
  stiff: {
    damping: 25,
    stiffness: 200,
  },
} as const;

export const EASING = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings
  smooth: [0.4, 0, 0.2, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;

export const ANIMATION_DELAYS = {
  stagger: 50,
  staggerShort: 30,
  staggerLong: 100,
} as const;
