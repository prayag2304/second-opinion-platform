import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

/**
 * Payment Status Component
 * Displays payment status with appropriate icons and details
 */
const PaymentStatus = ({ 
  status, 
  paymentId, 
  amount, 
  currency = 'INR',
  timestamp,
  description,
  className = ''
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      success: {
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Payment Successful',
        message: 'Your payment has been processed successfully'
      },
      failed: {
        icon: XCircleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Payment Failed',
        message: 'Your payment could not be processed'
      },
      pending: {
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        title: 'Payment Pending',
        message: 'Your payment is being processed'
      },
      cancelled: {
        icon: ExclamationTriangleIcon,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'Payment Cancelled',
        message: 'Your payment was cancelled'
      },
      refunded: {
        icon: CheckCircleIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        title: 'Payment Refunded',
        message: 'Your payment has been refunded'
      }
    };

    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const formatAmount = (amount, currency) => {
    if (currency === 'INR') {
      return `₹${(amount / 100).toFixed(2)}`;
    }
    return `${currency} ${(amount / 100).toFixed(2)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`rounded-lg border p-6 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${config.color}`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${config.color}`}>
            {config.title}
          </h3>
          
          <p className="text-sm text-gray-600 mt-1">
            {config.message}
          </p>
          
          {description && (
            <p className="text-sm text-gray-700 mt-2">
              {description}
            </p>
          )}
          
          <div className="mt-4 space-y-2">
            {paymentId && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Payment ID:</span>
                <span className="font-mono text-gray-600">{paymentId}</span>
              </div>
            )}
            
            {amount && (
              <div className="flex items-center space-x-2 text-sm">
                <CurrencyRupeeIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatAmount(amount, currency)}
                </span>
              </div>
            )}
            
            {timestamp && (
              <div className="flex items-center space-x-2 text-sm">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-600">{formatTimestamp(timestamp)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 