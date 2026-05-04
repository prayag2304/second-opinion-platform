import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { USER_ROLES, PERMISSION_ACTIONS, PERMISSION_RESOURCES, PERMISSION_PATTERNS } from '../config/constants';
import errorHandler from '../utils/errorHandler';

/**
 * Enhanced Permission Service
 * Handles dynamic permission checking with backend integration and caching
 */
class PermissionService {
  constructor() {
    this.permissionsCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.lastCacheUpdate = 0;
    this.isLoading = false;
  }

  /**
   * Check if user has permission for specific action and resource
   * @param {Object} user - User object
   * @param {string} action - Action (read, create, update, delete)
   * @param {string} resource - Resource (profile, applications, etc.)
   * @param {Object} options - Options for permission checking
   * @returns {Promise<boolean>} - Whether user has permission
   */
  async hasPermission(user, action, resource, options = {}) {
    const {
      useCache = true,
      fallbackToStatic = true,
      showToast = false,
      logError = true
    } = options;

    if (!user || !user.role) {
      return false;
    }

    // Admin has all permissions
    if (user.role === USER_ROLES.ADMIN) {
      return true;
    }

    try {
      // Try dynamic permission check first
      if (useCache) {
        const cachedPermissions = this.getCachedPermissions(user.id);
        if (cachedPermissions) {
          return this.checkPermissionFromCache(cachedPermissions, action, resource);
        }
      }

      // Fetch permissions from backend
      const permissions = await this.fetchUserPermissions(user.id);
      
      if (permissions && permissions.length > 0) {
        // Cache the permissions
        this.cachePermissions(user.id, permissions);
        
        // Check if user has the specific permission
        return this.checkPermissionFromCache(permissions, action, resource);
      }

      // Fallback to static permissions if backend is not available
      if (fallbackToStatic) {
        return this.checkStaticPermission(user, action, resource);
      }

      return false;
    } catch (error) {
      // Log error if requested
      if (logError) {
        console.error('Permission check failed:', error);
      }

      // Show toast if requested
      if (showToast) {
        errorHandler.handleGeneralError(error, {
          showToast: true,
          customMessage: 'Failed to check permissions. Using fallback.'
        });
      }

      // Fallback to static permissions
      if (fallbackToStatic) {
        return this.checkStaticPermission(user, action, resource);
      }

      return false;
    }
  }

  /**
   * Fetch user permissions from backend
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Array of permission objects
   */
  async fetchUserPermissions(userId) {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS);
        return response.data.data.permissions || [];
      },
      {
        customMessage: 'Failed to fetch user permissions.',
        showToast: false,
        fallbackValue: []
      }
    );
  }

  /**
   * Check permission against backend API
   * @param {Object} user - User object
   * @param {string} action - Action
   * @param {string} resource - Resource
   * @returns {Promise<boolean>} - Whether user has permission
   */
  async checkPermissionWithBackend(user, action, resource) {
    return errorHandler.handleServiceError(
      async () => {
        const response = await apiClient.post(API_ENDPOINTS.PERMISSIONS.CHECK_PERMISSION, {
          action,
          resource
        });
        return response.data.data.hasPermission || false;
      },
      {
        customMessage: 'Failed to check permission with backend.',
        showToast: false,
        fallbackValue: false
      }
    );
  }

  /**
   * Get cached permissions for user
   * @param {number} userId - User ID
   * @returns {Array|null} - Cached permissions or null if expired
   */
  getCachedPermissions(userId) {
    const cacheKey = `permissions_${userId}`;
    const cached = this.permissionsCache.get(cacheKey);
    
    if (!cached) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.permissionsCache.delete(cacheKey);
      return null;
    }

    return cached.permissions;
  }

  /**
   * Cache permissions for user
   * @param {number} userId - User ID
   * @param {Array} permissions - Permissions array
   */
  cachePermissions(userId, permissions) {
    const cacheKey = `permissions_${userId}`;
    this.permissionsCache.set(cacheKey, {
      permissions,
      timestamp: Date.now()
    });
  }

  /**
   * Check permission from cached permissions
   * @param {Array} permissions - Cached permissions
   * @param {string} action - Action
   * @param {string} resource - Resource
   * @returns {boolean} - Whether user has permission
   */
  checkPermissionFromCache(permissions, action, resource) {
    return permissions.some(permission => 
      permission.action === action && 
      permission.resource === resource &&
      permission.isActive !== false
    );
  }

  /**
   * Check static permission (fallback)
   * @param {Object} user - User object
   * @param {string} action - Action
   * @param {string} resource - Resource
   * @returns {boolean} - Whether user has permission
   */
  checkStaticPermission(user, action, resource) {
    // Define static role-based permissions
    const staticPermissions = {
      [USER_ROLES.PATIENT]: {
        [PERMISSION_ACTIONS.READ]: [
          PERMISSION_RESOURCES.DOCTORS,
          PERMISSION_RESOURCES.APPLICATIONS,
          PERMISSION_RESOURCES.NOTIFICATIONS,
          PERMISSION_RESOURCES.PROFILE,
          PERMISSION_RESOURCES.PAYMENTS,
          PERMISSION_RESOURCES.FILES
        ],
        [PERMISSION_ACTIONS.CREATE]: [
          PERMISSION_RESOURCES.APPLICATIONS,
          PERMISSION_RESOURCES.PAYMENTS,
          PERMISSION_RESOURCES.FILES
        ],
        [PERMISSION_ACTIONS.UPDATE]: [
          PERMISSION_RESOURCES.PROFILE,
          PERMISSION_RESOURCES.APPLICATIONS,
          PERMISSION_RESOURCES.NOTIFICATIONS,
          PERMISSION_RESOURCES.FILES
        ],
        [PERMISSION_ACTIONS.DELETE]: [
          PERMISSION_RESOURCES.FILES
        ]
      },
      [USER_ROLES.DOCTOR]: {
        [PERMISSION_ACTIONS.READ]: [
          PERMISSION_RESOURCES.APPLICATIONS,
          PERMISSION_RESOURCES.NOTIFICATIONS,
          PERMISSION_RESOURCES.PROFILE,
          PERMISSION_RESOURCES.EARNINGS,
          PERMISSION_RESOURCES.REVIEWS,
          PERMISSION_RESOURCES.FILES
        ],
        [PERMISSION_ACTIONS.CREATE]: [
          PERMISSION_RESOURCES.REVIEWS
        ],
        [PERMISSION_ACTIONS.UPDATE]: [
          PERMISSION_RESOURCES.PROFILE,
          PERMISSION_RESOURCES.APPLICATIONS,
          PERMISSION_RESOURCES.NOTIFICATIONS,
          PERMISSION_RESOURCES.SYSTEM // For availability
        ]
      }
    };

    const userPermissions = staticPermissions[user.role];
    if (!userPermissions) {
      return false;
    }

    return userPermissions[action]?.includes(resource) || false;
  }

  /**
   * Check multiple permissions at once
   * @param {Object} user - User object
   * @param {Array} permissions - Array of {action, resource} objects
   * @param {Object} options - Options for permission checking
   * @returns {Promise<Object>} - Object with permission results
   */
  async checkMultiplePermissions(user, permissions, options = {}) {
    const results = {};
    
    for (const permission of permissions) {
      const { action, resource } = permission;
      const key = `${action}:${resource}`;
      results[key] = await this.hasPermission(user, action, resource, options);
    }
    
    return results;
  }

  /**
   * Check if user has any of the specified permissions
   * @param {Object} user - User object
   * @param {Array} permissions - Array of {action, resource} objects
   * @param {Object} options - Options for permission checking
   * @returns {Promise<boolean>} - Whether user has any of the permissions
   */
  async hasAnyPermission(user, permissions, options = {}) {
    for (const permission of permissions) {
      const { action, resource } = permission;
      if (await this.hasPermission(user, action, resource, options)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if user has all of the specified permissions
   * @param {Object} user - User object
   * @param {Array} permissions - Array of {action, resource} objects
   * @param {Object} options - Options for permission checking
   * @returns {Promise<boolean>} - Whether user has all permissions
   */
  async hasAllPermissions(user, permissions, options = {}) {
    for (const permission of permissions) {
      const { action, resource } = permission;
      if (!(await this.hasPermission(user, action, resource, options))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get all permissions for user
   * @param {Object} user - User object
   * @param {Object} options - Options for fetching permissions
   * @returns {Promise<Array>} - Array of permission objects
   */
  async getUserPermissions(user, options = {}) {
    const {
      useCache = true,
      forceRefresh = false
    } = options;

    if (!user || !user.id) {
      return [];
    }

    // Return cached permissions if available and not forcing refresh
    if (useCache && !forceRefresh) {
      const cached = this.getCachedPermissions(user.id);
      if (cached) {
        return cached;
      }
    }

    try {
      const permissions = await this.fetchUserPermissions(user.id);
      
      if (permissions && permissions.length > 0) {
        this.cachePermissions(user.id, permissions);
        return permissions;
      }

      // Return static permissions as fallback
      return this.getStaticPermissions(user);
    } catch (error) {
      console.error('Failed to get user permissions:', error);
      return this.getStaticPermissions(user);
    }
  }

  /**
   * Get static permissions for user
   * @param {Object} user - User object
   * @returns {Array} - Array of static permission objects
   */
  getStaticPermissions(user) {
    const staticPermissions = {
      [USER_ROLES.PATIENT]: [
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.PROFILE },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.PROFILE },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.DOCTORS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.CREATE, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.NOTIFICATIONS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.NOTIFICATIONS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.PAYMENTS },
        { action: PERMISSION_ACTIONS.CREATE, resource: PERMISSION_RESOURCES.PAYMENTS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.FILES },
        { action: PERMISSION_ACTIONS.CREATE, resource: PERMISSION_RESOURCES.FILES },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.FILES },
        { action: PERMISSION_ACTIONS.DELETE, resource: PERMISSION_RESOURCES.FILES }
      ],
      [USER_ROLES.DOCTOR]: [
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.PROFILE },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.PROFILE },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.NOTIFICATIONS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.NOTIFICATIONS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.EARNINGS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.SYSTEM },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.REVIEWS },
        { action: PERMISSION_ACTIONS.CREATE, resource: PERMISSION_RESOURCES.REVIEWS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.FILES }
      ],
      [USER_ROLES.ADMIN]: [
        // Admin has all permissions
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.USERS },
        { action: PERMISSION_ACTIONS.CREATE, resource: PERMISSION_RESOURCES.USERS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.USERS },
        { action: PERMISSION_ACTIONS.DELETE, resource: PERMISSION_RESOURCES.USERS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.APPLICATIONS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.PAYMENTS },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.FILES },
        { action: PERMISSION_ACTIONS.DELETE, resource: PERMISSION_RESOURCES.FILES },
        { action: PERMISSION_ACTIONS.READ, resource: PERMISSION_RESOURCES.SYSTEM },
        { action: PERMISSION_ACTIONS.UPDATE, resource: PERMISSION_RESOURCES.SYSTEM }
      ]
    };

    return staticPermissions[user.role] || [];
  }

  /**
   * Clear permissions cache for user
   * @param {number} userId - User ID
   */
  clearUserPermissionsCache(userId) {
    const cacheKey = `permissions_${userId}`;
    this.permissionsCache.delete(cacheKey);
  }

  /**
   * Clear all permissions cache
   */
  clearAllPermissionsCache() {
    this.permissionsCache.clear();
  }

  /**
   * Refresh permissions for user
   * @param {Object} user - User object
   * @returns {Promise<Array>} - Updated permissions
   */
  async refreshUserPermissions(user) {
    this.clearUserPermissionsCache(user.id);
    return await this.getUserPermissions(user, { forceRefresh: true });
  }

  /**
   * Check permission using pattern (e.g., 'patient:read:profile')
   * @param {Object} user - User object
   * @param {string} pattern - Permission pattern
   * @param {Object} options - Options for permission checking
   * @returns {Promise<boolean>} - Whether user has permission
   */
  async hasPermissionPattern(user, pattern, options = {}) {
    const [role, action, resource] = pattern.split(':');
    
    if (role !== user.role) {
      return false;
    }
    
    return await this.hasPermission(user, action, resource, options);
  }

  /**
   * Get permission patterns for user role
   * @param {string} role - User role
   * @returns {Array} - Array of permission patterns
   */
  getPermissionPatternsForRole(role) {
    const patterns = Object.values(PERMISSION_PATTERNS);
    return patterns.filter(pattern => pattern.startsWith(`${role}:`));
  }

  /**
   * Validate permission action and resource
   * @param {string} action - Action to validate
   * @param {string} resource - Resource to validate
   * @returns {boolean} - Whether action and resource are valid
   */
  validatePermission(action, resource) {
    const validActions = Object.values(PERMISSION_ACTIONS);
    const validResources = Object.values(PERMISSION_RESOURCES);
    
    return validActions.includes(action) && validResources.includes(resource);
  }
}

// Create singleton instance
const permissionService = new PermissionService();

export default permissionService;

// Export individual methods for convenience
export const {
  hasPermission,
  checkMultiplePermissions,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  clearUserPermissionsCache,
  clearAllPermissionsCache,
  refreshUserPermissions,
  hasPermissionPattern,
  getPermissionPatternsForRole,
  validatePermission
} = permissionService; 