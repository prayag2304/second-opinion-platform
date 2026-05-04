import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import errorHandler from '../utils/errorHandler';

/**
 * Authentication service for Spring Boot backend
 * Enhanced with comprehensive error handling
 */
class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise resolving to user data and token
   */
  async login(email, password) {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
          email,
          password
        });
        return response;
      },
      {
        customMessage: 'Login failed. Please check your credentials.',
        showToast: false
      }
    );
  }

  /**
   * Register new user (patient or doctor)
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise resolving to success message
   */
  async register(userData) {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response;
      },
      {
        customMessage: 'Registration failed. Please try again.',
        showToast: false
      }
    );
  }

  /**
   * Register new patient
   * @param {Object} userData - Patient registration data
   * @returns {Promise} - Promise resolving to success message
   */
  async registerPatient(userData) {
    // Transform frontend format to backend format
    const backendFormat = {
      email: userData.email,
      password: userData.password,
      role: 'PATIENT', // Backend expects uppercase enum
      profile: {
        fullName: userData.name, // 'name' -> 'profile.fullName'
        phone: userData.phoneNumber || null, // 'phoneNumber' -> 'profile.phone'
        address: userData.address || null,
        dateOfBirth: userData.dateOfBirth || null,
        bio: userData.bio || null
      }
    };
    return this.register(backendFormat);
  }

  /**
   * Register new doctor
   * @param {Object} userData - Doctor registration data
   * @returns {Promise} - Promise resolving to success message
   */
  async registerDoctor(userData) {
    // Transform frontend format to backend format
    const backendFormat = {
      email: userData.email,
      password: userData.password,
      role: 'DOCTOR', // Backend expects uppercase enum
      profile: {
        fullName: userData.name || userData.fullName,
        phone: userData.phoneNumber || userData.phone || null,
        address: userData.address || null,
        dateOfBirth: userData.dateOfBirth || null,
        licenseNumber: userData.licenseNumber || null,
        specialty: userData.specialty || null,
        bio: userData.bio || null
      }
    };
    return this.register(backendFormat);
  }

  /**
   * Handle forgot password request
   * @param {string} email - User email
   * @returns {Promise} - Promise resolving to success message
   */
  async forgotPassword(email) {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return response;
      },
      {
        customMessage: 'Password reset request failed. Please try again.',
        showToast: false
      }
    );
  }

  /**
   * Get current user data
   * @returns {Promise} - Promise resolving to user data
   */
  async getCurrentUser() {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
        return response;
      },
      {
        customMessage: 'Failed to get user data.',
        showToast: false
      }
    );
  }



  /**
   * Logout user
   * @returns {Promise} - Promise resolving to success message
   */
  async logout() {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        return response;
      },
      {
        customMessage: 'Logout failed.',
        showToast: false // Don't show toast for logout
      }
    );
  }
}

export default new AuthService();