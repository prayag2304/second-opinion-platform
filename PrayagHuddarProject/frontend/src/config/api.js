// API endpoints configuration for Spring Boot backend
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    LOGOUT: '/api/auth/logout',
  },

  // User endpoints
  USERS: {
    LIST: '/api/users',
    GET_BY_ID: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    ACTIVATE: (id) => `/api/users/${id}/activate`,
    STATS: '/api/users/stats/overview',
    PROFILE: '/api/users/profile', // Spring Boot backend
  },

  // Patient endpoints
  PATIENT: {
    PROFILE: '/api/patients/profile',
    GET_BY_ID: (id) => `/api/patients/${id}`,
  },

  // Doctor endpoints
  DOCTOR: {
    LIST: '/api/doctors',
    GET_BY_ID: (id) => `/api/doctors/${id}`,
    CREATE: '/api/doctors',
    UPDATE: (id) => `/api/doctors/${id}`,
    APPROVE: (id) => `/api/doctors/${id}/approve`,
    REJECT: (id) => `/api/doctors/${id}/reject`,
    EARNINGS: (id) => `/api/doctors/${id}/earnings`,
    PENDING: '/api/doctors/admin/pending',
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    STATS: '/api/admin/stats',
  },

  // Payment endpoints (not implemented in Spring Boot backend)
  PAYMENTS: {
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payments/verify',
    HISTORY: '/api/payments/history',
    GET_BY_ID: (id) => `/api/payments/${id}`,
    REFUND: (id) => `/api/payments/${id}/refund`,
  },

  // File management endpoints
  FILES: {
    UPLOAD: '/api/files/upload',
    LIST: '/api/files',
    GET_BY_ID: (id) => `/api/files/${id}`,
    DOWNLOAD: (id) => `/api/files/${id}/download`,
    DELETE: (id) => `/api/files/${id}`,
  },

  // Consultations endpoints (Spring Boot backend)
  CONSULTATIONS: {
    LIST: '/api/consultations',
    GET_BY_ID: (id) => `/api/consultations/${id}`,
    CREATE: '/api/consultations',
    UPDATE: (id) => `/api/consultations/${id}`,
    ASSIGN: (id) => `/api/consultations/${id}/assign`,
    OPINION: (id) => `/api/consultations/${id}/opinion`,
  },

  // Public endpoints
  PUBLIC: {
    CONTACT: '/api/public/contact',
    STATS: '/api/public/stats', // Spring Boot backend
  },

  // Contact endpoint (alias for backward compatibility)
  CONTACT: {
    SUBMIT: '/api/public/contact',
  },

  // Notifications (stub endpoints in Spring Boot backend)
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    GET_BY_ID: (id) => `/api/notifications/${id}`,
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: (id) => `/api/notifications/${id}`,
    UNREAD_COUNT: '/api/notifications/unread-count',
    PREFERENCES: '/api/notifications/preferences',
    PUSH_SUBSCRIBE: '/api/notifications/push/subscribe',
    PUSH_UNSUBSCRIBE: '/api/notifications/push/unsubscribe',
    PUSH_TEST: '/api/notifications/push/test',
    TEMPLATES: '/api/notifications/templates',
    SEND: '/api/notifications/send',
    HISTORY: '/api/notifications/history',
    EXPORT: '/api/notifications/export',
    CLEAR: '/api/notifications/clear',
  },

  // Health check
  HEALTH: '/api/health',
};

export default {
  API_ENDPOINTS,
};