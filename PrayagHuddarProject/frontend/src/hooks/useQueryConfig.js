import { QueryClient } from '@tanstack/react-query';

/**
 * React Query configuration for caching and performance optimization
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in development only
      refetchOnWindowFocus: import.meta.env.DEV,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

/**
 * Query keys for consistent caching
 */
export const queryKeys = {
  // User data
  user: ['user'],
  userProfile: (userId) => ['user', userId, 'profile'],
  
  // Patient data
  patientProfile: ['patient', 'profile'],
  patientApplications: (filters = {}) => ['patient', 'applications', filters],
  patientApplication: (id) => ['patient', 'application', id],
  patientDoctors: (filters = {}) => ['patient', 'doctors', filters],
  patientDoctor: (id) => ['patient', 'doctor', id],
  patientPayments: (filters = {}) => ['patient', 'payments', filters],
  patientPayment: (id) => ['patient', 'payment', id],
  patientNotifications: (filters = {}) => ['patient', 'notifications', filters],
  
  // Doctor data
  doctorProfile: ['doctor', 'profile'],
  doctorApplications: (filters = {}) => ['doctor', 'applications', filters],
  doctorApplication: (id) => ['doctor', 'application', id],
  doctorAvailability: ['doctor', 'availability'],
  doctorEarnings: (filters = {}) => ['doctor', 'earnings', filters],
  doctorNotifications: (filters = {}) => ['doctor', 'notifications', filters],
  doctorStatistics: ['doctor', 'statistics'],
  
  // Admin data
  adminUsers: (filters = {}) => ['admin', 'users', filters],
  adminUser: (id) => ['admin', 'user', id],
  adminPendingDoctors: (filters = {}) => ['admin', 'doctors', 'pending', filters],
  adminAnalytics: (type) => ['admin', 'analytics', type],
  adminNotifications: (filters = {}) => ['admin', 'notifications', filters],
  
  // File data
  files: (filters = {}) => ['files', filters],
  file: (id) => ['file', id],
  fileCategories: ['files', 'categories'],
  applicationFiles: (applicationId) => ['files', 'application', applicationId],
  
  // Notification data
  notifications: (filters = {}) => ['notifications', filters],
  notification: (id) => ['notification', id],
  notificationPreferences: ['notifications', 'preferences'],
  unreadCount: ['notifications', 'unread', 'count'],
  
  // Payment data
  paymentStatus: (id) => ['payment', 'status', id],
  
  // Permission data
  userPermissions: ['permissions', 'user'],
  
  // Public data
  publicStats: ['public', 'stats'],
};

/**
 * Prefetch functions for better UX
 */
export const prefetchQueries = {
  // Prefetch patient profile
  patientProfile: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.patientProfile,
      queryFn: () => import('../services/patientService').then(m => m.default.getProfile()),
    });
  },
  
  // Prefetch doctor profile
  doctorProfile: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.doctorProfile,
      queryFn: () => import('../services/doctorService').then(m => m.default.getProfile()),
    });
  },
  
  // Prefetch notifications
  notifications: (filters = {}) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.notifications(filters),
      queryFn: () => import('../services/notificationService').then(m => m.default.getNotifications(filters)),
    });
  },
  
  // Prefetch unread count
  unreadCount: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.unreadCount,
      queryFn: () => import('../services/notificationService').then(m => m.default.getUnreadCount()),
    });
  },
};

/**
 * Invalidate queries after mutations
 */
export const invalidateQueries = {
  // Invalidate user data
  userData: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user });
  },
  
  // Invalidate patient data
  patientData: () => {
    queryClient.invalidateQueries({ queryKey: ['patient'] });
  },
  
  // Invalidate doctor data
  doctorData: () => {
    queryClient.invalidateQueries({ queryKey: ['doctor'] });
  },
  
  // Invalidate admin data
  adminData: () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  },
  
  // Invalidate notifications
  notifications: () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  },
  
  // Invalidate files
  files: () => {
    queryClient.invalidateQueries({ queryKey: ['files'] });
  },
  
  // Invalidate applications
  applications: () => {
    queryClient.invalidateQueries({ queryKey: ['patient', 'applications'] });
    queryClient.invalidateQueries({ queryKey: ['doctor', 'applications'] });
  },
  
  // Invalidate payments
  payments: () => {
    queryClient.invalidateQueries({ queryKey: ['patient', 'payments'] });
    queryClient.invalidateQueries({ queryKey: ['doctor', 'earnings'] });
  },
};

export default queryClient; 