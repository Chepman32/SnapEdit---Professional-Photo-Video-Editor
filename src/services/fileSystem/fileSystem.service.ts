/**
 * File System Service
 * Manages file operations for the app
 */

import RNFS from 'react-native-fs';
import {FILE_PATHS} from '@constants';

export const fileSystemService = {
  /**
   * Initialize app directories
   */
  initializeDirectories: async (): Promise<void> => {
    try {
      const directories = Object.values(FILE_PATHS).map(
        path => `${RNFS.DocumentDirectoryPath}/${path}`
      );

      for (const dir of directories) {
        const exists = await RNFS.exists(dir);
        if (!exists) {
          await RNFS.mkdir(dir);
        }
      }
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw error;
    }
  },

  /**
   * Save file to app storage
   */
  saveFile: async (
    content: string,
    filename: string,
    directory: keyof typeof FILE_PATHS = 'projectsDir'
  ): Promise<string> => {
    try {
      const dirPath = `${RNFS.DocumentDirectoryPath}/${FILE_PATHS[directory]}`;
      const filePath = `${dirPath}/${filename}`;

      await RNFS.writeFile(filePath, content, 'utf8');
      return filePath;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  },

  /**
   * Read file from storage
   */
  readFile: async (filePath: string): Promise<string> => {
    try {
      const content = await RNFS.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  },

  /**
   * Delete file
   */
  deleteFile: async (filePath: string): Promise<void> => {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  },

  /**
   * Copy file
   */
  copyFile: async (fromPath: string, toPath: string): Promise<void> => {
    try {
      await RNFS.copyFile(fromPath, toPath);
    } catch (error) {
      console.error('Failed to copy file:', error);
      throw error;
    }
  },

  /**
   * Move file
   */
  moveFile: async (fromPath: string, toPath: string): Promise<void> => {
    try {
      await RNFS.moveFile(fromPath, toPath);
    } catch (error) {
      console.error('Failed to move file:', error);
      throw error;
    }
  },

  /**
   * Get file info
   */
  getFileInfo: async (filePath: string): Promise<RNFS.StatResult> => {
    try {
      const info = await RNFS.stat(filePath);
      return info;
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw error;
    }
  },

  /**
   * List files in directory
   */
  listFiles: async (directoryPath: string): Promise<RNFS.ReadDirItem[]> => {
    try {
      const files = await RNFS.readDir(directoryPath);
      return files;
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  },

  /**
   * Clear cache
   */
  clearCache: async (): Promise<void> => {
    try {
      const cachePath = `${RNFS.DocumentDirectoryPath}/${FILE_PATHS.cacheDir}`;
      const exists = await RNFS.exists(cachePath);

      if (exists) {
        await RNFS.unlink(cachePath);
        await RNFS.mkdir(cachePath);
        // Recreate subdirectories
        await RNFS.mkdir(`${cachePath}/Thumbnails`);
        await RNFS.mkdir(`${cachePath}/Filters`);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  },

  /**
   * Get cache size
   */
  getCacheSize: async (): Promise<number> => {
    try {
      const cachePath = `${RNFS.DocumentDirectoryPath}/${FILE_PATHS.cacheDir}`;
      const files = await fileSystemService.listFiles(cachePath);

      let totalSize = 0;
      for (const file of files) {
        if (file.isFile()) {
          totalSize += file.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  },

  /**
   * Format bytes to human-readable size
   */
  formatBytes: (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
};
