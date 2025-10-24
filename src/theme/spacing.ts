/**
 * SnapEdit Spacing System
 * Base unit: 4px
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Common padding/margin combinations
  screenPadding: 16,
  cardPadding: 16,
  sectionSpacing: 24,
  componentSpacing: 12,
} as const;

export type Spacing = typeof spacing;
