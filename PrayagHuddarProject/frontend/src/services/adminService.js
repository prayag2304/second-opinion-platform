import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Admin service for Spring Boot backend integration
 */
class AdminService {
  /**
   * Get all users with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to users list
   */
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.USERS}?${params}`);
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Promise resolving to user details
   */
  async getUser(userId) {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
  }

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise} - Promise resolving to success message
   */
  async updateUserStatus(userId, status) {
    return await apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/status`, { status });
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise} - Promise resolving to success message
   */
  async deleteUser(userId) {
    return await apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
  }

  /**
   * Get pending doctors
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to pending doctors list
   */
  async getPendingDoctors(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.DOCTORS_PENDING}?${params}`);
  }

  /**
   * Approve doctor
   * @param {string} doctorId - Doctor ID
   * @param {Object} approvalData - Approval data
   * @returns {Promise} - Promise resolving to success message
   */
  async approveDoctor(doctorId, approvalData = {}) {
    return await apiClient.post(`${API_ENDPOINTS.ADMIN.DOCTORS_APPROVE}/${doctorId}`, approvalData);
  }

  /**
   * Reject doctor
   * @param {string} doctorId - Doctor ID
   * @param {Object} rejectionData - Rejection data
   * @returns {Promise} - Promise resolving to success message
   */
  async rejectDoctor(doctorId, rejectionData = {}) {
    return await apiClient.post(`${API_ENDPOINTS.ADMIN.DOCTORS_REJECT}/${doctorId}`, rejectionData);
  }

  /**
   * Get notifications
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to notifications list
   */
  async getNotifications(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.NOTIFICATIONS}?${params}`);
  }

  /**
   * Send notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise} - Promise resolving to success message
   */
  async sendNotification(notificationData) {
    return await apiClient.post(API_ENDPOINTS.ADMIN.NOTIFICATIONS, notificationData);
  }

  /**
   * Get analytics data
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to analytics data
   */
  async getAnalytics(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}?${params}`);
  }

  /**
   * Get dashboard statistics
   * @returns {Promise} - Promise resolving to dashboard stats
   */
  async getDashboardStats() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/dashboard`);
  }

  /**
   * Get user statistics
   * @returns {Promise} - Promise resolving to user statistics
   */
  async getUserStats() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/users`);
  }

  /**
   * Get application statistics
   * @returns {Promise} - Promise resolving to application statistics
   */
  async getApplicationStats() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/applications`);
  }

  /**
   * Get revenue statistics
   * @returns {Promise} - Promise resolving to revenue statistics
   */
  async getRevenueStats() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/revenue`);
  }

  /**
   * Export data
   * @param {string} type - Data type to export
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to exported data
   */
  async exportData(type, filters = {}) {
    const params = new URLSearchParams({ ...filters, type });
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/export?${params}`, {
      responseType: 'blob'
    });
  }

  /**
   * Get system health
   * @returns {Promise} - Promise resolving to system health data
   */
  async getSystemHealth() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/health`);
  }

  /**
   * Get audit logs
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to audit logs
   */
  async getAuditLogs(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/audit?${params}`);
  }

  /**
   * Update system settings
   * @param {Object} settings - System settings
   * @returns {Promise} - Promise resolving to success message
   */
  async updateSystemSettings(settings) {
    return await apiClient.put(`${API_ENDPOINTS.ADMIN.ANALYTICS}/settings`, settings);
  }

  /**
   * Get system settings
   * @returns {Promise} - Promise resolving to system settings
   */
  async getSystemSettings() {
    return await apiClient.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/settings`);
  }
}

export default new AdminService();
