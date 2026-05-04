import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Doctor service for Spring Boot backend integration
 */
class DoctorService {
  /**
   * Get doctor profile
   * @returns {Promise} - Promise resolving to doctor profile
   */
  async getProfile() {
    return await apiClient.get(API_ENDPOINTS.DOCTOR.PROFILE);
  }

  /**
   * Update doctor profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise resolving to updated profile
   */
  async updateProfile(profileData) {
    return await apiClient.put(API_ENDPOINTS.DOCTOR.PROFILE, profileData);
  }

  /**
   * Get doctor applications
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to applications list
   */
  async getApplications(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.APPLICATIONS}?${params}`);
  }

  /**
   * Get application by ID
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Promise resolving to application details
   */
  async getApplication(applicationId) {
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.APPLICATIONS}/${applicationId}`);
  }

  /**
   * Review application
   * @param {string} applicationId - Application ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} - Promise resolving to success message
   */
  async reviewApplication(applicationId, reviewData) {
    return await apiClient.post(`${API_ENDPOINTS.DOCTOR.APPLICATIONS}/${applicationId}/review`, reviewData);
  }

  /**
   * Get doctor availability
   * @returns {Promise} - Promise resolving to availability data
   */
  async getAvailability() {
    return await apiClient.get(API_ENDPOINTS.DOCTOR.AVAILABILITY);
  }

  /**
   * Update doctor availability
   * @param {Object} availabilityData - Availability data
   * @returns {Promise} - Promise resolving to updated availability
   */
  async updateAvailability(availabilityData) {
    return await apiClient.put(API_ENDPOINTS.DOCTOR.AVAILABILITY, availabilityData);
  }

  /**
   * Get doctor earnings
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to earnings data
   */
  async getEarnings(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.EARNINGS}?${params}`);
  }

  /**
   * Get earnings summary
   * @returns {Promise} - Promise resolving to earnings summary
   */
  async getEarningsSummary() {
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.EARNINGS}/summary`);
  }

  /**
   * Get notifications
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to notifications list
   */
  async getNotifications(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.NOTIFICATIONS}?${params}`);
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Promise resolving to success message
   */
  async markNotificationRead(notificationId) {
    return await apiClient.patch(`${API_ENDPOINTS.DOCTOR.NOTIFICATIONS}/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} - Promise resolving to success message
   */
  async markAllNotificationsRead() {
    return await apiClient.patch(`${API_ENDPOINTS.DOCTOR.NOTIFICATIONS}/mark-all-read`);
  }

  /**
   * Get doctor statistics
   * @returns {Promise} - Promise resolving to statistics data
   */
  async getStatistics() {
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.PROFILE}/statistics`);
  }

  /**
   * Update consultation fee
   * @param {number} fee - New consultation fee
   * @returns {Promise} - Promise resolving to success message
   */
  async updateConsultationFee(fee) {
    return await apiClient.patch(`${API_ENDPOINTS.DOCTOR.PROFILE}/fee`, { fee });
  }

  /**
   * Update doctor status (active/inactive)
   * @param {string} status - New status
   * @returns {Promise} - Promise resolving to success message
   */
  async updateStatus(status) {
    return await apiClient.patch(`${API_ENDPOINTS.DOCTOR.PROFILE}/status`, { status });
  }

  /**
   * Get pending applications count
   * @returns {Promise} - Promise resolving to count
   */
  async getPendingApplicationsCount() {
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.APPLICATIONS}/pending/count`);
  }

  /**
   * Get recent reviews
   * @param {number} limit - Number of reviews to fetch
   * @returns {Promise} - Promise resolving to reviews list
   */
  async getRecentReviews(limit = 5) {
    return await apiClient.get(`${API_ENDPOINTS.DOCTOR.PROFILE}/reviews?limit=${limit}`);
  }
}

export default new DoctorService();