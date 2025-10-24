/**
 * Animation Utilities
 * Common animation functions using Reanimated 3
 */

import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {ANIMATION_DURATION, SPRING_CONFIG} from '@constants';

/**
 * Spring animation with default config
 */
export const springAnimation = (
  toValue: number,
  config: keyof typeof SPRING_CONFIG = 'default'
) => {
  return withSpring(toValue, SPRING_CONFIG[config]);
};

/**
 * Timing animation with easing
 */
export const timingAnimation = (
  toValue: number,
  duration: keyof typeof ANIMATION_DURATION = 'standard',
  easing: Easing.EasingFunction = Easing.inOut(Easing.ease)
) => {
  return withTiming(toValue, {
    duration: ANIMATION_DURATION[duration],
    easing,
  });
};

/**
 * Fade in animation
 */
export const fadeIn = (
  duration: keyof typeof ANIMATION_DURATION = 'standard'
) => {
  return withTiming(1, {
    duration: ANIMATION_DURATION[duration],
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Fade out animation
 */
export const fadeOut = (
  duration: keyof typeof ANIMATION_DURATION = 'standard'
) => {
  return withTiming(0, {
    duration: ANIMATION_DURATION[duration],
    easing: Easing.in(Easing.ease),
  });
};

/**
 * Scale animation
 */
export const scaleAnimation = (
  toValue: number,
  config: keyof typeof SPRING_CONFIG = 'default'
) => {
  return withSpring(toValue, SPRING_CONFIG[config]);
};

/**
 * Slide in from bottom
 */
export const slideInFromBottom = (
  distance: number = 50,
  duration: keyof typeof ANIMATION_DURATION = 'standard'
) => {
  return withTiming(0, {
    duration: ANIMATION_DURATION[duration],
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Pulse animation (scale up and down)
 */
export const pulseAnimation = (
  minScale: number = 1.0,
  maxScale: number = 1.05,
  duration: number = 1000
) => {
  return withSequence(
    withTiming(maxScale, {duration: duration / 2}),
    withTiming(minScale, {duration: duration / 2})
  );
};

/**
 * Shake animation
 */
export const shakeAnimation = () => {
  return withSequence(
    withTiming(-10, {duration: 50}),
    withTiming(10, {duration: 50}),
    withTiming(-10, {duration: 50}),
    withTiming(10, {duration: 50}),
    withTiming(0, {duration: 50})
  );
};

/**
 * Bounce animation
 */
export const bounceAnimation = () => {
  return withSpring(1, {
    damping: 8,
    stiffness: 180,
  });
};

/**
 * Stagger animation helper
 */
export const staggerDelay = (index: number, delay: number = 50) => {
  return index * delay;
};

/**
 * Button press animation
 */
export const buttonPressAnimation = {
  in: () => withTiming(0.96, {duration: 100}),
  out: () => withSpring(1, {damping: 12, stiffness: 150}),
};

/**
 * Card lift animation
 */
export const cardLiftAnimation = {
  lift: () =>
    withSpring(1.05, {
      damping: 15,
      stiffness: 150,
    }),
  drop: () =>
    withSpring(1, {
      damping: 15,
      stiffness: 150,
    }),
};

/**
 * Rotation animation
 */
export const rotateAnimation = (
  degrees: number,
  duration: keyof typeof ANIMATION_DURATION = 'standard'
) => {
  return withTiming(degrees, {
    duration: ANIMATION_DURATION[duration],
    easing: Easing.inOut(Easing.ease),
  });
};

/**
 * Custom bezier easing
 */
export const customBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Easing.bezier(x1, y1, x2, y2);
};
