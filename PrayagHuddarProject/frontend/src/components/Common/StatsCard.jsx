import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

/**
 * Reusable stats card component
 * @param {Object} props - Component props
 */
const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  trendLabel,
  color = 'primary',
  size = 'md',
  loading = false,
  className = ''
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      value: 'text-primary-900'
    },
    success: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-900'
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-900'
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-900'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-900'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      value: 'text-gray-900'
    }
  };

  const sizeClasses = {
    sm: {
      padding: 'p-4',
      iconSize: 'w-8 h-8',
      valueSize: 'text-2xl',
      titleSize: 'text-sm'
    },
    md: {
      padding: 'p-6',
      iconSize: 'w-10 h-10',
      valueSize: 'text-3xl',
      titleSize: 'text-base'
    },
    lg: {
      padding: 'p-8',
      iconSize: 'w-12 h-12',
      valueSize: 'text-4xl',
      titleSize: 'text-lg'
    }
  };

  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    }
    if (trend === 'down') {
      return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 ${sizes.padding} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className={`${sizes.iconSize} bg-gray-200 rounded`}></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${sizes.padding} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-medium text-gray-600 ${sizes.titleSize}`}>
          {title}
        </h3>
        {icon && (
          <div className={`${colors.bg} ${sizes.iconSize} rounded-lg flex items-center justify-center`}>
            <div className={`${colors.icon} ${sizes.iconSize === 'w-8 h-8' ? 'w-5 h-5' : sizes.iconSize === 'w-10 h-10' ? 'w-6 h-6' : 'w-7 h-7'}`}>
              {icon}
            </div>
          </div>
        )}
      </div>

      <div className={`${colors.value} ${sizes.valueSize} font-bold mb-2`}>
        {value}
      </div>

      {subtitle && (
        <p className="text-gray-500 text-sm mb-2">
          {subtitle}
        </p>
      )}

      {(trend || trendValue || trendLabel) && (
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          {trendValue && (
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trendValue}
            </span>
          )}
          {trendLabel && (
            <span className="text-sm text-gray-500">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;