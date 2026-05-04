// Application constants
export const APP_NAME = 'Second Opinion';
export const COPYRIGHT = '© 2025 Second Opinion. All rights reserved.';

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000, // Increased to match utils/constants.js
  headers: {
    'Content-Type': 'application/json',
  },
};

// Medical Specialties (consolidated from utils/constants.js)
export const MEDICAL_SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Oncology',
  'Gastroenterology',
  'Endocrinology',
  'Pulmonology',
  'Nephrology',
  'Hematology',
  'Rheumatology',
  'Infectious Disease',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Ophthalmology',
  'ENT',
  'Urology',
  'Gynecology'
];

// Availability days
export const AVAILABILITY_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Time slots
export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00'
];

// User status options
export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Application status options
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  CANCELLED: 'cancelled',
};

// Payment status options
export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  REFUNDED: 'refunded',
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
};

// File upload limits - Updated for medical reports
export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB (increased from 5MB)
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp'
  ],
  maxFiles: 10, // Increased from 5
  maxTotalSize: 50 * 1024 * 1024, // 50MB total for multiple files
};

// File categories for medical reports
export const FILE_CATEGORIES = {
  MEDICAL_REPORT: 'medical_report',
  LAB_RESULT: 'lab_result',
  IMAGING: 'imaging',
  PRESCRIPTION: 'prescription',
  CERTIFICATE: 'certificate',
  OTHER: 'other'
};

// Status options
export const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PATIENT: 'patient',
  DOCTOR: 'doctor',
};

// Permission actions
export const PERMISSION_ACTIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  MANAGE: 'manage'
};

// Permission resources
export const PERMISSION_RESOURCES = {
  // User resources
  USERS: 'users',
  PROFILE: 'profile',
  ROLES: 'roles',

  // Application resources
  APPLICATIONS: 'applications',
  REVIEWS: 'reviews',

  // Medical resources
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  MEDICAL_RECORDS: 'medical_records',

  // Financial resources
  PAYMENTS: 'payments',
  EARNINGS: 'earnings',
  INVOICES: 'invoices',

  // File resources
  FILES: 'files',
  REPORTS: 'reports',
  IMAGES: 'images',

  // Communication resources
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',

  // System resources
  SYSTEM: 'system',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  LOGS: 'logs'
};

// Permission patterns for easy checking
export const PERMISSION_PATTERNS = {
  // Patient permissions
  PATIENT_READ_PROFILE: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.PROFILE}`,
  PATIENT_UPDATE_PROFILE: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.PROFILE}`,
  PATIENT_READ_DOCTORS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.DOCTORS}`,
  PATIENT_READ_APPLICATIONS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  PATIENT_CREATE_APPLICATIONS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.CREATE}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  PATIENT_UPDATE_APPLICATIONS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  PATIENT_READ_NOTIFICATIONS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.NOTIFICATIONS}`,
  PATIENT_UPDATE_NOTIFICATIONS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.NOTIFICATIONS}`,
  PATIENT_READ_PAYMENTS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.PAYMENTS}`,
  PATIENT_CREATE_PAYMENTS: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.CREATE}:${PERMISSION_RESOURCES.PAYMENTS}`,
  PATIENT_READ_FILES: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.FILES}`,
  PATIENT_CREATE_FILES: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.CREATE}:${PERMISSION_RESOURCES.FILES}`,
  PATIENT_UPDATE_FILES: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.FILES}`,
  PATIENT_DELETE_FILES: `${USER_ROLES.PATIENT}:${PERMISSION_ACTIONS.DELETE}:${PERMISSION_RESOURCES.FILES}`,

  // Doctor permissions
  DOCTOR_READ_PROFILE: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.PROFILE}`,
  DOCTOR_UPDATE_PROFILE: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.PROFILE}`,
  DOCTOR_READ_APPLICATIONS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  DOCTOR_UPDATE_APPLICATIONS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  DOCTOR_READ_NOTIFICATIONS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.NOTIFICATIONS}`,
  DOCTOR_UPDATE_NOTIFICATIONS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.NOTIFICATIONS}`,
  DOCTOR_READ_EARNINGS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.EARNINGS}`,
  DOCTOR_UPDATE_AVAILABILITY: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.SYSTEM}`,
  DOCTOR_READ_REVIEWS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.REVIEWS}`,
  DOCTOR_CREATE_REVIEWS: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.CREATE}:${PERMISSION_RESOURCES.REVIEWS}`,
  DOCTOR_READ_FILES: `${USER_ROLES.DOCTOR}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.FILES}`,

  // Admin permissions
  ADMIN_READ_USERS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.USERS}`,
  ADMIN_CREATE_USERS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.CREATE}:${PERMISSION_RESOURCES.USERS}`,
  ADMIN_UPDATE_USERS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.USERS}`,
  ADMIN_DELETE_USERS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.DELETE}:${PERMISSION_RESOURCES.USERS}`,
  ADMIN_READ_APPLICATIONS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  ADMIN_UPDATE_APPLICATIONS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.APPLICATIONS}`,
  ADMIN_READ_PAYMENTS: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.PAYMENTS}`,
  ADMIN_READ_FILES: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.FILES}`,
  ADMIN_DELETE_FILES: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.DELETE}:${PERMISSION_RESOURCES.FILES}`,
  ADMIN_READ_SYSTEM: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.READ}:${PERMISSION_RESOURCES.SYSTEM}`,
  ADMIN_UPDATE_SYSTEM: `${USER_ROLES.ADMIN}:${PERMISSION_ACTIONS.UPDATE}:${PERMISSION_RESOURCES.SYSTEM}`
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_REVIEWED: 'application_reviewed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  DOCTOR_APPROVED: 'doctor_approved',
  DOCTOR_REJECTED: 'doctor_rejected',
  PROFILE_UPDATED: 'profile_updated',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  GENERAL: 'general'
};

// Notification categories
export const NOTIFICATION_CATEGORIES = {
  GENERAL: 'general',
  PAYMENT: 'payment',
  APPLICATION: 'application',
  MEDICAL: 'medical',
  SYSTEM: 'system',
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
  IN_APP: 'in_app',
};

// Notification frequencies
export const NOTIFICATION_FREQUENCIES = {
  IMMEDIATE: 'immediate',
  DAILY: 'daily',
  WEEKLY: 'weekly',
};

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: false,
  categories: {
    payment: true,
    application: true,
    medical: false,
    system: true,
  },
  frequency: NOTIFICATION_FREQUENCIES.IMMEDIATE,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  timezone: 'UTC',
};

// Notification template variables
export const NOTIFICATION_TEMPLATE_VARIABLES = {
  USER_NAME: 'user_name',
  USER_EMAIL: 'user_email',
  DOCTOR_NAME: 'doctor_name',
  AMOUNT: 'amount',
  SERVICE: 'service',
  TRANSACTION_ID: 'transaction_id',
  APPLICATION_ID: 'application_id',
  REASON: 'reason',
  START_TIME: 'start_time',
  END_TIME: 'end_time',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size must be less than 10MB.',
  INVALID_FILE_TYPE: 'Only PDF and image files (JPEG, PNG, GIF, BMP, TIFF, WebP) are allowed.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  DUPLICATE_APPLICATION: 'You already have a pending application with this doctor.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  FILE_DOWNLOAD_FAILED: 'File download failed. Please try again.',
  FILE_NOT_FOUND: 'File not found.',
  FILE_ACCESS_DENIED: 'You do not have permission to access this file.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTRATION_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  PAYMENT_SUCCESS: 'Payment completed successfully.',
  DOCTOR_APPROVED: 'Doctor approved successfully.',
  DOCTOR_REJECTED: 'Doctor rejected successfully.',
  NOTIFICATION_SENT: 'Notification sent successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  FILE_DOWNLOADED: 'File downloaded successfully.',
  AVAILABILITY_UPDATED: 'Availability updated successfully.'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
  PHONE_MIN_LENGTH: 10,
  LICENSE_MIN_LENGTH: 5,
  EXPERIENCE_MIN: 0,
  EXPERIENCE_MAX: 50,
  FEE_MIN: 25,
  FEE_MAX: 500
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/
};

export const SPECIALTIES = MEDICAL_SPECIALTIES;
