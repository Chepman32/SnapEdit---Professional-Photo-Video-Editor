/**
 * SnapEdit Color Palette
 * Obsidian Black theme with vibrant accents
 */

export const colors = {
  // Primary Colors
  primary: {
    obsidianBlack: '#0A0A0A',
    carbonGray: '#1C1C1E',
    slateGray: '#2C2C2E',
    steelGray: '#3A3A3C',
  },

  // Accent Colors
  accent: {
    electricBlue: '#0A84FF',
    vividPurple: '#8E44E8',
    emeraldGreen: '#34C759',
    coralRed: '#FF453A',
  },

  // Semantic Colors
  semantic: {
    warningAmber: '#FFD60A',
    infoCyan: '#64D2FF',
    neutralWhite: '#FFFFFF',
    softWhite: '#F2F2F7',
  },

  // Gradients
  gradients: {
    premium: {
      colors: ['#8E44E8', '#0A84FF'],
      angle: 45,
    },
    dark: {
      colors: ['#0A0A0A', '#1C1C1E'],
      angle: 180,
    },
    glow: {
      colors: ['rgba(10, 132, 255, 0.2)', 'transparent'],
      type: 'radial',
    },
  },

  // Background Colors
  background: {
    primary: '#0A0A0A',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },

  // Text Colors
  text: {
    primary: '#F2F2F7',
    secondary: '#FFFFFF',
    tertiary: '#3A3A3C',
    disabled: 'rgba(242, 242, 247, 0.4)',
  },

  // Border Colors
  border: {
    default: '#3A3A3C',
    active: '#0A84FF',
    error: '#FF453A',
    success: '#34C759',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(0, 0, 0, 0.6)',
    dark: 'rgba(0, 0, 0, 0.85)',
    backdrop: 'rgba(10, 10, 10, 0.7)',
  },
} as const;

export type Colors = typeof colors;
