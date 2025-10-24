/**
 * SnapEdit Border Radius System
 */

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 20,
  xlarge: 28,
  circle: 9999,

  // Component-specific
  button: 16,
  card: 12,
  modal: 20,
  sheet: 28,
  input: 12,
  chip: 8,
} as const;

export type BorderRadius = typeof borderRadius;
