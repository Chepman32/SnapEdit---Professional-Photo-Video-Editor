/**
 * SnapEdit Shadow & Elevation System
 */

import {ViewStyle} from 'react-native';

export const shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,

  medium: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,

  strong: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,

  dramatic: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 12,
  } as ViewStyle,

  // Special shadows
  glow: {
    shadowColor: '#0A84FF',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5,
  } as ViewStyle,

  premiumGlow: {
    shadowColor: '#8E44E8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5,
  } as ViewStyle,
} as const;

export type Shadows = typeof shadows;
