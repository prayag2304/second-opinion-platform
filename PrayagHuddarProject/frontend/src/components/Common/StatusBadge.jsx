import React from 'react';
import { USER_STATUS, APPLICATION_STATUS, PAYMENT_STATUS } from '../../config/constants';

const StatusBadge = ({ status, type = 'user' }) => {
  const getStatusConfig = (status, type) => {
    // User status configurations
    if (type === 'user') {
      switch (status) {
        case USER_STATUS.ACTIVE:
          return { 
            className: 'bg-green-100 text-green-800', 
            label: 'Active' 
          };
        case USER_STATUS.SUSPENDED:
          return { 
            className: 'bg-red-100 text-red-800', 
            label: 'Suspended' 
          };
        case USER_STATUS.PENDING:
          return { 
            className: 'bg-yellow-100 text-yellow-800', 
            label: 'Pending' 
          };
        case USER_STATUS.APPROVED:
          return { 
            className: 'bg-green-100 text-green-800', 
            label: 'Approved' 
          };
        case USER_STATUS.REJECTED:
          return { 
            className: 'bg-red-100 text-red-800', 
            label: 'Rejected' 
          };
        default:
          return { 
            className: 'bg-gray-100 text-gray-800', 
            label: status || 'Unknown' 
          };
      }
    }

    // Application status configurations
    if (type === 'application') {
      switch (status) {
        case APPLICATION_STATUS.PENDING:
          return { 
            className: 'bg-yellow-100 text-yellow-800', 
            label: 'Pending' 
          };
        case APPLICATION_STATUS.REVIEWED:
          return { 
            className: 'bg-green-100 text-green-800', 
            label: 'Reviewed' 
          };
        case APPLICATION_STATUS.CANCELLED:
          return { 
            className: 'bg-red-100 text-red-800', 
            label: 'Cancelled' 
          };
        default:
          return { 
            className: 'bg-gray-100 text-gray-800', 
            label: status || 'Unknown' 
          };
      }
    }

    // Payment status configurations
    if (type === 'payment') {
      switch (status) {
        case PAYMENT_STATUS.SUCCESS:
          return { 
            className: 'bg-green-100 text-green-800', 
            label: 'Success' 
          };
        case PAYMENT_STATUS.FAILED:
          return { 
            className: 'bg-red-100 text-red-800', 
            label: 'Failed' 
          };
        case PAYMENT_STATUS.PENDING:
          return { 
            className: 'bg-yellow-100 text-yellow-800', 
            label: 'Pending' 
          };
        case PAYMENT_STATUS.REFUNDED:
          return { 
            className: 'bg-orange-100 text-orange-800', 
            label: 'Refunded' 
          };
        default:
          return { 
            className: 'bg-gray-100 text-gray-800', 
            label: status || 'Unknown' 
          };
      }
    }

    // Default fallback
    return { 
      className: 'bg-gray-100 text-gray-800', 
      label: status || 'Unknown' 
    };
  };

  const config = getStatusConfig(status, type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;