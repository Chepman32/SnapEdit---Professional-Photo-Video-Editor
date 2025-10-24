/**
 * SnapEdit Typography System
 * Based on SF Pro Display (iOS native)
 */

import {TextStyle} from 'react-native';

export const typography = {
  // Font Families
  fontFamily: {
    primary: 'SF Pro Display',
    monospace: 'SF Mono',
  },

  // Type Scale
  hero: {
    fontSize: 48,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    lineHeight: 56,
  },

  h1: {
    fontSize: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    lineHeight: 41,
  },

  h2: {
    fontSize: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
    lineHeight: 34,
  },

  h3: {
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
    lineHeight: 28,
  },

  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
    lineHeight: 22,
  },

  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
    lineHeight: 20,
  },

  caption: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
    lineHeight: 18,
  },

  label: {
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    lineHeight: 13,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  // Weight Variants
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
} as const;

export type Typography = typeof typography;
