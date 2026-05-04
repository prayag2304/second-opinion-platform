/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are properly configured
 */

/**
 * Validate required environment variables
 * @returns {Object} - Validation result with status and missing variables
 */
export const validateEnvironmentVariables = () => {
  const requiredVars = ['VITE_API_BASE_URL'];

  const missingVars = [];
  const validationResult = {};

  requiredVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
      validationResult[varName] = false;
    } else {
      validationResult[varName] = true;
    }
  });

  return {
    isValid: missingVars.length === 0,
    missingVariables: missingVars,
    validationResult,
    environment: import.meta.env.MODE
  };
};

/**
 * Get environment variable with fallback
 * @param {string} varName - Environment variable name
 * @param {string} fallback - Fallback value
 * @returns {string} - Environment variable value or fallback
 */
export const getEnvVar = (varName, fallback = '') => {
  const value = import.meta.env[varName];
  return value || fallback;
};

/**
 * Check if running in development mode
 * @returns {boolean} - Is development mode
 */
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

/**
 * Check if running in production mode
 * @returns {boolean} - Is production mode
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Get API base URL with validation
 * @returns {string} - API base URL
 */
export const getApiBaseUrl = () => {
  const baseUrl = getEnvVar('VITE_API_BASE_URL');
  if (!baseUrl) {
    console.error('VITE_API_BASE_URL is not configured');
    return 'http://localhost:8080';
  }
  return baseUrl;
};

/**
 * Get Razorpay configuration with validation
 * @returns {Object} - Razorpay configuration
 */
export const getRazorpayConfig = () => {
  const keyId = getEnvVar('VITE_RAZORPAY_KEY_ID');
  const keySecret = getEnvVar('VITE_RAZORPAY_KEY_SECRET');

  if (!keyId) {
    console.warn('VITE_RAZORPAY_KEY_ID is not configured');
  }

  if (!keySecret) {
    console.warn('VITE_RAZORPAY_KEY_SECRET is not configured');
  }

  return {
    keyId,
    keySecret,
    isConfigured: !!(keyId && keySecret),
    environment: import.meta.env.MODE
  };
};

/**
 * Validate payment gateway configuration
 * @returns {Object} - Payment gateway validation result
 */
export const validatePaymentGateway = () => {
  const razorpayConfig = getRazorpayConfig();

  return {
    razorpay: {
      isConfigured: razorpayConfig.isConfigured,
      keyId: !!razorpayConfig.keyId,
      keySecret: !!razorpayConfig.keySecret,
      environment: razorpayConfig.environment
    },
    overall: {
      isConfigured: razorpayConfig.isConfigured,
      availableGateways: razorpayConfig.isConfigured ? ['razorpay'] : []
    }
  };
};

/**
 * Log environment validation results
 * @param {boolean} showWarnings - Whether to show warnings in console
 */
export const logEnvironmentValidation = (showWarnings = true) => {
  const validation = validateEnvironmentVariables();
  const paymentValidation = validatePaymentGateway();

  if (showWarnings) {
    if (!validation.isValid) {
      console.warn('Missing environment variables:', validation.missingVariables);
    }

    if (!paymentValidation.overall.isConfigured) {
      console.warn('Payment gateway is not properly configured');
    }
  }

  return {
    environment: validation,
    payment: paymentValidation
  };
};

/**
 * Initialize environment validation
 * Call this in your app initialization
 */
export const initializeEnvironmentValidation = () => {
  const results = logEnvironmentValidation();

  // In development, show detailed validation
  if (isDevelopment()) {
    console.group('Environment Validation');
    console.log('Environment:', results.environment);
    console.log('Payment Gateway:', results.payment);
    console.groupEnd();
  }

  return results;
};

export default {
  validateEnvironmentVariables,
  getEnvVar,
  isDevelopment,
  isProduction,
  getApiBaseUrl,
  getRazorpayConfig,
  validatePaymentGateway,
  logEnvironmentValidation,
  initializeEnvironmentValidation
}; 