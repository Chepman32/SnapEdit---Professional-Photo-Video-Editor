/**
 * App Constants
 */

export const APP_CONFIG = {
  name: 'SnapEdit',
  version: '1.0.0',
  buildNumber: 1,
} as const;

// In-App Purchase Product IDs
export const IAP_PRODUCTS = {
  monthly: 'com.snapedit.monthly',
  yearly: 'com.snapedit.yearly',
  lifetime: 'com.snapedit.lifetime',
} as const;

// Storage Keys for MMKV
export const STORAGE_KEYS = {
  userSettings: 'user_settings',
  editHistory: 'edit_history',
  subscriptionStatus: 'subscription_status',
  onboardingComplete: 'onboarding_complete',
  isPremium: 'is_premium',
} as const;

// File system paths
export const FILE_PATHS = {
  documentsDir: 'SnapEdit',
  projectsDir: 'SnapEdit/Projects',
  exportsDir: 'SnapEdit/Exports',
  cacheDir: 'SnapEdit/Cache',
  thumbnailsDir: 'SnapEdit/Cache/Thumbnails',
  filtersDir: 'SnapEdit/Cache/Filters',
} as const;

// Feature limits
export const FEATURE_LIMITS = {
  free: {
    maxTextLayers: 3,
    maxDrawingLayers: 3,
    videoResolution: '480p',
    maxExports: 3,
  },
  premium: {
    maxTextLayers: Infinity,
    maxDrawingLayers: Infinity,
    videoResolution: '4k',
    maxExports: Infinity,
  },
} as const;

// Filter names
export const FILTER_NAMES = {
  // Free filters
  original: 'Original',
  vivid: 'Vivid',
  dramatic: 'Dramatic',
  mono: 'Mono',
  noir: 'Noir',
  fade: 'Fade',
  chrome: 'Chrome',
  instant: 'Instant',

  // Premium filters
  cinematic: 'Cinematic',
  goldenHour: 'Golden Hour',
  arctic: 'Arctic',
  vintageFilm: 'Vintage Film',
  cyberpunk: 'Cyberpunk',
  pastelDreams: 'Pastel Dreams',
  highFashion: 'High Fashion',
  moodyDark: 'Moody Dark',
} as const;

export const FREE_FILTERS = [
  FILTER_NAMES.original,
  FILTER_NAMES.vivid,
  FILTER_NAMES.dramatic,
  FILTER_NAMES.mono,
  FILTER_NAMES.noir,
  FILTER_NAMES.fade,
  FILTER_NAMES.chrome,
  FILTER_NAMES.instant,
] as const;

export const PREMIUM_FILTERS = [
  FILTER_NAMES.cinematic,
  FILTER_NAMES.goldenHour,
  FILTER_NAMES.arctic,
  FILTER_NAMES.vintageFilm,
  FILTER_NAMES.cyberpunk,
  FILTER_NAMES.pastelDreams,
  FILTER_NAMES.highFashion,
  FILTER_NAMES.moodyDark,
] as const;
