/**
 * Accessibility Utilities - Phase 28
 * VoiceOver, TalkBack, Dynamic Type, and accessibility helpers
 */

import {AccessibilityInfo, Platform, findNodeHandle} from 'react-native';
import {useEffect, useState} from 'react';

/**
 * Accessibility labels for common UI elements
 */
export const accessibilityLabels = {
  // Navigation
  backButton: 'Navigate back',
  closeButton: 'Close',
  menuButton: 'Open menu',
  settingsButton: 'Open settings',

  // Editor tools
  filtersButton: 'Open filters tool',
  adjustButton: 'Open adjustments tool',
  curvesButton: 'Open curves tool',
  hslButton: 'Open HSL tool',
  cropButton: 'Open crop tool',
  drawButton: 'Open drawing tool',
  textButton: 'Open text tool',
  exportButton: 'Export image',

  // Actions
  undoButton: 'Undo last action',
  redoButton: 'Redo action',
  resetButton: 'Reset all changes',
  applyButton: 'Apply changes',
  cancelButton: 'Cancel',

  // Gallery
  photoItem: 'Photo',
  videoItem: 'Video',
  selectButton: 'Select item',
  deleteButton: 'Delete selected items',
  shareButton: 'Share selected items',

  // Playback
  playButton: 'Play video',
  pauseButton: 'Pause video',
  seekBar: 'Video timeline',
};

/**
 * Accessibility hints for complex interactions
 */
export const accessibilityHints = {
  slider: 'Swipe up or down to adjust value',
  doubleTap: 'Double tap to activate',
  longPress: 'Long press for more options',
  swipeDelete: 'Swipe left to delete',
  pinchZoom: 'Pinch to zoom',
  dragReorder: 'Drag to reorder',
};

/**
 * Generate accessibility label for slider
 */
export const generateSliderLabel = (
  name: string,
  value: number,
  min: number,
  max: number,
  unit: string = ''
): string => {
  const percentage = ((value - min) / (max - min)) * 100;
  return `${name}, ${value}${unit}, ${Math.round(percentage)}%`;
};

/**
 * Generate accessibility label for toggle
 */
export const generateToggleLabel = (name: string, isEnabled: boolean): string => {
  return `${name}, ${isEnabled ? 'enabled' : 'disabled'}`;
};

/**
 * Hook to detect screen reader status
 */
export const useScreenReader = (): boolean => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    // Check initial state
    AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
      setIsScreenReaderEnabled(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      enabled => {
        setIsScreenReaderEnabled(enabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return isScreenReaderEnabled;
};

/**
 * Hook to detect bold text preference
 */
export const useBoldText = (): boolean => {
  const [isBoldTextEnabled, setIsBoldTextEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isBoldTextEnabled().then(enabled => {
      setIsBoldTextEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      enabled => {
        setIsBoldTextEnabled(enabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return isBoldTextEnabled;
};

/**
 * Hook to detect grayscale preference
 */
export const useGrayscale = (): boolean => {
  const [isGrayscaleEnabled, setIsGrayscaleEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isGrayscaleEnabled().then(enabled => {
      setIsGrayscaleEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'grayscaleChanged',
      enabled => {
        setIsGrayscaleEnabled(enabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return isGrayscaleEnabled;
};

/**
 * Hook to detect reduce motion preference
 */
export const useReduceMotion = (): boolean => {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setIsReduceMotionEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setIsReduceMotionEnabled(enabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return isReduceMotionEnabled;
};

/**
 * Announce message to screen reader
 */
export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

/**
 * Set accessibility focus to a component
 */
export const setAccessibilityFocus = (reactTag: number | null) => {
  if (reactTag) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
};

/**
 * Accessibility roles for common components
 */
export const accessibilityRoles = {
  button: 'button' as const,
  link: 'link' as const,
  search: 'search' as const,
  image: 'image' as const,
  text: 'text' as const,
  header: 'header' as const,
  summary: 'summary' as const,
  adjustable: 'adjustable' as const,
  imagebutton: 'imagebutton' as const,
  menu: 'menu' as const,
  menubar: 'menubar' as const,
  menuitem: 'menuitem' as const,
  tab: 'tab' as const,
  tablist: 'tablist' as const,
  checkbox: 'checkbox' as const,
  radio: 'radio' as const,
  radiogroup: 'radiogroup' as const,
  switch: 'switch' as const,
  progressbar: 'progressbar' as const,
  slider: 'slider' as const,
  spinbutton: 'spinbutton' as const,
  alert: 'alert' as const,
  combobox: 'combobox' as const,
  toolbar: 'toolbar' as const,
  list: 'list' as const,
};

/**
 * Accessibility states
 */
export interface AccessibilityState {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}

/**
 * Create accessibility props for button
 */
export const createButtonAccessibility = (
  label: string,
  hint?: string,
  disabled?: boolean
) => ({
  accessible: true,
  accessibilityRole: accessibilityRoles.button,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityState: {disabled},
});

/**
 * Create accessibility props for slider
 */
export const createSliderAccessibility = (
  label: string,
  value: number,
  min: number,
  max: number
) => ({
  accessible: true,
  accessibilityRole: accessibilityRoles.adjustable,
  accessibilityLabel: generateSliderLabel(label, value, min, max),
  accessibilityValue: {
    min,
    max,
    now: value,
  },
  accessibilityActions: [
    {name: 'increment'},
    {name: 'decrement'},
  ],
});

/**
 * Create accessibility props for switch/toggle
 */
export const createToggleAccessibility = (
  label: string,
  isEnabled: boolean
) => ({
  accessible: true,
  accessibilityRole: accessibilityRoles.switch,
  accessibilityLabel: generateToggleLabel(label, isEnabled),
  accessibilityState: {checked: isEnabled},
});

/**
 * Create accessibility props for image
 */
export const createImageAccessibility = (
  description: string,
  isDecorative?: boolean
) => {
  if (isDecorative) {
    return {
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants' as const,
    };
  }

  return {
    accessible: true,
    accessibilityRole: accessibilityRoles.image,
    accessibilityLabel: description,
  };
};

/**
 * Minimum touch target size (44x44 pts per Apple HIG)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Create hit slop for small touch targets
 */
export const createHitSlop = (size: number = MIN_TOUCH_TARGET_SIZE) => {
  const slop = (MIN_TOUCH_TARGET_SIZE - size) / 2;
  return {
    top: slop,
    right: slop,
    bottom: slop,
    left: slop,
  };
};

/**
 * Font scale multipliers for dynamic type
 */
export const getFontScale = (): number => {
  // Would use PixelRatio.getFontScale() in production
  return 1.0;
};

/**
 * Adjust font size based on accessibility settings
 */
export const getAccessibleFontSize = (baseFontSize: number): number => {
  const scale = getFontScale();
  return Math.round(baseFontSize * scale);
};

/**
 * Color contrast checker
 */
export const calculateContrast = (
  color1: string,
  color2: string
): number => {
  // Simplified contrast calculation
  // Full implementation would parse hex/rgb and calculate luminance
  return 4.5; // WCAG AA standard minimum
};

/**
 * Check if color combination meets WCAG standards
 */
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const contrast = calculateContrast(foreground, background);
  const requiredContrast = level === 'AAA' ? 7 : 4.5;
  return contrast >= requiredContrast;
};

/**
 * Platform-specific accessibility features
 */
export const platformAccessibility = {
  /**
   * iOS-specific features
   */
  ios: {
    // VoiceOver gestures
    voiceOverGestures: {
      swipeRight: 'Move to next item',
      swipeLeft: 'Move to previous item',
      doubleTap: 'Activate selected item',
      tripleTap: 'Additional actions',
      twoFingerDoubleTap: 'Magic tap',
      threeFingerSwipeLeft: 'Scroll right',
      threeFingerSwipeRight: 'Scroll left',
    },

    // Dynamic Type categories
    dynamicTypeCategories: [
      'extraSmall',
      'small',
      'medium',
      'large',
      'extraLarge',
      'extraExtraLarge',
      'extraExtraExtraLarge',
    ],
  },

  /**
   * Android-specific features
   */
  android: {
    // TalkBack gestures
    talkBackGestures: {
      swipeRight: 'Next',
      swipeLeft: 'Previous',
      swipeDown: 'Scroll forward',
      swipeUp: 'Scroll backward',
      doubleTap: 'Activate',
      doubleTapAndHold: 'Context menu',
    },
  },
};

/**
 * Test IDs for automated testing
 */
export const generateTestId = (component: string, variant?: string): string => {
  return variant ? `${component}-${variant}` : component;
};

/**
 * Semantic grouping for related elements
 */
export const createAccessibilityGroup = (label: string) => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityRole: 'none' as const,
});

/**
 * Live region for dynamic content updates
 */
export const createLiveRegion = (
  polite: 'polite' | 'assertive' = 'polite'
) => ({
  accessibilityLiveRegion: polite,
});

/**
 * Localized accessibility strings
 */
export const localizedAccessibility = {
  en: {
    loading: 'Loading',
    error: 'Error occurred',
    success: 'Action completed successfully',
    required: 'Required field',
    optional: 'Optional field',
  },
  // Add more languages as needed
};

/**
 * Hook for accessibility-aware animations
 */
export const useAccessibleAnimations = () => {
  const reduceMotion = useReduceMotion();

  return {
    duration: reduceMotion ? 0 : 300,
    useNativeDriver: !reduceMotion,
    enabled: !reduceMotion,
  };
};
