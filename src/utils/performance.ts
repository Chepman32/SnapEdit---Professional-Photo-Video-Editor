/**
 * Performance Optimization Utilities - Phase 27
 * Memoization, debouncing, throttling, and memory management
 */

import {useCallback, useEffect, useRef, useMemo} from 'react';
import {InteractionManager, Platform} from 'react-native';

/**
 * Debounce function - delays execution until after wait time has elapsed
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function - limits execution to once per wait time
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
};

/**
 * Memoize function results
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    return result;
  };
};

/**
 * Hook for debounced values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for throttled callbacks
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const throttledCallback = useRef<ReturnType<typeof throttle>>();

  useEffect(() => {
    throttledCallback.current = throttle(callback, delay);
  }, [callback, delay]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (throttledCallback.current) {
        throttledCallback.current(...args);
      }
    },
    []
  );
};

/**
 * Run task after interactions complete
 */
export const runAfterInteractions = (task: () => void): Promise<void> => {
  return new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      task();
      resolve();
    });
  });
};

/**
 * Batch state updates
 */
export class BatchUpdater {
  private queue: Array<() => void> = [];
  private rafId: number | null = null;

  add(update: () => void) {
    this.queue.push(update);

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  flush() {
    const updates = this.queue;
    this.queue = [];
    this.rafId = null;

    updates.forEach(update => update());
  }

  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.queue = [];
  }
}

/**
 * Image cache manager
 */
export class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, {data: any; timestamp: number}> = new Map();
  private maxSize: number;
  private maxAge: number;

  private constructor(maxSize = 50, maxAge = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  set(key: string, data: any) {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    Array.from(this.cache.entries()).forEach(([key, value]) => {
      if (now - value.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    });
  }

  getSize(): number {
    return this.cache.size;
  }
}

/**
 * Memory pressure handler
 */
export class MemoryManager {
  private static listeners: Array<() => void> = [];

  static addListener(callback: () => void) {
    this.listeners.push(callback);
  }

  static removeListener(callback: () => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  static triggerMemoryWarning() {
    this.listeners.forEach(callback => callback());

    // Clear image cache
    ImageCache.getInstance().clear();

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }
}

/**
 * Lazy initialization
 */
export const useLazyInit = <T>(initializer: () => T): T => {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = initializer();
  }

  return ref.current;
};

/**
 * Viewport optimization - only render visible items
 */
export interface ViewportItem {
  id: string;
  height: number;
}

export class VirtualScroller {
  private items: ViewportItem[];
  private containerHeight: number;
  private buffer: number;

  constructor(items: ViewportItem[], containerHeight: number, buffer = 2) {
    this.items = items;
    this.containerHeight = containerHeight;
    this.buffer = buffer;
  }

  getVisibleItems(scrollY: number): ViewportItem[] {
    let currentY = 0;
    const visibleItems: ViewportItem[] = [];

    for (const item of this.items) {
      const itemTop = currentY;
      const itemBottom = currentY + item.height;

      // Check if item is in viewport (with buffer)
      const bufferDistance = this.buffer * item.height;
      if (
        itemBottom >= scrollY - bufferDistance &&
        itemTop <= scrollY + this.containerHeight + bufferDistance
      ) {
        visibleItems.push(item);
      }

      currentY += item.height;
    }

    return visibleItems;
  }

  getTotalHeight(): number {
    return this.items.reduce((sum, item) => sum + item.height, 0);
  }
}

/**
 * FPS Monitor for debugging
 */
export class FPSMonitor {
  private frames = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;

  start(callback: (fps: number) => void) {
    const measureFPS = () => {
      this.frames++;
      const currentTime = performance.now();

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        callback(this.fps);
      }

      this.rafId = requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getCurrentFPS(): number {
    return this.fps;
  }
}

/**
 * Preload images
 */
export const preloadImages = async (uris: string[]): Promise<void> => {
  const promises = uris.map(uri => {
    return new Promise<void>((resolve, reject) => {
      // Use Image.prefetch in React Native
      // Image.prefetch(uri).then(() => resolve()).catch(reject);
      resolve();
    });
  });

  await Promise.all(promises);
};

/**
 * Optimize large lists rendering
 */
export const optimizeListRendering = {
  /**
   * Get optimal window size for FlatList
   */
  getWindowSize: (itemHeight: number, containerHeight: number) => {
    return Math.ceil(containerHeight / itemHeight) + 2;
  },

  /**
   * Get optimal initial number of items to render
   */
  getInitialNumToRender: (itemHeight: number, containerHeight: number) => {
    return Math.ceil(containerHeight / itemHeight);
  },

  /**
   * Get optimal max to render per batch
   */
  getMaxToRenderPerBatch: (itemHeight: number) => {
    return Math.max(5, Math.floor(100 / itemHeight));
  },
};

/**
 * Memory size calculator for images
 */
export const calculateImageMemory = (
  width: number,
  height: number,
  bytesPerPixel = 4
): number => {
  return width * height * bytesPerPixel;
};

/**
 * Convert bytes to human readable format
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Platform-specific optimizations
 */
export const platformOptimizations = {
  /**
   * Enable hardware acceleration on Android
   */
  enableHardwareAcceleration: Platform.OS === 'android',

  /**
   * Use native driver for animations
   */
  useNativeDriver: true,

  /**
   * Optimize images for device
   */
  optimizeImages: Platform.select({
    ios: {
      resizeMode: 'cover' as const,
      cache: 'default' as const,
    },
    android: {
      resizeMode: 'cover' as const,
      cache: 'default' as const,
      fadeDuration: 0,
    },
  }),
};

/**
 * React hook for measuring component render time
 */
export const useRenderTime = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const end = performance.now();
      if (__DEV__) {
        console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
      }
    };
  });
};

/**
 * Automatic React import for TypeScript files using hooks
 */
import React from 'react';
