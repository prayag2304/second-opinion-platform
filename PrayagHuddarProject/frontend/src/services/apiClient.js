import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import errorHandler from '../utils/errorHandler';
import { validateJwtToken, shouldRefreshToken, getSecurityHeaders } from '../utils/security';

/**
 * Modern API client with Axios configuration for Spring Boot backend
 * Replaces the deprecated api.js utility
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor to add auth token and security headers
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        
        // Add authorization header if token exists and is valid
        if (token && !this.isTokenExpired()) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add security headers
        const securityHeaders = getSecurityHeaders();
        Object.assign(config.headers, securityHeaders);
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token
            const newToken = await this.refreshToken();
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
            this.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        // Use centralized error handler for other errors
        const errorResult = errorHandler.handleApiError(error, {
          showToast: false, // Let individual services handle toast display
          redirectOnAuth: true,
          logError: true
        });

        return Promise.reject({
          ...error,
          message: errorResult.message,
          status: errorResult.code
        });
      }
    );
  }

  /**
   * Check if token is expired using enhanced validation
   */
  isTokenExpired() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return true;
    }
    
    const validation = validateJwtToken(token);
    return !validation.isValid;
  }

  /**
   * Check if token needs refresh
   */
  shouldRefreshToken() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    const refreshStatus = shouldRefreshToken(token);
    return refreshStatus.shouldRefresh || refreshStatus.isExpired;
  }

  /**
   * Set auth token with proper validation
   */
  setAuthToken(token) {
    const validation = validateJwtToken(token);
    
    if (!validation.isValid) {
      throw new Error(`Invalid token: ${validation.error}`);
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiry', validation.expiresAt.toString());
    localStorage.setItem('token_issued', validation.issuedAt.toString());
  }

  /**
   * Clear auth data
   */
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('token_issued');
    localStorage.removeItem('user');
  }

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await this.client.post('/auth/refresh');
      const { token } = response.data;
      
      if (token) {
        this.setAuthToken(token);
        return token;
      }
      
      throw new Error('No token received from refresh endpoint');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Retry failed requests with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Don't retry on certain status codes
        if (error.status && [400, 401, 403, 404, 422].includes(error.status)) {
          break;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Upload file with progress tracking
   */
  uploadFile(url, formData, onProgress) {
    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  }

  /**
   * Download file
   */
  async downloadFile(url, filename) {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });
      
      // Get filename from response headers if not provided
      const contentDisposition = response.headers['content-disposition'];
      if (!filename && contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return {
        success: true,
        filename: filename,
        size: blob.size
      };
    } catch (error) {
      toast.error('Failed to download file');
      throw error;
    }
  }

  // Standard HTTP methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;