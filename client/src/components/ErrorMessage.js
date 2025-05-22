import React from 'react';

/**
 * ErrorMessage component that displays error messages with optional retry functionality
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Optional callback function for retry action
 * @param {string} props.errorCode - Optional error code or status to display
 * @param {boolean} props.small - If true, renders a smaller, more compact error message
 * @param {boolean} props.inline - If true, renders in a more inline-friendly format
 */
const ErrorMessage = ({ 
  message = 'An error occurred. Please try again later.',
  onRetry,
  errorCode,
  small = false,
  inline = false
}) => {
  // Determine the container and text size classes based on props
  const containerClasses = inline 
    ? 'alert alert-danger p-2 d-inline-block' 
    : small 
      ? 'alert alert-danger p-2 mb-2' 
      : 'alert alert-danger my-4';
  
  const textClass = small ? 'small mb-0' : 'mb-2';

  return (
    <div className={containerClasses} role="alert" data-testid="error-message">
      <div className="d-flex align-items-center">
        {!small && (
          <i className="fas fa-exclamation-circle me-2" aria-hidden="true"></i>
        )}
        <div className="flex-grow-1">
          <p className={textClass}>
            {errorCode && <strong>Error {errorCode}: </strong>}
            {message}
          </p>
          {onRetry && (
            <button 
              onClick={onRetry} 
              className={`btn ${small ? 'btn-sm' : ''} btn-outline-danger`}
              data-testid="retry-button"
            >
              <i className="fas fa-sync-alt me-1" aria-hidden="true"></i> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
