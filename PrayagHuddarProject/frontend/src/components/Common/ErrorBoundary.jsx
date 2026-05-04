import React from 'react';

/**
 * Error Boundary component to catch and handle React errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to mock API in development
    if (process.env.NODE_ENV === 'development') {
      this.logError(error, errorInfo);
    }
  }

  logError = async (error, errorInfo) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'error',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6 text-6xl flex justify-center">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              {this.props.fallbackMessage || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex gap-4 justify-center mb-4">
              <button 
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                onClick={this.handleRetry}
              >
                <span className="mr-2">🔄</span> Try Again
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
                onClick={() => window.location.href = '/'}
              >
                <span className="mr-2">🏠</span> Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-primary-600 underline cursor-pointer">
                  <small>Show Error Details (Development)</small>
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <h6 className="font-semibold">Error:</h6>
                  <pre className="text-red-600 text-xs whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  <h6 className="mt-3 font-semibold">Component Stack:</h6>
                  <pre className="text-gray-500 text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;