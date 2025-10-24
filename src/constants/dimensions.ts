/**
 * Dimension Constants
 */

import {Dimensions, Platform} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const DIMENSIONS = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Header dimensions
  headerHeight: Platform.OS === 'ios' ? 100 : 80,
  headerHeightSmall: Platform.OS === 'ios' ? 56 : 56,

  // Tab bar
  tabBarHeight: Platform.OS === 'ios' ? 64 : 56,

  // Touch targets (Apple HIG)
  minTouchTarget: 44,

  // FAB
  fabSize: 64,
  fabMinSize: 48,

  // Common component sizes
  buttonHeight: 56,
  buttonHeightSmall: 44,
  inputHeight: 56,
  iconSize: 24,
  iconSizeLarge: 32,
  iconSizeSmall: 20,

  // Grid
  gridGap: 2,
  gridColumns: 3,

  // Card dimensions
  quickActionCardWidth: 160,
  quickActionCardHeight: 200,
} as const;

export type Dimensions = typeof DIMENSIONS;
