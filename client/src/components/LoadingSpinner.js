import React from 'react';

/**
 * LoadingSpinner component that can be used at different sizes and with custom messages
 * @param {Object} props
 * @param {string} props.message - Optional custom loading message
 * @param {boolean} props.small - If true, renders a smaller spinner (useful for inline or component-level loading)
 * @param {boolean} props.fullPage - If true, centers the spinner in the middle of the page with more padding
 */
const LoadingSpinner = ({ message = 'Loading...', small = false, fullPage = false }) => {
  // Spinner size classes based on the small prop
  const spinnerSizeClass = small ? 'spinner-border-sm' : '';
  
  // Container classes based on the fullPage prop
  const containerClasses = fullPage 
    ? 'text-center my-5 py-5 d-flex flex-column align-items-center justify-content-center min-vh-50' 
    : 'text-center my-3';

  return (
    <div className={containerClasses} data-testid="loading-spinner">
      <div className={`spinner-border text-primary ${spinnerSizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className={small ? 'mt-1 mb-0 small' : 'mt-2'}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
