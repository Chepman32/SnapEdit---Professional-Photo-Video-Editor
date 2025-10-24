/**
 * Main Store
 * Combines all Zustand slices into a single store
 */

import {create} from 'zustand';
import {UserSlice, createUserSlice} from './userSlice';
import {SettingsSlice, createSettingsSlice} from './settingsSlice';
import {EditorSlice, createEditorSlice} from './editorSlice';
import {GallerySlice, createGallerySlice} from './gallerySlice';
import {SubscriptionSlice, createSubscriptionSlice} from './subscriptionSlice';

// Combined store type
export type AppStore = UserSlice &
  SettingsSlice &
  EditorSlice &
  GallerySlice &
  SubscriptionSlice;

// Create the store
export const useStore = create<AppStore>()((...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a),
  ...createEditorSlice(...a),
  ...createGallerySlice(...a),
  ...createSubscriptionSlice(...a),
}));

// Selector hooks for performance
export const useUser = () => useStore((state) => state.user);
export const useSettings = () => useStore((state) => state.settings);
export const useEditor = () => useStore((state) => ({
  currentImage: state.currentImage,
  currentVideo: state.currentVideo,
  currentState: state.currentState,
  history: state.history,
  historyIndex: state.historyIndex,
}));
export const useGallery = () => useStore((state) => ({
  photos: state.photos,
  selectedPhotos: state.selectedPhotos,
  isSelectionMode: state.isSelectionMode,
  sortBy: state.sortBy,
  filterBy: state.filterBy,
}));
export const useSubscription = () => useStore((state) => ({
  isPremium: state.isPremium,
  subscriptionType: state.subscriptionType,
  subscriptionEndDate: state.subscriptionEndDate,
}));

// Export slice types
export * from './userSlice';
export * from './settingsSlice';
export * from './editorSlice';
export * from './gallerySlice';
export * from './subscriptionSlice';
