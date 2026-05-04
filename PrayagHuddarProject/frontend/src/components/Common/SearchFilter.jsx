import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from '../../utils/helpers';

/**
 * Reusable search and filter component
 * @param {Object} props - Component props
 */
const SearchFilter = ({
  searchPlaceholder = 'Search...',
  onSearch,
  filters = [],
  onFilterChange,
  searchDelay = 300,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (onSearch) {
        onSearch(term);
      }
    }, searchDelay),
    [onSearch, searchDelay]
  );

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Handle filter change
  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilterValues = {
      ...filterValues,
      [filterKey]: value
    };
    
    setFilterValues(newFilterValues);
    
    if (onFilterChange) {
      onFilterChange(newFilterValues);
    }
  }, [filterValues, onFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterValues({});
    
    if (onSearch) {
      onSearch('');
    }
    
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onSearch, onFilterChange]);

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 p-4 mb-6 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              
              {filter.type === 'select' && (
                <select
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    filter.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={filter.disabled}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {filter.type === 'range' && (
                <input
                  type="range"
                  className="w-full"
                  min={filter.min}
                  max={filter.max}
                  step={filter.step || 1}
                  value={filterValues[filter.key] || filter.min}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}
              
              {filter.type === 'number' && (
                <input
                  type="number"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min={filter.min}
                  max={filter.max}
                  placeholder={filter.placeholder}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Clear filters button */}
          <div className="flex items-end">
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

        {/* Active filters display */}
        {Object.keys(filterValues).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active filters:</span>
            {Object.entries(filterValues).map(([key, value]) => {
              if (!value) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;
              
              return (
                <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  {filter.label}: {value}
                  <button
                    type="button"
                    className="ml-2 text-primary-600 hover:text-primary-800"
                    onClick={() => handleFilterChange(key, '')}
                  >
                    ×
                  </button>
                </span>
              );
            })}
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchFilter;