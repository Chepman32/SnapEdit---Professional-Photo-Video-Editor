/**
 * Storage Service Tests
 */

import {storageService} from '../storage.service';

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear storage before each test
    jest.clearAllMocks();
  });

  describe('String Operations', () => {
    it('should store and retrieve string', () => {
      const key = 'test-string';
      const value = 'Hello World';

      storageService.setString(key, value);
      const result = storageService.getString(key);

      expect(result).toBe(value);
    });

    it('should return undefined for non-existent key', () => {
      const result = storageService.getString('non-existent');
      expect(result).toBeUndefined();
    });

    it('should delete string', () => {
      const key = 'test-delete';
      storageService.setString(key, 'value');
      storageService.deleteKey(key);

      const result = storageService.getString(key);
      expect(result).toBeUndefined();
    });
  });

  describe('Object Operations', () => {
    it('should store and retrieve object', () => {
      const key = 'test-object';
      const value = {name: 'John', age: 30};

      storageService.setObject(key, value);
      const result = storageService.getObject(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent object', () => {
      const result = storageService.getObject('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('Number Operations', () => {
    it('should store and retrieve number', () => {
      const key = 'test-number';
      const value = 42;

      storageService.setNumber(key, value);
      const result = storageService.getNumber(key);

      expect(result).toBe(value);
    });

    it('should return undefined for non-existent number', () => {
      const result = storageService.getNumber('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('Boolean Operations', () => {
    it('should store and retrieve boolean', () => {
      const key = 'test-boolean';
      const value = true;

      storageService.setBoolean(key, value);
      const result = storageService.getBoolean(key);

      expect(result).toBe(value);
    });

    it('should return undefined for non-existent boolean', () => {
      const result = storageService.getBoolean('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('Utility Methods', () => {
    it('should check if key exists', () => {
      const key = 'test-exists';
      storageService.setString(key, 'value');

      expect(storageService.contains(key)).toBe(true);
      expect(storageService.contains('non-existent')).toBe(false);
    });

    it('should get all keys', () => {
      storageService.setString('key1', 'value1');
      storageService.setString('key2', 'value2');

      const keys = storageService.getAllKeys();
      expect(Array.isArray(keys)).toBe(true);
    });

    it('should clear all storage', () => {
      storageService.setString('key1', 'value1');
      storageService.setString('key2', 'value2');

      storageService.clearAll();

      expect(storageService.getAllKeys().length).toBe(0);
    });
  });
});
