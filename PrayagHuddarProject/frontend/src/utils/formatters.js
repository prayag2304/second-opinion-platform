import { format, formatDistanceToNow, isValid } from 'date-fns';

/**
 * Formatters Utility
 * Centralized formatting functions for consistent data presentation
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const {
    locale = 'en-US',
    year = 'numeric',
    month = 'long',
    day = 'numeric',
    timeZone = undefined
  } = options;
  
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year,
    month,
    day,
    timeZone
  });
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date, options = {}) => {
  if (!date) return '';
  
  const {
    addSuffix = true,
    includeSeconds = false,
    locale = undefined
  } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  
  return formatDistanceToNow(dateObj, { 
    addSuffix, 
    includeSeconds,
    locale 
  });
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    style = 'currency',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style,
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes, options = {}) => {
  if (bytes === 0) return '0 Bytes';
  
  const {
    precision = 2,
    base = 1024,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  } = options;
  
  const i = Math.floor(Math.log(bytes) / Math.log(base));
  const size = bytes / Math.pow(base, i);
  
  return parseFloat(size.toFixed(precision)) + ' ' + sizes[i];
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, options = {}) => {
  const {
    precision = 1,
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value / 100);
};

/**
 * Format number with appropriate separators
 * @param {number} number - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted number
 */
export const formatNumber = (number, options = {}) => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard'
  } = options;
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation
  }).format(number);
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone, options = {}) => {
  if (!phone) return '';
  
  const {
    format = 'standard', // 'standard', 'international', 'compact'
    locale = 'en-US'
  } = options;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (format === 'international') {
    // Format as +1 (555) 123-4567
    if (digits.length === 10) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  } else if (format === 'compact') {
    // Format as (555) 123-4567
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  }
  
  // Default format
  return phone;
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds, options = {}) => {
  const {
    format = 'auto', // 'auto', 'short', 'long'
    showSeconds = true
  } = options;
  
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (format === 'short') {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m${showSeconds && remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
    } else {
      return `${remainingSeconds}s`;
    }
  } else if (format === 'long') {
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (showSeconds && remainingSeconds > 0) parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
    return parts.join(', ');
  }
  
  // Auto format
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format file name for display
 * @param {string} filename - File name to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted file name
 */
export const formatFileName = (filename, options = {}) => {
  if (!filename) return '';
  
  const {
    maxLength = 30,
    showExtension = true,
    ellipsis = '...'
  } = options;
  
  if (filename.length <= maxLength) {
    return filename;
  }
  
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  const extension = filename.substring(filename.lastIndexOf('.'));
  
  if (showExtension) {
    const maxNameLength = maxLength - extension.length - ellipsis.length;
    return nameWithoutExt.substring(0, maxNameLength) + ellipsis + extension;
  } else {
    return filename.substring(0, maxLength) + ellipsis;
  }
};

/**
 * Format address for display
 * @param {Object} address - Address object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, options = {}) => {
  if (!address) return '';
  
  const {
    format = 'full', // 'full', 'short', 'city-state'
    separator = ', '
  } = options;
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country) parts.push(address.country);
  
  if (format === 'short') {
    return [address.city, address.state].filter(Boolean).join(', ');
  } else if (format === 'city-state') {
    return [address.city, address.state, address.zipCode].filter(Boolean).join(', ');
  }
  
  return parts.join(separator);
};

/**
 * Format credit card number for display
 * @param {string} cardNumber - Credit card number
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted card number
 */
export const formatCreditCard = (cardNumber, options = {}) => {
  if (!cardNumber) return '';
  
  const {
    mask = true,
    showLastFour = true
  } = options;
  
  const digits = cardNumber.replace(/\D/g, '');
  
  if (mask) {
    if (showLastFour) {
      return `**** **** **** ${digits.slice(-4)}`;
    } else {
      return '**** **** **** ****';
    }
  } else {
    // Format as XXXX XXXX XXXX XXXX
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
};

/**
 * Format social security number
 * @param {string} ssn - Social security number
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted SSN
 */
export const formatSSN = (ssn, options = {}) => {
  if (!ssn) return '';
  
  const {
    mask = true,
    showLastFour = true
  } = options;
  
  const digits = ssn.replace(/\D/g, '');
  
  if (mask) {
    if (showLastFour) {
      return `***-**-${digits.slice(-4)}`;
    } else {
      return '***-**-****';
    }
  } else {
    // Format as XXX-XX-XXXX
    return digits.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  }
};

/**
 * Format time for display
 * @param {Date|string} time - Time to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted time
 */
export const formatTime = (time, options = {}) => {
  if (!time) return '';
  
  const {
    format = '12-hour', // '12-hour', '24-hour', 'relative'
    locale = 'en-US',
    timeZone = undefined
  } = options;
  
  const date = new Date(time);
  
  if (format === 'relative') {
    return formatRelativeTime(date);
  }
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone
  };
  
  if (format === '12-hour') {
    timeOptions.hour12 = true;
  } else {
    timeOptions.hour12 = false;
  }
  
  return date.toLocaleTimeString(locale, timeOptions);
};

/**
 * Format datetime for display
 * @param {Date|string} datetime - Datetime to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted datetime
 */
export const formatDateTime = (datetime, options = {}) => {
  if (!datetime) return '';
  
  const {
    format = 'standard', // 'standard', 'relative', 'compact'
    locale = 'en-US',
    timeZone = undefined
  } = options;
  
  const date = new Date(datetime);
  
  if (format === 'relative') {
    return formatRelativeTime(date);
  } else if (format === 'compact') {
    return `${formatDate(date, { locale, timeZone })} ${formatTime(date, { locale, timeZone })}`;
  }
  
  // Standard format
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone
  });
};

export default {
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatFileSize,
  formatPercentage,
  formatNumber,
  formatPhoneNumber,
  formatDuration,
  formatFileName,
  formatAddress,
  formatCreditCard,
  formatSSN,
  formatTime,
  formatDateTime
};