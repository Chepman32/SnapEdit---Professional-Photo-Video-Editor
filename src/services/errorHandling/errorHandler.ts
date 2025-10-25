/**
 * Error Handling Service - Phase 29
 * Global error handling, logging, and crash reporting
 */

import {Alert} from 'react-native';

/**
 * Error types
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  PROCESSING = 'PROCESSING',
  PERMISSION = 'PERMISSION',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Custom error class
 */
export class AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  metadata?: Record<string, any>;
  timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.metadata = metadata;
    this.timestamp = new Date();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error handler class
 */
class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // Handle uncaught JavaScript errors
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      this.handleError(
        new AppError(
          error.message,
          ErrorType.UNKNOWN,
          isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
          {
            stack: error.stack,
            isFatal,
          }
        )
      );

      if (isFatal) {
        // Show alert for fatal errors
        Alert.alert(
          'Unexpected Error',
          'The app encountered an unexpected error and needs to restart.',
          [{text: 'OK'}]
        );
      }
    });

    // Handle Promise rejections
    const originalHandler = global.Promise.prototype.catch;
    global.Promise.prototype.catch = function (onRejected) {
      return originalHandler.call(this, (error: Error) => {
        ErrorHandler.getInstance().handleError(
          new AppError(
            error.message,
            ErrorType.UNKNOWN,
            ErrorSeverity.MEDIUM,
            {stack: error.stack}
          )
        );

        if (onRejected) {
          return onRejected(error);
        }
        throw error;
      });
    };
  }

  /**
   * Handle error
   */
  handleError(error: AppError | Error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(error.message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM);

    // Log error
    this.logError(appError);

    // Report to crash reporting service
    this.reportError(appError);

    // Show user-friendly message if needed
    if (appError.severity === ErrorSeverity.CRITICAL || appError.severity === ErrorSeverity.HIGH) {
      this.showErrorAlert(appError);
    }
  }

  /**
   * Log error locally
   */
  private logError(error: AppError) {
    // Add to local log
    this.errorLog.push(error);

    // Trim log if too large
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Console log in development
    if (__DEV__) {
      console.error('[AppError]', {
        message: error.message,
        type: error.type,
        severity: error.severity,
        metadata: error.metadata,
        stack: error.stack,
      });
    }
  }

  /**
   * Report error to crash reporting service
   */
  private reportError(error: AppError) {
    // In production, send to Sentry, Firebase Crashlytics, etc.
    // Example with Sentry:
    // Sentry.captureException(error, {
    //   level: this.getSentryLevel(error.severity),
    //   tags: {
    //     type: error.type,
    //   },
    //   extra: error.metadata,
    // });

    if (!__DEV__) {
      console.log('Reporting error to crash service:', error.message);
    }
  }

  /**
   * Show error alert to user
   */
  private showErrorAlert(error: AppError) {
    const message = this.getUserFriendlyMessage(error);

    Alert.alert(
      'Error',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            // Log user dismissed error
            console.log('User dismissed error');
          },
        },
      ],
      {cancelable: false}
    );
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Unable to connect to the internet. Please check your connection and try again.';

      case ErrorType.STORAGE:
        return 'Unable to access storage. Please check your device storage permissions.';

      case ErrorType.PROCESSING:
        return 'Unable to process your request. Please try again.';

      case ErrorType.PERMISSION:
        return 'This feature requires additional permissions. Please grant the necessary permissions in Settings.';

      case ErrorType.VALIDATION:
        return error.message; // Validation errors are usually user-friendly

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get error log
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Export error log
   */
  exportErrorLog(): string {
    return JSON.stringify(
      this.errorLog.map(error => ({
        message: error.message,
        type: error.type,
        severity: error.severity,
        metadata: error.metadata,
        timestamp: error.timestamp.toISOString(),
        stack: error.stack,
      })),
      null,
      2
    );
  }
}

/**
 * Network error handler
 */
export const handleNetworkError = (error: Error) => {
  ErrorHandler.getInstance().handleError(
    new AppError(
      error.message,
      ErrorType.NETWORK,
      ErrorSeverity.MEDIUM,
      {originalError: error.message}
    )
  );
};

/**
 * Storage error handler
 */
export const handleStorageError = (error: Error, operation: string) => {
  ErrorHandler.getInstance().handleError(
    new AppError(
      `Storage operation failed: ${operation}`,
      ErrorType.STORAGE,
      ErrorSeverity.HIGH,
      {operation, originalError: error.message}
    )
  );
};

/**
 * Processing error handler
 */
export const handleProcessingError = (
  error: Error,
  operation: string,
  fileUri?: string
) => {
  ErrorHandler.getInstance().handleError(
    new AppError(
      `Processing failed: ${operation}`,
      ErrorType.PROCESSING,
      ErrorSeverity.MEDIUM,
      {operation, fileUri, originalError: error.message}
    )
  );
};

/**
 * Permission error handler
 */
export const handlePermissionError = (permission: string) => {
  ErrorHandler.getInstance().handleError(
    new AppError(
      `Permission denied: ${permission}`,
      ErrorType.PERMISSION,
      ErrorSeverity.HIGH,
      {permission}
    )
  );
};

/**
 * Validation error handler
 */
export const handleValidationError = (field: string, message: string) => {
  ErrorHandler.getInstance().handleError(
    new AppError(message, ErrorType.VALIDATION, ErrorSeverity.LOW, {field})
  );
};

/**
 * Try-catch wrapper with error handling
 */
export const tryAsync = async <T>(
  operation: () => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN,
  errorMessage?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    ErrorHandler.getInstance().handleError(
      new AppError(
        errorMessage || (error as Error).message,
        errorType,
        ErrorSeverity.MEDIUM,
        {originalError: (error as Error).message}
      )
    );
    return null;
  }
};

/**
 * Retry mechanism with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new AppError(
    `Operation failed after ${maxRetries} retries: ${lastError!.message}`,
    ErrorType.UNKNOWN,
    ErrorSeverity.HIGH
  );
};

/**
 * Error boundary component helper
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const getErrorBoundaryDerivedStateFromError = (
  error: Error
): ErrorBoundaryState => {
  return {
    hasError: true,
    error,
  };
};

export const handleErrorBoundaryError = (
  error: Error,
  errorInfo: React.ErrorInfo
) => {
  ErrorHandler.getInstance().handleError(
    new AppError(
      error.message,
      ErrorType.UNKNOWN,
      ErrorSeverity.CRITICAL,
      {
        componentStack: errorInfo.componentStack,
        stack: error.stack,
      }
    )
  );
};

/**
 * Export singleton instance
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * Global error utilities
 */
export const errorUtils = {
  /**
   * Check if error is network-related
   */
  isNetworkError: (error: Error): boolean => {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  },

  /**
   * Check if error is permission-related
   */
  isPermissionError: (error: Error): boolean => {
    return (
      error.message.includes('permission') ||
      error.message.includes('denied') ||
      error.message.includes('unauthorized')
    );
  },

  /**
   * Get error message
   */
  getErrorMessage: (error: unknown): string => {
    if (error instanceof AppError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },
};

// Add React import for ErrorInfo type
import React from 'react';
