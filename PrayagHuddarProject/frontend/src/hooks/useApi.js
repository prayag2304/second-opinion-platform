import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { handleApiError, retryWithBackoff } from '../utils/helpers';

/**
 * Custom hook for API calls with loading, error handling, and retry logic
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} API state and methods
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API call with error handling and retry logic
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await retryWithBackoff(
          () => apiFunction(...args),
          retryAttempts,
          retryDelay
        );

        setData(result.data);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        return result;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      apiFunction,
      showSuccessToast,
      showErrorToast,
      successMessage,
      retryAttempts,
      retryDelay,
    ]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
