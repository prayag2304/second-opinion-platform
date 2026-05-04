/**
 * Utility functions for role handling
 */

/**
 * Normalize role from backend format (PATIENT) to frontend format (patient)
 * @param {string} role - Role from backend (uppercase enum)
 * @returns {string} - Normalized role (lowercase)
 */
export const normalizeRole = (role) => {
  if (!role) return null;
  return role.toLowerCase();
};

/**
 * Check if role matches (case-insensitive)
 * @param {string} role1 - First role
 * @param {string} role2 - Second role
 * @returns {boolean} - True if roles match
 */
export const rolesMatch = (role1, role2) => {
  if (!role1 || !role2) return false;
  return normalizeRole(role1) === normalizeRole(role2);
};

/**
 * Normalize user object role
 * @param {Object} user - User object
 * @returns {Object} - User object with normalized role
 */
export const normalizeUserRole = (user) => {
  if (!user) return null;
  return {
    ...user,
    role: normalizeRole(user.role)
  };
};

