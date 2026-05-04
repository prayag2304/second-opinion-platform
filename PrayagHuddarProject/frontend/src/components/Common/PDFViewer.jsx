import React, { useState } from 'react';

const PDFViewer = ({ file, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Mock PDF viewer since react-pdf might have issues
  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <h3>{file}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="pdf-viewer-content">
          {loading && (
            <div className="pdf-loading">
              <div className="spinner"></div>
              <p>Loading PDF...</p>
            </div>
          )}
          
          {error ? (
            <div className="pdf-error">
              <p>Failed to load PDF</p>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <div className="pdf-placeholder">
              <div className="pdf-icon">📄</div>
              <p>PDF Viewer</p>
              <p className="pdf-filename">{file}</p>
              <p className="pdf-note">
                In a real application, this would display the PDF content using react-pdf
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;