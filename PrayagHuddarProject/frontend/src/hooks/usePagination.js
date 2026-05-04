import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../config/constants';

/**
 * Custom hook for pagination logic
 * @param {Object} options - Pagination options
 * @returns {Object} Pagination state and methods
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = 1,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    maxPageSize = PAGINATION.MAX_PAGE_SIZE
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Calculate total pages
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  /**
   * Calculate pagination info
   */
  const paginationInfo = useMemo(() => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    return {
      startItem,
      endItem,
      totalItems,
      currentPage,
      totalPages,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [currentPage, pageSize, totalItems, totalPages]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((newPageSize) => {
    const validPageSize = Math.min(newPageSize, maxPageSize);
    setPageSize(validPageSize);
    setCurrentPage(1); // Reset to first page
  }, [maxPageSize]);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(0);
  }, [initialPage, initialPageSize]);

  /**
   * Update total items (usually called after API response)
   */
  const updateTotalItems = useCallback((total) => {
    setTotalItems(total);
  }, []);

  /**
   * Generate page numbers for pagination component
   */
  const getPageNumbers = useCallback((maxVisible = 5) => {
    const pages = [];
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return {
    ...paginationInfo,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    reset,
    updateTotalItems,
    getPageNumbers
  };
};

export default usePagination;