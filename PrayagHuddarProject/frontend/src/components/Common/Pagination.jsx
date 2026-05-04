import React from 'react';

/**
 * Reusable pagination component
 * @param {Object} props - Component props
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  showSizeChanger = true,
  pageSize,
  onPageSizeChange,
  totalItems,
  maxVisible = 5
}) => {
  // Generate page numbers
  const getPageNumbers = () => {
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
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
      {showInfo && (
        <div className="mb-3 mb-md-0">
          <small className="text-muted">
            Showing {startItem} to {endItem} of {totalItems} entries
          </small>
        </div>
      )}

      <div className="d-flex align-items-center gap-3">
        {showSizeChanger && (
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">Show:</small>
            <select
              className="form-select form-select-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              style={{ width: 'auto' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <nav aria-label="Pagination">
          <ul className="pagination pagination-sm mb-0">
            {/* Previous button */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>

            {/* First page */}
            {pageNumbers[0] > 1 && (
              <>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                </li>
                {pageNumbers[0] > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map(page => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            {/* Last page */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            {/* Next button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;