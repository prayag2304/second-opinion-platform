import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { FILE_UPLOAD_LIMITS, FILE_CATEGORIES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';
import { validateFile, validateFiles, getFileCategory, formatFileSize } from '../utils/validation';

/**
 * File service for handling medical report uploads and downloads
 */
class FileService {
  constructor() {
    this.uploadLimits = FILE_UPLOAD_LIMITS;
    this.categories = FILE_CATEGORIES;
  }

  /**
   * Upload a single file with progress tracking
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving to upload result
   */
  async uploadFile(file, options = {}) {
    const {
      category = FILE_CATEGORIES.MEDICAL_REPORT,
      description = '',
      applicationId = null,
      onProgress = null,
      onError = null
    } = options;

    try {
      // Validate file
      const validationErrors = validateFile(file, { category });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (description) {
        formData.append('description', description);
      }
      // Backend expects consultationId, not applicationId
      if (applicationId) {
        formData.append('consultationId', applicationId);
      }

      // Upload with progress tracking
      const response = await apiClient.uploadFile(
        API_ENDPOINTS.FILES.UPLOAD,
        formData,
        onProgress
      );

      // Extract data from ApiResponse wrapper
      const fileData = response.data?.data || response.data;

      return {
        success: true,
        fileId: fileData.id,
        filename: fileData.filename,
        originalFilename: fileData.filename, // Backend doesn't have originalFilename, use filename
        size: fileData.size,
        mimeType: fileData.contentType || file.type, // Backend uses contentType, fallback to file.type
        contentType: fileData.contentType, // Also include contentType for compatibility
        category: fileData.category,
        consultationId: fileData.consultationId,
        createdAt: fileData.createdAt,
        uploadDate: fileData.createdAt,
        message: response.data?.message || SUCCESS_MESSAGES.FILE_UPLOADED
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED;
      if (onError) onError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Upload multiple files with progress tracking
   * @param {Array} files - Array of files to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving to upload results
   */
  async uploadFiles(files, options = {}) {
    const {
      category = FILE_CATEGORIES.MEDICAL_REPORT,
      description = '',
      applicationId = null,
      onProgress = null,
      onError = null
    } = options;

    try {
      // Validate files
      const validationErrors = validateFiles(files, { category });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const results = [];
      let totalProgress = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const result = await this.uploadFile(file, {
            category,
            description,
            applicationId,
            onProgress: (progress) => {
              // Calculate overall progress
              const fileProgress = progress / files.length;
              totalProgress = (i * 100 / files.length) + fileProgress;
              if (onProgress) onProgress(Math.round(totalProgress));
            },
            onError
          });

          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            filename: file.name,
            error: error.message
          });
        }
      }

      return {
        success: true,
        results,
        totalFiles: files.length,
        successfulUploads: results.filter(r => r.success).length,
        failedUploads: results.filter(r => !r.success).length
      };
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED;
      if (onError) onError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Download a file
   * @param {string} fileId - File ID to download
   * @param {string} filename - Filename for download
   * @returns {Promise} - Promise resolving to download result
   */
  async downloadFile(fileId, filename = null) {
    try {
      const response = await apiClient.downloadFile(
        `${API_ENDPOINTS.FILES.DOWNLOAD}/${fileId}`,
        filename
      );

      return {
        success: true,
        fileId,
        filename: response.filename || filename,
        size: response.size,
        message: SUCCESS_MESSAGES.FILE_DOWNLOADED
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || ERROR_MESSAGES.FILE_DOWNLOAD_FAILED;
      throw new Error(errorMessage);
    }
  }

  /**
   * Get file metadata
   * @param {string} fileId - File ID
   * @returns {Promise} - Promise resolving to file metadata
   */
  async getFileMetadata(fileId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.FILES.METADATA}/${fileId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || ERROR_MESSAGES.FILE_NOT_FOUND;
      throw new Error(errorMessage);
    }
  }

  /**
   * Get files for an application
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Promise resolving to files list
   */
  async getApplicationFiles(applicationId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.FILES.APPLICATION_FILES}/${applicationId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || ERROR_MESSAGES.FILE_NOT_FOUND;
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a file
   * @param {string} fileId - File ID to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteFile(fileId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.FILES.DELETE}/${fileId}`);
      return {
        success: true,
        fileId,
        message: response.data.message || 'File deleted successfully'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete file';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get file preview URL
   * @param {string} fileId - File ID
   * @returns {string} - Preview URL
   */
  getFilePreviewUrl(fileId) {
    return `${API_ENDPOINTS.FILES.PREVIEW}/${fileId}`;
  }

  /**
   * Get file download URL
   * @param {string} fileId - File ID
   * @returns {string} - Download URL
   */
  getFileDownloadUrl(fileId) {
    return `${API_ENDPOINTS.FILES.DOWNLOAD}/${fileId}`;
  }

  /**
   * Get file categories from backend
   * @returns {Promise} - Promise resolving to file categories
   */
  async getFileCategoriesFromBackend() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FILES.CATEGORIES);
      return response.data.data;
    } catch (error) {
      // Fallback to local categories if backend is not available
      console.warn('Failed to fetch file categories from backend, using local fallback');
      return this.getFileCategories();
    }
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateFileForUpload(file, options = {}) {
    const {
      category = FILE_CATEGORIES.MEDICAL_REPORT,
      maxSize = this.uploadLimits.maxSize,
      allowedTypes = this.uploadLimits.allowedTypes
    } = options;

    const errors = validateFile(file, { maxSize, allowedTypes, category });

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        category: getFileCategory(file.type)
      }
    };
  }

  /**
   * Get upload limits
   * @returns {Object} - Upload limits
   */
  getUploadLimits() {
    return {
      ...this.uploadLimits,
      maxSizeMB: Math.round(this.uploadLimits.maxSize / (1024 * 1024)),
      maxTotalSizeMB: Math.round(this.uploadLimits.maxTotalSize / (1024 * 1024)),
      allowedTypesList: this.uploadLimits.allowedTypes
        .map(type => type.split('/')[1]?.toUpperCase() || type)
        .join(', ')
    };
  }

  /**
   * Get file categories
   * @returns {Object} - File categories
   */
  getFileCategories() {
    return this.categories;
  }

  /**
   * Check if file type is supported
   * @param {string} fileType - File MIME type
   * @returns {boolean} - Is supported
   */
  isFileTypeSupported(fileType) {
    return this.uploadLimits.allowedTypes.includes(fileType);
  }

  /**
   * Get file icon based on type
   * @param {string} fileType - File MIME type
   * @returns {string} - Icon name
   */
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) {
      return 'image';
    } else if (fileType === 'application/pdf') {
      return 'document';
    } else {
      return 'file';
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize(bytes) {
    return formatFileSize(bytes);
  }
}

export default new FileService(); 