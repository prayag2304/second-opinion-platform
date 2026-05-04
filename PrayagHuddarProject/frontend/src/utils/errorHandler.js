import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Centralized Error Handling Utility
 * Provides consistent error handling across the application
 */
class ErrorHandler {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  /**
   * Handle API errors with consistent messaging
   * @param {Error} error - Error object from API call
   * @param {Object} options - Error handling options
   * @returns {Object} - Error handling result
   */
  handleApiError(error, options = {}) {
    const {
      showToast = true,
      redirectOnAuth = true,
      logError = true,
      customMessage = null
    } = options;

    let errorMessage = customMessage;
    let errorCode = null;
    let shouldRedirect = false;

    // Handle axios error response
    if (error.response) {
      const { status, data } = error.response;
      errorCode = status;

      switch (status) {
        case 400:
          // Check for validation error details
          if (data?.error?.code === 'VALIDATION_ERROR' && data?.error?.details) {
            // Format validation errors
            const validationErrors = Object.entries(data.error.details)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
            errorMessage = validationErrors || data?.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          } else {
            errorMessage = data?.error?.message || data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          }
          break;
        case 401:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          shouldRedirect = redirectOnAuth;
          break;
        case 403:
          errorMessage = data?.message || ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          errorMessage = data?.message || ERROR_MESSAGES.NOT_FOUND;
          break;
        case 409:
          errorMessage = data?.message || 'Resource already exists.';
          break;
        case 422:
          errorMessage = data?.message || 'Validation error. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = data?.message || ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorMessage = data?.message || ERROR_MESSAGES.GENERIC_ERROR;
      }
    } else if (error.request) {
      // Network error
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      errorCode = 'NETWORK_ERROR';
    } else {
      // Other error (e.g., timeout, cancellation)
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
        errorCode = 'TIMEOUT';
      } else if (error.name === 'CanceledError') {
        errorMessage = 'Request was cancelled.';
        errorCode = 'CANCELLED';
      } else {
        errorMessage = error.message || ERROR_MESSAGES.GENERIC_ERROR;
        errorCode = 'UNKNOWN';
      }
    }

    // Log error in development
    if (logError && this.isDevelopment) {
      console.group('API Error');
      console.error('Error:', error);
      console.error('Message:', errorMessage);
      console.error('Code:', errorCode);
      console.groupEnd();
    }

    // Show toast notification
    if (showToast && errorMessage) {
      toast.error(errorMessage);
    }

    // Handle authentication redirect
    if (shouldRedirect) {
      this.handleAuthRedirect();
    }

    return {
      message: errorMessage,
      code: errorCode,
      originalError: error,
      handled: true
    };
  }

  /**
   * Handle authentication redirect
   */
  handleAuthRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Handle service method errors with consistent pattern
   * @param {Function} serviceMethod - Service method to execute
   * @param {Object} options - Error handling options
   * @returns {Promise} - Promise resolving to service result
   */
  async handleServiceError(serviceMethod, options = {}) {
    const {
      showToast = true,
      logError = true,
      customMessage = null,
      fallbackValue = null
    } = options;

    try {
      return await serviceMethod();
    } catch (error) {
      const errorResult = this.handleApiError(error, {
        showToast,
        logError,
        customMessage
      });

      // Return fallback value if specified
      if (fallbackValue !== null) {
        return fallbackValue;
      }

      // Re-throw the error for the caller to handle
      throw errorResult;
    }
  }

  /**
   * Handle file upload errors
   * @param {Error} error - File upload error
   * @param {Object} options - Error handling options
   * @returns {Object} - Error handling result
   */
  handleFileError(error, options = {}) {
    const {
      showToast = true,
      customMessage = null
    } = options;

    let errorMessage = customMessage;

    if (error.name === 'FileError') {
      errorMessage = error.message;
    } else if (error.code === 'FILE_TOO_LARGE') {
      errorMessage = 'File size exceeds the maximum allowed limit.';
    } else if (error.code === 'INVALID_FILE_TYPE') {
      errorMessage = 'File type is not supported.';
    } else {
      errorMessage = 'Failed to upload file. Please try again.';
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      code: 'FILE_ERROR',
      originalError: error,
      handled: true
    };
  }

  /**
   * Handle payment errors
   * @param {Error} error - Payment error
   * @param {Object} options - Error handling options
   * @returns {Object} - Error handling result
   */
  handlePaymentError(error, options = {}) {
    const {
      showToast = true,
      customMessage = null
    } = options;

    let errorMessage = customMessage;

    if (error.code === 'PAYMENT_FAILED') {
      errorMessage = 'Payment failed. Please try again.';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds. Please check your payment method.';
    } else if (error.code === 'PAYMENT_CANCELLED') {
      errorMessage = 'Payment was cancelled.';
    } else {
      errorMessage = 'Payment error occurred. Please try again.';
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      code: 'PAYMENT_ERROR',
      originalError: error,
      handled: true
    };
  }

  /**
   * Handle validation errors
   * @param {Array} errors - Validation errors array
   * @param {Object} options - Error handling options
   * @returns {Object} - Error handling result
   */
  handleValidationError(errors, options = {}) {
    const {
      showToast = true,
      customMessage = null
    } = options;

    let errorMessage = customMessage;

    if (Array.isArray(errors) && errors.length > 0) {
      errorMessage = errors.join(', ');
    } else if (typeof errors === 'string') {
      errorMessage = errors;
    } else {
      errorMessage = 'Please check your input and try again.';
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      code: 'VALIDATION_ERROR',
      errors: Array.isArray(errors) ? errors : [errors],
      handled: true
    };
  }

  /**
   * Handle general application errors
   * @param {Error} error - General error
   * @param {Object} options - Error handling options
   * @returns {Object} - Error handling result
   */
  handleGeneralError(error, options = {}) {
    const {
      showToast = true,
      logError = true,
      customMessage = null
    } = options;

    let errorMessage = customMessage || error.message || 'An unexpected error occurred.';

    // Log error in development
    if (logError && this.isDevelopment) {
      console.error('General Error:', error);
    }

    // Show toast notification
    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      code: 'GENERAL_ERROR',
      originalError: error,
      handled: true
    };
  }

  /**
   * Create a service wrapper with error handling
   * @param {Function} serviceMethod - Service method to wrap
   * @param {Object} options - Error handling options
   * @returns {Function} - Wrapped service method
   */
  createServiceWrapper(serviceMethod, options = {}) {
    return async (...args) => {
      return this.handleServiceError(
        () => serviceMethod(...args),
        options
      );
    };
  }

  /**
   * Handle async operations with loading state
   * @param {Function} operation - Async operation to execute
   * @param {Object} options - Error handling options
   * @returns {Promise} - Promise resolving to operation result
   */
  async handleAsyncOperation(operation, options = {}) {
    const {
      showLoading = true,
      loadingMessage = 'Processing...',
      showToast = true,
      logError = true
    } = options;

    // Show loading toast if requested
    let loadingToast = null;
    if (showLoading && showToast) {
      loadingToast = toast.loading(loadingMessage);
    }

    try {
      const result = await operation();
      
      // Dismiss loading toast
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      return result;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      // Handle the error
      return this.handleApiError(error, {
        showToast,
        logError
      });
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;

// Export individual methods for convenience
export const {
  handleApiError,
  handleServiceError,
  handleFileError,
  handlePaymentError,
  handleValidationError,
  handleGeneralError,
  createServiceWrapper,
  handleAsyncOperation
} = errorHandler; 