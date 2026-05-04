import React from 'react';
import { ClipLoader, BeatLoader, PulseLoader } from 'react-spinners';

/**
 * Enhanced reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.variant - Color variant (primary, secondary, success, danger, warning)
 * @param {string} props.message - Loading message
 * @param {boolean} props.overlay - Show as overlay
 * @param {boolean} props.fullScreen - Show full screen
 * @param {string} props.type - Spinner type (clip, beat, pulse)
 * @param {boolean} props.loading - Show loading state
 * @param {string|Error} props.error - Error state
 * @param {string} props.errorText - Custom error text
 * @param {boolean} props.showRetry - Show retry button
 * @param {Function} props.onRetry - Retry callback
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  message = 'Loading...', 
  overlay = false,
  fullScreen = false,
  type = 'clip',
  loading = true,
  error = null,
  errorText = 'Something went wrong',
  showRetry = false,
  onRetry,
  className = ''
}) => {
  const sizeMap = {
    sm: 20,
    md: 30,
    lg: 40
  };
  
  const colorMap = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[variant];
  
  const SpinnerComponent = () => {
    switch (type) {
      case 'beat':
        return <BeatLoader size={spinnerSize / 2} color={spinnerColor} />;
      case 'pulse':
        return <PulseLoader size={spinnerSize / 3} color={spinnerColor} />;
      default:
        return <ClipLoader size={spinnerSize} color={spinnerColor} />;
    }
  };

  // Error state
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        <div className="text-red-500 mb-3">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600 text-center mb-4">
          {typeof error === 'string' ? error : errorText}
        </p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-primary btn-sm"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Loading state
  if (!loading) {
    return null;
  }

  const content = (
    <div className="flex flex-col items-center justify-center">
      <SpinnerComponent />
      {message && (
        <div className="mt-3 text-gray-600">
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
        {content}
      </div>
    );
  }

  return (
    <div className={`text-center py-4 ${className}`}>
      {content}
    </div>
  );
};

export default LoadingSpinner;