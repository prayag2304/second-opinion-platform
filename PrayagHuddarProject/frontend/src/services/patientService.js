import apiClient from './apiClient';
import fileService from './fileService';
import { API_ENDPOINTS } from '../config/api';
import errorHandler from '../utils/errorHandler';

/**
 * Patient service for handling patient-related operations
 * Enhanced with comprehensive error handling
 */
class PatientService {
  /**
   * Get patient profile
   * @returns {Promise} - Promise resolving to patient profile
   */
  async getProfile() {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(API_ENDPOINTS.PATIENT.PROFILE),
      {
        customMessage: 'Failed to load profile. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Update patient profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise resolving to updated profile
   */
  async updateProfile(profileData) {
    return errorHandler.handleServiceError(
      async () => await apiClient.put(API_ENDPOINTS.PATIENT.PROFILE, profileData),
      {
        customMessage: 'Failed to update profile. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get patient applications
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to applications list
   */
  async getApplications(filters = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams(filters);
        return await apiClient.get(`${API_ENDPOINTS.PATIENT.APPLICATIONS}?${params}`);
      },
      {
        customMessage: 'Failed to load applications. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get application details
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Promise resolving to application details
   */
  async getApplication(applicationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(`${API_ENDPOINTS.PATIENT.APPLICATIONS}/${applicationId}`),
      {
        customMessage: 'Failed to load application details. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Submit application
   * @param {Object} applicationData - Application data
   * @returns {Promise} - Promise resolving to submitted application
   */
  async submitApplication(applicationData) {
    return errorHandler.handleServiceError(
      async () => await apiClient.post(API_ENDPOINTS.PATIENT.APPLICATIONS, applicationData),
      {
        customMessage: 'Failed to submit application. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Cancel application
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Promise resolving to success message
   */
  async cancelApplication(applicationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.delete(`${API_ENDPOINTS.PATIENT.APPLICATIONS}/${applicationId}`),
      {
        customMessage: 'Failed to cancel application. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get available doctors
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to doctors list
   */
  async getDoctors(filters = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams(filters);
        return await apiClient.get(`${API_ENDPOINTS.PATIENT.DOCTORS}?${params}`);
      },
      {
        customMessage: 'Failed to load doctors. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get doctor details
   * @param {string} doctorId - Doctor ID
   * @returns {Promise} - Promise resolving to doctor details
   */
  async getDoctor(doctorId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(`${API_ENDPOINTS.PATIENT.DOCTORS}/${doctorId}`),
      {
        customMessage: 'Failed to load doctor details. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get payment history
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to payment history
   */
  async getPaymentHistory(filters = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams(filters);
        return await apiClient.get(`${API_ENDPOINTS.PATIENT.PAYMENTS}?${params}`);
      },
      {
        customMessage: 'Failed to load payment history. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get payment details
   * @param {string} paymentId - Payment ID
   * @returns {Promise} - Promise resolving to payment details
   */
  async getPayment(paymentId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.get(`${API_ENDPOINTS.PATIENT.PAYMENTS}/${paymentId}`),
      {
        customMessage: 'Failed to load payment details. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get notifications
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise resolving to notifications list
   */
  async getNotifications(filters = {}) {
    return errorHandler.handleServiceError(
      async () => {
        const params = new URLSearchParams(filters);
        return await apiClient.get(`${API_ENDPOINTS.PATIENT.NOTIFICATIONS}?${params}`);
      },
      {
        customMessage: 'Failed to load notifications. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} - Promise resolving to success message
   */
  async markNotificationRead(notificationId) {
    return errorHandler.handleServiceError(
      async () => await apiClient.patch(`${API_ENDPOINTS.PATIENT.NOTIFICATIONS}/${notificationId}/read`),
      {
        customMessage: 'Failed to mark notification as read.',
        showToast: false // Don't show toast for read status
      }
    );
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} - Promise resolving to success message
   */
  async markAllNotificationsRead() {
    return errorHandler.handleServiceError(
      async () => await apiClient.patch(`${API_ENDPOINTS.PATIENT.NOTIFICATIONS}/mark-all-read`),
      {
        customMessage: 'Failed to mark all notifications as read.',
        showToast: false // Don't show toast for read status
      }
    );
  }

  /**
   * Upload medical reports with progress tracking
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving to uploaded file data
   */
  async uploadReport(file, options = {}) {
    const {
      category = 'medical_report',
      description = '',
      applicationId = null,
      onProgress = null,
      onError = null
    } = options;

    return errorHandler.handleServiceError(
      async () => await fileService.uploadFile(file, {
        category,
        description,
        applicationId,
        onProgress,
        onError
      }),
      {
        customMessage: 'Failed to upload file. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Upload multiple medical reports
   * @param {Array} files - Array of files to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving to upload results
   */
  async uploadReports(files, options = {}) {
    const {
      category = 'medical_report',
      description = '',
      applicationId = null,
      onProgress = null,
      onError = null
    } = options;

    return errorHandler.handleServiceError(
      async () => await fileService.uploadFiles(files, {
        category,
        description,
        applicationId,
        onProgress,
        onError
      }),
      {
        customMessage: 'Failed to upload files. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Download medical report
   * @param {string} fileId - File ID
   * @param {string} filename - Filename for download
   * @returns {Promise} - Promise resolving to file download
   */
  async downloadReport(fileId, filename = null) {
    return errorHandler.handleServiceError(
      async () => await fileService.downloadFile(fileId, filename),
      {
        customMessage: 'Failed to download file. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get application files
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Promise resolving to files list
   */
  async getApplicationFiles(applicationId) {
    return errorHandler.handleServiceError(
      async () => await fileService.getApplicationFiles(applicationId),
      {
        customMessage: 'Failed to load application files. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Get file metadata
   * @param {string} fileId - File ID
   * @returns {Promise} - Promise resolving to file metadata
   */
  async getFileMetadata(fileId) {
    return errorHandler.handleServiceError(
      async () => await fileService.getFileMetadata(fileId),
      {
        customMessage: 'Failed to load file metadata. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Delete medical report
   * @param {string} fileId - File ID
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteReport(fileId) {
    return errorHandler.handleServiceError(
      async () => await fileService.deleteFile(fileId),
      {
        customMessage: 'Failed to delete file. Please try again.',
        showToast: true
      }
    );
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateReportFile(file, options = {}) {
    return fileService.validateFileForUpload(file, {
      category: 'medical_report',
      ...options
    });
  }

  /**
   * Get file upload limits
   * @returns {Object} - Upload limits
   */
  getFileUploadLimits() {
    return fileService.getUploadLimits();
  }

  /**
   * Get file categories
   * @returns {Object} - File categories
   */
  getFileCategories() {
    return fileService.getFileCategories();
  }
}

export default new PatientService();