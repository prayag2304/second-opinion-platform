import DOMPurify from 'dompurify';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { formatDate, formatRelativeTime, formatCurrency, formatFileSize } from './formatters';
import { validateEmail, validatePassword, validatePhone } from './validation';
import { sanitizeInput as secureSanitizeInput, sanitizeHtml as secureSanitizeHtml } from './security';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html, options = {}) => {
  return secureSanitizeHtml(html, options);
};

/**
 * Sanitize user input with enhanced security
 * @param {string} input - User input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, options = {}) => {
  return secureSanitizeInput(input, options);
};

/**
 * Scroll to top of the page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Handle navigation with scroll to top
 * @param {Function} navigate - React Router navigate function
 * @param {string} path - Path to navigate to
 */
export const navigateWithScrollToTop = (navigate, path) => {
  navigate(path);
  scrollToTop();
};

/**
 * Check if current path matches the given path
 * @param {string} currentPath - Current pathname
 * @param {string} path - Path to check against
 * @returns {boolean} - True if paths match
 */
export const isCurrentPath = (currentPath, path) => {
  return currentPath === path;
};

// Re-export formatting functions from formatters utility
export { formatDate, formatRelativeTime, formatCurrency, formatFileSize };

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate random ID
 * @returns {string} - Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Import permission service for enhanced permission checking
import permissionService from '../services/permissionService';

/**
 * Check if user has permission for specific action and resource
 * @param {Object} user - User object
 * @param {string} action - Action (read, create, update, delete)
 * @param {string} resource - Resource (profile, applications, etc.)
 * @param {Object} options - Options for permission checking
 * @returns {Promise<boolean>} - Whether user has permission
 * @deprecated Use permissionService.hasPermission instead for async support
 */
export const hasPermission = async (user, action, resource, options = {}) => {
  return await permissionService.hasPermission(user, action, resource, options);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 * @deprecated Use validateEmail from validation.js instead
 */
export const isValidEmail = (email) => {
  return validateEmail(email);
};

/**
 * Generate star rating display
 * @param {number} rating - Rating value (0-5)
 * @returns {Array} - Array of star objects
 */
export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full', key: i });
  }

  if (hasHalfStar) {
    stars.push({ type: 'half', key: 'half' });
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ type: 'empty', key: `empty-${i}` });
  }

  return stars;
};

/**
 * Enhanced API error handling
 * @param {Error} error - Error object from API call
 * @returns {string} - User-friendly error message
 * @deprecated Use apiClient error handling instead
 */
export const handleApiError = (error) => {
  // Handle axios error response
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      case 401:
        // Handle unauthorized - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
      case 403:
        return data?.message || 'You do not have permission to perform this action.';
      case 404:
        return data?.message || 'Resource not found.';
      case 409:
        return data?.message || 'Resource already exists.';
      case 422:
        return data?.message || 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return data?.message || 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data?.message || `Error ${status}: An unexpected error occurred.`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error (e.g., timeout, cancellation)
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    if (error.name === 'CanceledError') {
      return 'Request was cancelled.';
    }
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Promise that resolves with function result
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Create query string from object
 * @param {Object} params - Parameters object
 * @returns {string} - Query string
 */
export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};
