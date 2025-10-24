/**
 * Navigation Types
 * Type definitions for all navigation stacks and params
 */

import type {NavigatorScreenParams} from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Editor: {imageUri: string; imageId?: string};
  VideoEditor: {videoUri: string; videoId?: string};
  Paywall: {feature?: string};
  Settings: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Tools: undefined;
  Profile: undefined;
};

// Gallery Stack (nested in Gallery tab)
export type GalleryStackParamList = {
  GalleryGrid: undefined;
  ImagePreview: {imageId: string; imageUri: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
