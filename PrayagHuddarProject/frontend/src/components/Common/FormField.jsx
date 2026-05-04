import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Reusable form field component
 * @param {Object} props - Component props
 */
const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  children,
  helpText,
  ...props
}) => {
  const hasError = touched && error;
  const fieldId = `field-${name}`;

  const baseInputClasses = `
    block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
    sm:text-sm transition-colors duration-200
    ${hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
  `;

  const renderInput = () => {
    if (children) {
      return children;
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          name={name}
          className={`${baseInputClasses} ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={fieldId}
          name={name}
          className={`${baseInputClasses} ${className}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        >
          {props.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={fieldId}
        name={name}
        type={type}
        className={`${baseInputClasses} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        {...props}
      />
    );
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderInput()}
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helpText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;