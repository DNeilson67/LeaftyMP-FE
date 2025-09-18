// Enhanced error handling utility for lock conflicts and other API errors
import { ApiError } from './marketShipmentApi';

export class LockConflictError extends ApiError {
  constructor(message, retryAfter = 30) {
    super(message, 423);
    this.retryAfter = retryAfter; // seconds to wait before retry
    this.name = 'LockConflictError';
  }
}

export const ErrorTypes = {
  LOCK_CONFLICT: 'LOCK_CONFLICT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const parseApiError = (error) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 423:
        return {
          type: ErrorTypes.LOCK_CONFLICT,
          title: 'Resource Currently Locked',
          message: error.message || 'This item is currently being processed by another user. Please try again in a few moments.',
          canRetry: true,
          retryAfter: 30,
          severity: 'warning',
          icon: '🔒'
        };
      
      case 403:
        return {
          type: ErrorTypes.PERMISSION_DENIED,
          title: 'Permission Denied',
          message: error.message || 'You do not have permission to perform this action.',
          canRetry: false,
          severity: 'error',
          icon: '🚫'
        };
      
      case 404:
        return {
          type: ErrorTypes.NOT_FOUND,
          title: 'Resource Not Found',
          message: error.message || 'The requested item could not be found.',
          canRetry: false,
          severity: 'error',
          icon: '❓'
        };
      
      case 400:
        return {
          type: ErrorTypes.VALIDATION_ERROR,
          title: 'Invalid Request',
          message: error.message || 'The request contains invalid data.',
          canRetry: false,
          severity: 'error',
          icon: '⚠️'
        };
      
      case 500:
      case 502:
      case 503:
        return {
          type: ErrorTypes.SERVER_ERROR,
          title: 'Server Error',
          message: 'A server error occurred. Please try again later.',
          canRetry: true,
          retryAfter: 60,
          severity: 'error',
          icon: '🔧'
        };
      
      default:
        return {
          type: ErrorTypes.UNKNOWN_ERROR,
          title: 'Unexpected Error',
          message: error.message || 'An unexpected error occurred.',
          canRetry: true,
          retryAfter: 30,
          severity: 'error',
          icon: '❌'
        };
    }
  }
  
  // Network or other errors
  return {
    type: ErrorTypes.NETWORK_ERROR,
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    canRetry: true,
    retryAfter: 10,
    severity: 'error',
    icon: '🌐'
  };
};

export const getRetryDelay = (attempt, baseDelay = 1000) => {
  // Exponential backoff with jitter
  const delay = Math.min(baseDelay * Math.pow(2, attempt), 30000);
  const jitter = Math.random() * 0.1 * delay;
  return delay + jitter;
};

export const formatErrorMessage = (error, context = '') => {
  const parsedError = parseApiError(error);
  
  let message = parsedError.message;
  
  if (context) {
    message = `${context}: ${message}`;
  }
  
  if (parsedError.canRetry && parsedError.retryAfter) {
    message += ` Please try again in ${parsedError.retryAfter} seconds.`;
  }
  
  return {
    ...parsedError,
    message
  };
};