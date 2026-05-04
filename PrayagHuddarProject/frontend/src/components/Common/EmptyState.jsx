import React from 'react';

/**
 * Reusable empty state component
 * @param {Object} props - Component props
 */
const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No data available',
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <div className="mb-4">
        <i className={`${icon} text-muted`} style={{ fontSize: '4rem' }}></i>
      </div>
      
      <h4 className="text-muted mb-3">{title}</h4>
      
      {description && (
        <p className="text-muted mb-4">{description}</p>
      )}
      
      {actionLabel && onAction && (
        <button
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;