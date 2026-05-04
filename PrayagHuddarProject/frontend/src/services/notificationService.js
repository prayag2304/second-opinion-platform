import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_CATEGORIES, 
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_FREQUENCIES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_TEMPLATE_VARIABLES
} from '../config/constants';
import errorHandler from '../utils/errorHandler';

/**
 * Enhanced Notification service for Spring Boot backend integration
 * Handles all notification operations with comprehensive error handling
 */
class NotificationService {
  /**
   * Get notifications for current user with pagination and filtering
   * @param {Object} filters - Filter parameters
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise} - Promise resolving to notifications list
   */
  async getNotifications(filters = {}, pagination = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams({
          ...filters,
          ...pagination
        });
        return await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.LIST}?${params}`);
      },
      {
        customMessage: 'Failed to load notifications. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get notification by ID
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Promise resolving to notification details
   */
  async getNotification(notificationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_BY_ID(notificationId)),
      {
        customMessage: 'Failed to load notification details.',
        showToast: true
      }
    );
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Promise resolving to success message
   */
  async markAsRead(notificationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)),
      {
        customMessage: 'Failed to mark notification as read.',
        showToast: true
      }
    );
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} - Promise resolving to success message
   */
  async markAllAsRead() {
    return errorHandler.handleServiceError(
      async () => await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
      {
        customMessage: 'Failed to mark all notifications as read.',
        showToast: true
      }
    );
  }

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Promise resolving to success message
   */
  async deleteNotification(notificationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)),
      {
        customMessage: 'Failed to delete notification.',
        showToast: true
      }
    );
  }

  /**
   * Get unread notifications count
   * @returns {Promise} - Promise resolving to unread count
   */
  async getUnreadCount() {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),
      {
        customMessage: 'Failed to get unread count.',
        showToast: false
      }
    );
  }

  /**
   * Get notification preferences
   * @returns {Promise} - Promise resolving to notification preferences
   */
  async getPreferences() {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES),
      {
        customMessage: 'Failed to load notification preferences.',
        showToast: true
      }
    );
  }

  /**
   * Update notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise} - Promise resolving to success message
   */
  async updatePreferences(preferences) {
    return errorHandler.handleServiceError(
      async () => await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES, preferences),
      {
        customMessage: 'Failed to update notification preferences.',
        showToast: true
      }
    );
  }

  /**
   * Subscribe to push notifications
   * @param {Object} subscriptionData - Push subscription data
   * @returns {Promise} - Promise resolving to success message
   */
  async subscribeToPush(subscriptionData) {
    return errorHandler.handleServiceError(
      async () => await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.PUSH_SUBSCRIBE, subscriptionData),
      {
        customMessage: 'Failed to subscribe to push notifications.',
        showToast: true
      }
    );
  }

  /**
   * Unsubscribe from push notifications
   * @returns {Promise} - Promise resolving to success message
   */
  async unsubscribeFromPush() {
    return errorHandler.handleServiceError(
      async () => await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.PUSH_UNSUBSCRIBE),
      {
        customMessage: 'Failed to unsubscribe from push notifications.',
        showToast: true
      }
    );
  }

  /**
   * Test push notification
   * @returns {Promise} - Promise resolving to success message
   */
  async testPushNotification() {
    return errorHandler.handleServiceError(
      async () => await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.PUSH_TEST),
      {
        customMessage: 'Failed to send test push notification.',
        showToast: true
      }
    );
  }

  /**
   * Get notification templates
   * @returns {Promise} - Promise resolving to notification templates
   */
  async getTemplates() {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.TEMPLATES),
      {
        customMessage: 'Failed to load notification templates.',
        showToast: true
      }
    );
  }

  /**
   * Send custom notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise} - Promise resolving to success message
   */
  async sendCustomNotification(notificationData) {
    return errorHandler.handleServiceError(
      async () => await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.SEND, notificationData),
      {
        customMessage: 'Failed to send custom notification.',
        showToast: true
      }
    );
  }

  /**
   * Get notification history with pagination and filtering
   * @param {Object} filters - Filter parameters
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise} - Promise resolving to notification history
   */
  async getHistory(filters = {}, pagination = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams({
          ...filters,
          ...pagination
        });
        return await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.HISTORY}?${params}`);
      },
      {
        customMessage: 'Failed to load notification history.',
        showToast: true
      }
    );
  }

  /**
   * Export notifications to CSV/Excel
   * @param {Object} filters - Filter parameters
   * @param {string} format - Export format (csv, excel)
   * @returns {Promise} - Promise resolving to exported data
   */
  async exportNotifications(filters = {}, format = 'csv') {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams({
          ...filters,
          format
        });
        return await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.EXPORT}?${params}`, {
          responseType: 'blob'
        });
      },
      {
        customMessage: 'Failed to export notifications.',
        showToast: true
      }
    );
  }

  /**
   * Clear old notifications
   * @param {number} daysOld - Number of days old to clear
   * @param {string} category - Category to clear (optional)
   * @returns {Promise} - Promise resolving to success message
   */
  async clearOldNotifications(daysOld = 30, category = null) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams({ days: daysOld });
        if (category) {
          params.append('category', category);
        }
        return await apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.CLEAR}?${params}`);
      },
      {
        customMessage: 'Failed to clear old notifications.',
        showToast: true
      }
    );
  }

  /**
   * Send notification using template
   * @param {string} templateName - Template name
   * @param {Object} variables - Template variables
   * @param {string} recipientId - Recipient user ID
   * @param {string} priority - Notification priority
   * @returns {Promise} - Promise resolving to success message
   */
  async sendTemplateNotification(templateName, variables, recipientId, priority = NOTIFICATION_PRIORITIES.NORMAL) {
    return errorHandler.handleServiceError(
      async () => {
        const notificationData = {
          recipientId,
          templateName,
          variables,
          priority,
          scheduledAt: null
        };
        return await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.SEND, notificationData);
      },
      {
        customMessage: 'Failed to send template notification.',
        showToast: true
      }
    );
  }

  /**
   * Schedule notification for later delivery
   * @param {Object} notificationData - Notification data
   * @param {Date} scheduledAt - Scheduled delivery time
   * @returns {Promise} - Promise resolving to success message
   */
  async scheduleNotification(notificationData, scheduledAt) {
    return errorHandler.handleServiceError(
      async () => {
        const data = {
          ...notificationData,
          scheduledAt: scheduledAt.toISOString()
        };
        return await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.SEND, data);
      },
      {
        customMessage: 'Failed to schedule notification.',
        showToast: true
      }
    );
  }

  /**
   * Get notification statistics
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to notification statistics
   */
  async getNotificationStats(filters = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams(filters);
        return await apiClient.get(`/notifications/stats?${params}`);
      },
      {
        customMessage: 'Failed to load notification statistics.',
        showToast: true
      }
    );
  }

  /**
   * Validate notification data
   * @param {Object} notificationData - Notification data to validate
   * @returns {Object} - Validation result
   */
  validateNotificationData(notificationData) {
    const errors = [];

    if (!notificationData.title || notificationData.title.trim().length === 0) {
      errors.push('Notification title is required');
    }

    if (!notificationData.message || notificationData.message.trim().length === 0) {
      errors.push('Notification message is required');
    }

    if (!notificationData.type || !Object.values(NOTIFICATION_TYPES).includes(notificationData.type)) {
      errors.push('Valid notification type is required');
    }

    if (!notificationData.category || !Object.values(NOTIFICATION_CATEGORIES).includes(notificationData.category)) {
      errors.push('Valid notification category is required');
    }

    if (notificationData.priority && !Object.values(NOTIFICATION_PRIORITIES).includes(notificationData.priority)) {
      errors.push('Valid notification priority is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default notification preferences
   * @returns {Object} - Default notification preferences
   */
  getDefaultPreferences() {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  /**
   * Check if user has notification permissions
   * @param {Object} user - User object
   * @param {string} action - Action to check
   * @returns {boolean} - Whether user has permission
   */
  hasNotificationPermission(user, action) {
    if (!user || !user.role) return false;
    
    // Admin has all notification permissions
    if (user.role === 'admin') return true;
    
    // Define role-based notification permissions
    const permissions = {
      patient: {
        read: true,
        create: false, // Patients can't create notifications
        update: true, // Can mark as read
        delete: true, // Can delete their own notifications
      },
      doctor: {
        read: true,
        create: false, // Doctors can't create notifications
        update: true, // Can mark as read
        delete: true, // Can delete their own notifications
      },
    };
    
    const userPermissions = permissions[user.role];
    return userPermissions ? userPermissions[action] || false : false;
  }
}

export default new NotificationService();