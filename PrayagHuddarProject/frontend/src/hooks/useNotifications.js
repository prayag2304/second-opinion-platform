import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_FREQUENCIES
} from '../config/constants';

/**
 * React Hook for Notification Management
 * Provides easy access to notification functionality and state management
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load notifications
  const loadNotifications = useCallback(async (filters = {}, pagination = {}) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications(filters, pagination);
      // Extract data from ApiResponse wrapper: response.data.data or response.data
      const notificationsData = response.data?.data || response.data || [];
      // Ensure it's always an array
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      setError(err.message);
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;

    try {
      const response = await notificationService.getPreferences();
      // Extract data from ApiResponse wrapper
      const preferencesData = response.data?.data || response.data;
      setPreferences(preferencesData || notificationService.getDefaultPreferences());
    } catch (err) {
      // Use default preferences if loading fails
      setPreferences(notificationService.getDefaultPreferences());
    }
  }, [user]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await notificationService.getUnreadCount();
      // Extract data from ApiResponse wrapper
      const countData = response.data?.data || response.data;
      // Handle both object with count property and direct number
      const count = countData?.count ?? countData ?? 0;
      setUnreadCount(typeof count === 'number' ? count : 0);
    } catch (err) {
      setUnreadCount(0);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!user) return;

    try {
      await notificationService.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );

      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!user) return;

    try {
      await notificationService.deleteNotification(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );

      // Update unread count if notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [user, notifications]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    if (!user) return;

    try {
      await notificationService.updatePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (subscriptionData) => {
    if (!user) return;

    try {
      await notificationService.subscribeToPush(subscriptionData);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    if (!user) return;

    try {
      await notificationService.unsubscribeFromPush();
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Test push notification
  const testPushNotification = useCallback(async () => {
    if (!user) return;

    try {
      await notificationService.testPushNotification();
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Send custom notification (admin only)
  const sendCustomNotification = useCallback(async (notificationData) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can send custom notifications');
    }

    try {
      await notificationService.sendCustomNotification(notificationData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Send template notification (admin only)
  const sendTemplateNotification = useCallback(async (templateName, variables, recipientId, priority) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can send template notifications');
    }

    try {
      await notificationService.sendTemplateNotification(templateName, variables, recipientId, priority);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Get notification history
  const getHistory = useCallback(async (filters = {}, pagination = {}) => {
    if (!user) return;

    try {
      return await notificationService.getHistory(filters, pagination);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Export notifications
  const exportNotifications = useCallback(async (filters = {}, format = 'csv') => {
    if (!user) return;

    try {
      return await notificationService.exportNotifications(filters, format);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Clear old notifications
  const clearOldNotifications = useCallback(async (daysOld = 30, category = null) => {
    if (!user) return;

    try {
      await notificationService.clearOldNotifications(daysOld, category);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  // Refresh all notification data
  const refreshNotifications = useCallback(async () => {
    if (!user) return;

    await Promise.all([
      loadNotifications(),
      loadPreferences(),
      loadUnreadCount()
    ]);
  }, [user, loadNotifications, loadPreferences, loadUnreadCount]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized computed values
  const unreadNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    return notifications.filter(notification => !notification.isRead);
  }, [notifications]);

  const readNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    return notifications.filter(notification => notification.isRead);
  }, [notifications]);

  const notificationsByType = useMemo(() => {
    if (!Array.isArray(notifications)) return {};
    const grouped = {};
    Object.values(NOTIFICATION_TYPES).forEach(type => {
      grouped[type] = notifications.filter(n => n.type === type);
    });
    return grouped;
  }, [notifications]);

  const notificationsByCategory = useMemo(() => {
    if (!Array.isArray(notifications)) return {};
    const grouped = {};
    Object.values(NOTIFICATION_CATEGORIES).forEach(category => {
      grouped[category] = notifications.filter(n => n.category === category);
    });
    return grouped;
  }, [notifications]);

  // Load initial data
  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user, refreshNotifications]);

  return {
    // State
    notifications,
    preferences,
    unreadCount,
    loading,
    error,

    // Actions
    loadNotifications,
    loadPreferences,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    subscribeToPush,
    unsubscribeFromPush,
    testPushNotification,
    sendCustomNotification,
    sendTemplateNotification,
    getHistory,
    exportNotifications,
    clearOldNotifications,
    refreshNotifications,
    clearError,

    // Computed values
    unreadNotifications,
    readNotifications,
    notificationsByType,
    notificationsByCategory,

    // Permission checks
    canSendNotifications: user?.role === 'admin',
    canManagePreferences: !!user,
    canSubscribeToPush: !!user,
  };
};

/**
 * Hook for a single notification
 */
export const useNotification = (notificationId) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotification = useCallback(async () => {
    if (!notificationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotification(notificationId);
      // Extract data from ApiResponse wrapper
      const notificationData = response.data?.data || response.data;
      setNotification(notificationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [notificationId]);

  useEffect(() => {
    loadNotification();
  }, [loadNotification]);

  return {
    notification,
    loading,
    error,
    reload: loadNotification,
  };
};

/**
 * Hook for notification preferences
 */
export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPreferences = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationService.getPreferences();
      // Extract data from ApiResponse wrapper
      const preferencesData = response.data?.data || response.data;
      setPreferences(preferencesData || notificationService.getDefaultPreferences());
    } catch (err) {
      setError(err.message);
      // Use default preferences if loading fails
      setPreferences(notificationService.getDefaultPreferences());
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (newPreferences) => {
    if (!user) return;

    try {
      await notificationService.updatePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    reload: loadPreferences,
  };
};

export default useNotifications;