/**
 * Storage Service using MMKV
 * High-performance key-value storage
 */

import {MMKV} from 'react-native-mmkv';
import {STORAGE_KEYS} from '@constants';

// Initialize MMKV instance
export const storage = new MMKV({
  id: 'snapedit-storage',
  encryptionKey: 'snapedit-encryption-key-2024',
});

/**
 * Storage utility functions
 */
export const storageService = {
  // String operations
  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  // Boolean operations
  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  // Number operations
  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  // Object operations (JSON)
  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  getObject: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  // Delete operations
  delete: (key: string): void => {
    storage.delete(key);
  },

  // Clear all
  clearAll: (): void => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};

// Typed storage keys
export const getStorageKey = (key: keyof typeof STORAGE_KEYS): string => {
  return STORAGE_KEYS[key];
};
