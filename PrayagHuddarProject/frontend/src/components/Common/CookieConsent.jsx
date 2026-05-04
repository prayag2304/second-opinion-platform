import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = async (accepted) => {
    setLoading(true);
    
    try {
      // Store consent locally
      localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to record cookie consent:', error);
      // Still hide banner and store locally even if API fails
      localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50"
      role="banner"
      aria-label="Cookie consent"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="mb-1 font-medium">We use cookies to enhance your experience</p>
                <p className="text-sm text-gray-300">
                  We use cookies to analyze site usage, personalize content, and provide better user experience. 
                  By continuing to use this site, you consent to our use of cookies.
                  <a href="#privacy" className="text-blue-400 ml-1 hover:text-blue-300">Learn more</a>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleConsent(false)}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner mr-1"></div>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Decline
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleConsent(true)}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner mr-1"></div>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Accept
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;