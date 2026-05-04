import DOMPurify from 'dompurify';
import { jwtDecode } from 'jwt-decode';

/**
 * Enhanced Security Utilities
 * Comprehensive security functions for input sanitization, JWT validation, and injection prevention
 */

// Security patterns for input validation
const SECURITY_PATTERNS = {
  // SQL Injection patterns
  SQL_INJECTION: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b)/gi,
  
  // XSS patterns
  XSS_SCRIPT: /<script[^>]*>.*?<\/script>/gi,
  XSS_EVENT: /on\w+\s*=/gi,
  XSS_JAVASCRIPT: /javascript:/gi,
  XSS_VBSCRIPT: /vbscript:/gi,
  XSS_DATA: /data:/gi,
  
  // HTML injection patterns
  HTML_TAGS: /<[^>]*>/g,
  HTML_ENTITIES: /&[a-zA-Z0-9#]+;/g,
  
  // Command injection patterns
  COMMAND_INJECTION: /[;&|`$(){}[\]]/g,
  
  // Path traversal patterns
  PATH_TRAVERSAL: /\.\.\/|\.\.\\/g,
  
  // NoSQL injection patterns
  NOSQL_INJECTION: /(\$where|\$ne|\$gt|\$lt|\$regex)/gi,
  
  // LDAP injection patterns
  LDAP_INJECTION: /[()&|!]/g,
};

// JWT token configuration
const JWT_CONFIG = {
  // Token expiry buffer (5 minutes before actual expiry)
  EXPIRY_BUFFER: 5 * 60 * 1000,
  
  // Refresh token threshold (10 minutes before expiry)
  REFRESH_THRESHOLD: 10 * 60 * 1000,
  
  // Maximum token age (24 hours)
  MAX_TOKEN_AGE: 24 * 60 * 60 * 1000,
  
  // Minimum token age for refresh (1 hour)
  MIN_TOKEN_AGE: 60 * 60 * 1000,
};

/**
 * Enhanced input sanitization with comprehensive security checks
 * @param {string} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, options = {}) => {
  const {
    allowHtml = false,
    allowScripts = false,
    allowTags = false,
    maxLength = 1000,
    removeSpecialChars = true,
    trimWhitespace = true,
    escapeQuotes = true,
    validatePatterns = true
  } = options;

  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }

  // Check length
  if (sanitized.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  // Remove dangerous patterns if validation is enabled
  if (validatePatterns) {
    // SQL Injection prevention
    sanitized = sanitized.replace(SECURITY_PATTERNS.SQL_INJECTION, '');
    
    // XSS prevention
    if (!allowScripts) {
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS_SCRIPT, '');
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS_EVENT, '');
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS_JAVASCRIPT, '');
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS_VBSCRIPT, '');
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS_DATA, '');
    }
    
    // Command injection prevention
    sanitized = sanitized.replace(SECURITY_PATTERNS.COMMAND_INJECTION, '');
    
    // Path traversal prevention
    sanitized = sanitized.replace(SECURITY_PATTERNS.PATH_TRAVERSAL, '');
    
    // NoSQL injection prevention
    sanitized = sanitized.replace(SECURITY_PATTERNS.NOSQL_INJECTION, '');
    
    // LDAP injection prevention
    sanitized = sanitized.replace(SECURITY_PATTERNS.LDAP_INJECTION, '');
  }

  // Remove HTML tags if not allowed
  if (!allowTags) {
    sanitized = sanitized.replace(SECURITY_PATTERNS.HTML_TAGS, '');
  }

  // Remove special characters if requested
  if (removeSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s\-.,!?@#$%&*()+=]/g, '');
  }

  // Escape quotes if requested
  if (escapeQuotes) {
    sanitized = sanitized.replace(/['"]/g, '\\$&');
  }

  // Use DOMPurify for HTML content if allowed
  if (allowHtml) {
    sanitized = DOMPurify.sanitize(sanitized);
  }

  return sanitized;
};

/**
 * Sanitize HTML content with enhanced security
 * @param {string} html - HTML content to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html, options = {}) => {
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes = ['class', 'id', 'style'],
    allowedSchemes = ['http', 'https', 'mailto'],
    removeComments = true,
    removeEmptyElements = true
  } = options;

  if (typeof html !== 'string') {
    return html;
  }

  // Configure DOMPurify options
  const purifyOptions = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOWED_URI_REGEXP: new RegExp(`^(${allowedSchemes.join('|')}):`, 'i'),
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
  };

  let sanitized = DOMPurify.sanitize(html, purifyOptions);

  // Remove comments if requested
  if (removeComments) {
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
  }

  // Remove empty elements if requested
  if (removeEmptyElements) {
    sanitized = sanitized.replace(/<[^\/>][^>]*><\/[^>]*>/g, '');
  }

  return sanitized;
};

/**
 * Validate JWT token structure and content
 * @param {string} token - JWT token to validate
 * @returns {Object} - Validation result
 */
export const validateJwtToken = (token) => {
  if (!token || typeof token !== 'string') {
    return {
      isValid: false,
      error: 'Token is missing or invalid'
    };
  }

  try {
    // Decode token to check structure
    const decoded = jwtDecode(token);
    
    // Check required claims
    if (!decoded.exp || !decoded.iat || !decoded.sub) {
      return {
        isValid: false,
        error: 'Token missing required claims'
      };
    }

    // Check token age
    const tokenAge = Date.now() - (decoded.iat * 1000);
    if (tokenAge > JWT_CONFIG.MAX_TOKEN_AGE) {
      return {
        isValid: false,
        error: 'Token is too old'
      };
    }

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return {
        isValid: false,
        error: 'Token has expired'
      };
    }

    return {
      isValid: true,
      decoded,
      expiresAt: decoded.exp * 1000,
      issuedAt: decoded.iat * 1000,
      tokenAge: tokenAge
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Token is malformed'
    };
  }
};

/**
 * Check if token needs refresh
 * @param {string} token - JWT token to check
 * @returns {Object} - Refresh status
 */
export const shouldRefreshToken = (token) => {
  const validation = validateJwtToken(token);
  
  if (!validation.isValid) {
    return {
      shouldRefresh: false,
      reason: validation.error
    };
  }

  const timeUntilExpiry = validation.expiresAt - Date.now();
  const shouldRefresh = timeUntilExpiry < JWT_CONFIG.REFRESH_THRESHOLD;
  const isExpired = timeUntilExpiry < JWT_CONFIG.EXPIRY_BUFFER;

  return {
    shouldRefresh,
    isExpired,
    timeUntilExpiry,
    reason: isExpired ? 'Token expired' : shouldRefresh ? 'Token expiring soon' : 'Token valid'
  };
};

/**
 * Generate secure random string
 * @param {number} length - Length of random string
 * @returns {string} - Secure random string
 */
export const generateSecureRandom = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash sensitive data (basic implementation)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
export const hashData = async (data) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate email with enhanced security
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export const validateEmailSecurity = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Basic email pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return {
        isValid: false,
        error: 'Email contains suspicious content'
      };
    }
  }

  return {
    isValid: true,
    sanitized: sanitizeInput(email, { allowHtml: false, validatePatterns: true })
  };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !['password', '123456', 'qwerty', 'admin'].includes(password.toLowerCase()),
    noSequential: !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const isValid = passedChecks >= 5; // Require at least 5 checks to pass

  return {
    isValid,
    checks,
    passedChecks,
    strength: passedChecks < 3 ? 'weak' : passedChecks < 5 ? 'medium' : 'strong',
    error: isValid ? null : 'Password does not meet security requirements'
  };
};

/**
 * Sanitize form data before submission
 * @param {Object} formData - Form data to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData, options = {}) => {
  const {
    allowHtml = false,
    maxLength = 1000,
    removeSpecialChars = true,
    validatePatterns = true
  } = options;

  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, {
        allowHtml,
        maxLength,
        removeSpecialChars,
        validatePatterns
      });
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeFormData(value, options);
    } else {
      // Keep non-string values as-is
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @returns {Object} - Validation result
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL is required'
    };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Check for allowed protocols
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return {
        isValid: false,
        error: 'Only HTTP and HTTPS protocols are allowed'
      };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /data:/i,
      /file:/i,
      /<script/i,
      /on\w+\s*=/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return {
          isValid: false,
          error: 'URL contains suspicious content'
        };
      }
    }

    return {
      isValid: true,
      sanitized: parsedUrl.toString()
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format'
    };
  }
};

/**
 * Create CSRF token
 * @returns {string} - CSRF token
 */
export const createCsrfToken = () => {
  return generateSecureRandom(32);
};

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @param {string} storedToken - Stored token to compare against
 * @returns {boolean} - Whether token is valid
 */
export const validateCsrfToken = (token, storedToken) => {
  return token && storedToken && token === storedToken;
};

/**
 * Security headers for API requests
 * @returns {Object} - Security headers
 */
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  };
};

/**
 * Rate limiting helper
 * @param {string} key - Rate limit key
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - Whether request is allowed
 */
export const checkRateLimit = (key, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests for this key
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Filter requests within the current window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  // Check if we're under the limit
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
  
  return true;
};

export default {
  sanitizeInput,
  sanitizeHtml,
  validateJwtToken,
  shouldRefreshToken,
  generateSecureRandom,
  hashData,
  validateEmailSecurity,
  validatePasswordStrength,
  sanitizeFormData,
  validateUrl,
  createCsrfToken,
  validateCsrfToken,
  getSecurityHeaders,
  checkRateLimit
}; 