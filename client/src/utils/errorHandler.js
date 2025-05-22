/**
 * Utility functions to handle different types of errors and return appropriate error messages
 */

/**
 * Get a user-friendly error message based on the error object
 * @param {Error} error - The error object (usually from an API call)
 * @param {string} fallbackMessage - Optional fallback message if a specific message cannot be determined
 * @returns {Object} Error information including message, code, and retry recommendation
 */
export const getErrorDetails = (error, fallbackMessage = 'An unexpected error occurred. Please try again later.') => {
  // Default error information
  const errorInfo = {
    message: fallbackMessage,
    code: null,
    canRetry: true
  };

  // No error provided
  if (!error) {
    return errorInfo;
  }

  // Handle Axios errors (network or HTTP errors)
  if (error.response) {
    // Server responded with an error status code
    const status = error.response.status;
    errorInfo.code = status;

    switch (status) {
      case 400:
        errorInfo.message = 'Invalid request. Please check your data and try again.';
        errorInfo.canRetry = false;
        break;
      case 401:
        errorInfo.message = 'Unauthorized access. Please log in again.';
        errorInfo.canRetry = false;
        break;
      case 403:
        errorInfo.message = 'Access forbidden. You don\'t have permission to access this resource.';
        errorInfo.canRetry = false;
        break;
      case 404:
        errorInfo.message = 'The requested resource was not found.';
        errorInfo.canRetry = false;
        break;
      case 429:
        errorInfo.message = 'Too many requests. Please try again later.';
        errorInfo.canRetry = true;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorInfo.message = 'Server error. Please try again later.';
        errorInfo.canRetry = true;
        break;
      default:
        errorInfo.message = error.response.data?.message || fallbackMessage;
        break;
    }
  } else if (error.request) {
    // Request was made but no response received (network error)
    errorInfo.message = 'Network error. Please check your internet connection and try again.';
    errorInfo.canRetry = true;
  } else if (error.message) {
    // Something else happened in making the request that triggered an error
    errorInfo.message = error.message;
  }

  return errorInfo;
};

/**
 * Check if the error is a network connectivity issue
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a network connectivity issue
 */
export const isNetworkError = (error) => {
  return error && error.request && !error.response;
};

/**
 * Check if the error is a server error (5xx)
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a server error
 */
export const isServerError = (error) => {
  return error?.response?.status >= 500 && error?.response?.status < 600;
};

/**
 * Check if the error is due to API rate limiting
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a rate limiting error
 */
export const isRateLimitError = (error) => {
  return error?.response?.status === 429;
};

export default {
  getErrorDetails,
  isNetworkError,
  isServerError,
  isRateLimitError
};
