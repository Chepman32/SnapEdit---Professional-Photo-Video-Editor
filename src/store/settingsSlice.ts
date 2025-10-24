/**
 * Settings Slice
 * Manages app settings and preferences
 */

import {StateCreator} from 'zustand';
import {storageService} from '@services/storage';
import {STORAGE_KEYS} from '@constants';

export interface AppSettings {
  theme: 'dark' | 'light';
  language: string;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  exportFormat: 'jpeg' | 'png' | 'heic';
  exportQuality: number;
  autoSaveEdits: boolean;
  showGridWhenCropping: boolean;
  preserveExifData: boolean;
  performanceMode: 'quality' | 'balanced' | 'performance';
  defaultPhotoResolution: 'original' | 'large' | 'medium' | 'small';
  defaultVideoResolution: '4k' | '1080p' | '720p' | '480p';
  videoFrameRate: 24 | 30 | 60;
  includeWatermark: boolean;
  copyrightText: string;
}

export interface SettingsSlice {
  settings: AppSettings;

  // Actions
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  resetSettings: () => void;
  loadSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  hapticEnabled: true,
  soundEnabled: true,
  exportFormat: 'jpeg',
  exportQuality: 90,
  autoSaveEdits: true,
  showGridWhenCropping: true,
  preserveExifData: true,
  performanceMode: 'balanced',
  defaultPhotoResolution: 'original',
  defaultVideoResolution: '1080p',
  videoFrameRate: 30,
  includeWatermark: false,
  copyrightText: '',
};

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: defaultSettings,

  updateSetting: (key, value) => {
    set((state) => {
      const newSettings = {...state.settings, [key]: value};
      storageService.setObject(STORAGE_KEYS.userSettings, newSettings);
      return {settings: newSettings};
    });
  },

  resetSettings: () => {
    set({settings: defaultSettings});
    storageService.setObject(STORAGE_KEYS.userSettings, defaultSettings);
  },

  loadSettings: () => {
    const savedSettings = storageService.getObject<AppSettings>(
      STORAGE_KEYS.userSettings
    );
    if (savedSettings) {
      set({settings: {...defaultSettings, ...savedSettings}});
    }
  },
});
