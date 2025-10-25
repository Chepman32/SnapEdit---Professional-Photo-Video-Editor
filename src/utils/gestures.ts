/**
 * Gesture System - Phase 22
 * Complete gesture handling utilities for canvas interactions
 */

import {Gesture} from 'react-native-gesture-handler';
import {SharedValue, runOnJS, withSpring, withDecay} from 'react-native-reanimated';

export interface GestureState {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  rotation: SharedValue<number>;
  savedScale: SharedValue<number>;
  savedTranslateX: SharedValue<number>;
  savedTranslateY: SharedValue<number>;
  savedRotation: SharedValue<number>;
}

export interface GestureConfig {
  minScale?: number;
  maxScale?: number;
  enableRotation?: boolean;
  enableTranslation?: boolean;
  boundaryWidth?: number;
  boundaryHeight?: number;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}

/**
 * Create comprehensive gesture handlers for image/canvas manipulation
 */
export const createCanvasGestures = (
  state: GestureState,
  config: GestureConfig = {}
) => {
  const {
    minScale = 0.5,
    maxScale = 5.0,
    enableRotation = true,
    enableTranslation = true,
    boundaryWidth,
    boundaryHeight,
    onGestureStart,
    onGestureEnd,
  } = config;

  // Clamp scale within bounds
  const clampScale = (value: number) => {
    'worklet';
    return Math.max(minScale, Math.min(maxScale, value));
  };

  // Clamp translation within bounds
  const clampTranslation = (value: number, boundary?: number) => {
    'worklet';
    if (!boundary) return value;
    const maxTranslation = boundary / 2;
    return Math.max(-maxTranslation, Math.min(maxTranslation, value));
  };

  // Pinch gesture for scaling
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      if (onGestureStart) {
        runOnJS(onGestureStart)();
      }
    })
    .onUpdate(event => {
      const newScale = state.savedScale.value * event.scale;
      state.scale.value = clampScale(newScale);
    })
    .onEnd(() => {
      state.savedScale.value = state.scale.value;
      if (onGestureEnd) {
        runOnJS(onGestureEnd)();
      }
    });

  // Pan gesture for translation
  const panGesture = Gesture.Pan()
    .enabled(enableTranslation)
    .onStart(() => {
      if (onGestureStart) {
        runOnJS(onGestureStart)();
      }
    })
    .onUpdate(event => {
      const newX = state.savedTranslateX.value + event.translationX;
      const newY = state.savedTranslateY.value + event.translationY;

      state.translateX.value = clampTranslation(newX, boundaryWidth);
      state.translateY.value = clampTranslation(newY, boundaryHeight);
    })
    .onEnd(event => {
      state.savedTranslateX.value = state.translateX.value;
      state.savedTranslateY.value = state.translateY.value;

      // Apply momentum if velocity is high enough
      if (Math.abs(event.velocityX) > 500 || Math.abs(event.velocityY) > 500) {
        state.translateX.value = withDecay({
          velocity: event.velocityX,
          clamp: boundaryWidth
            ? [-boundaryWidth / 2, boundaryWidth / 2]
            : undefined,
        });
        state.translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: boundaryHeight
            ? [-boundaryHeight / 2, boundaryHeight / 2]
            : undefined,
        });
      }

      if (onGestureEnd) {
        runOnJS(onGestureEnd)();
      }
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .enabled(enableRotation)
    .onStart(() => {
      if (onGestureStart) {
        runOnJS(onGestureStart)();
      }
    })
    .onUpdate(event => {
      state.rotation.value = state.savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      state.savedRotation.value = state.rotation.value;
      if (onGestureEnd) {
        runOnJS(onGestureEnd)();
      }
    });

  // Double tap to reset or zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (state.scale.value > 1) {
        // Reset to default
        state.scale.value = withSpring(1);
        state.translateX.value = withSpring(0);
        state.translateY.value = withSpring(0);
        state.rotation.value = withSpring(0);
        state.savedScale.value = 1;
        state.savedTranslateX.value = 0;
        state.savedTranslateY.value = 0;
        state.savedRotation.value = 0;
      } else {
        // Zoom in
        state.scale.value = withSpring(2);
        state.savedScale.value = 2;
      }
    });

  // Compose gestures with proper priorities
  const composedGesture = Gesture.Simultaneous(
    Gesture.Race(doubleTapGesture, pinchGesture),
    panGesture,
    rotationGesture
  );

  return composedGesture;
};

/**
 * Reset gesture state to default values
 */
export const resetGestureState = (state: GestureState, animated = true) => {
  'worklet';

  if (animated) {
    state.scale.value = withSpring(1);
    state.translateX.value = withSpring(0);
    state.translateY.value = withSpring(0);
    state.rotation.value = withSpring(0);
  } else {
    state.scale.value = 1;
    state.translateX.value = 0;
    state.translateY.value = 0;
    state.rotation.value = 0;
  }

  state.savedScale.value = 1;
  state.savedTranslateX.value = 0;
  state.savedTranslateY.value = 0;
  state.savedRotation.value = 0;
};

/**
 * Create drawing gesture for canvas
 */
export const createDrawingGesture = (
  onDrawingUpdate: (x: number, y: number, isEnd: boolean) => void
) => {
  const drawingGesture = Gesture.Pan()
    .onUpdate(event => {
      runOnJS(onDrawingUpdate)(event.x, event.y, false);
    })
    .onEnd(event => {
      runOnJS(onDrawingUpdate)(event.x, event.y, true);
    });

  return drawingGesture;
};

/**
 * Create crop gesture for crop handles
 */
export interface CropHandleState {
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
}

export type CropHandle = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export const createCropHandleGesture = (
  handle: CropHandle,
  state: CropHandleState,
  config: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
  } = {}
) => {
  const {
    minWidth = 50,
    minHeight = 50,
    maxWidth = 1000,
    maxHeight = 1000,
    aspectRatio,
  } = config;

  const savedX = {value: 0};
  const savedY = {value: 0};
  const savedWidth = {value: 0};
  const savedHeight = {value: 0};

  const cropGesture = Gesture.Pan()
    .onStart(() => {
      savedX.value = state.x.value;
      savedY.value = state.y.value;
      savedWidth.value = state.width.value;
      savedHeight.value = state.height.value;
    })
    .onUpdate(event => {
      let newX = savedX.value;
      let newY = savedY.value;
      let newWidth = savedWidth.value;
      let newHeight = savedHeight.value;

      switch (handle) {
        case 'topLeft':
          newX = savedX.value + event.translationX;
          newY = savedY.value + event.translationY;
          newWidth = savedWidth.value - event.translationX;
          newHeight = savedHeight.value - event.translationY;
          break;
        case 'topRight':
          newY = savedY.value + event.translationY;
          newWidth = savedWidth.value + event.translationX;
          newHeight = savedHeight.value - event.translationY;
          break;
        case 'bottomLeft':
          newX = savedX.value + event.translationX;
          newWidth = savedWidth.value - event.translationX;
          newHeight = savedHeight.value + event.translationY;
          break;
        case 'bottomRight':
          newWidth = savedWidth.value + event.translationX;
          newHeight = savedHeight.value + event.translationY;
          break;
      }

      // Apply aspect ratio constraint if specified
      if (aspectRatio) {
        const targetHeight = newWidth / aspectRatio;
        newHeight = targetHeight;
      }

      // Clamp dimensions
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Update state
      state.x.value = newX;
      state.y.value = newY;
      state.width.value = newWidth;
      state.height.value = newHeight;
    });

  return cropGesture;
};

/**
 * Create text layer drag gesture
 */
export interface TextLayerState {
  x: SharedValue<number>;
  y: SharedValue<number>;
  rotation: SharedValue<number>;
  scale: SharedValue<number>;
}

export const createTextLayerGesture = (
  state: TextLayerState,
  config: {
    boundaryWidth?: number;
    boundaryHeight?: number;
    onSelect?: () => void;
  } = {}
) => {
  const {boundaryWidth, boundaryHeight, onSelect} = config;

  const savedX = {value: 0};
  const savedY = {value: 0};
  const savedRotation = {value: 0};
  const savedScale = {value: 1};

  // Drag gesture
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      savedX.value = state.x.value;
      savedY.value = state.y.value;
      if (onSelect) {
        runOnJS(onSelect)();
      }
    })
    .onUpdate(event => {
      let newX = savedX.value + event.translationX;
      let newY = savedY.value + event.translationY;

      if (boundaryWidth) {
        newX = Math.max(0, Math.min(boundaryWidth, newX));
      }
      if (boundaryHeight) {
        newY = Math.max(0, Math.min(boundaryHeight, newY));
      }

      state.x.value = newX;
      state.y.value = newY;
    });

  // Pinch to scale
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = state.scale.value;
    })
    .onUpdate(event => {
      const newScale = savedScale.value * event.scale;
      state.scale.value = Math.max(0.5, Math.min(3, newScale));
    })
    .onEnd(() => {
      savedScale.value = state.scale.value;
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      savedRotation.value = state.rotation.value;
    })
    .onUpdate(event => {
      state.rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = state.rotation.value;
    });

  // Tap to select
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onSelect) {
      runOnJS(onSelect)();
    }
  });

  return Gesture.Simultaneous(
    dragGesture,
    pinchGesture,
    rotationGesture,
    tapGesture
  );
};

/**
 * Snap value to grid
 */
export const snapToGrid = (value: number, gridSize: number) => {
  'worklet';
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  'worklet';
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Calculate angle between two points
 */
export const calculateAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  'worklet';
  return Math.atan2(y2 - y1, x2 - x1);
};

/**
 * Check if point is within bounds
 */
export const isPointInBounds = (
  x: number,
  y: number,
  bounds: {x: number; y: number; width: number; height: number}
) => {
  'worklet';
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
};
