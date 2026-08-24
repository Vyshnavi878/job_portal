import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component
 * @param {number}   currentPage - 1-based
 * @param {number}   totalPages
 * @param {number}   totalItems
 * @param {number}   pageSize
 * @param {Function} onPageChange - (page: number) => void
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const from = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const to   = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPages();

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {totalItems !== undefined && (
        <p className="pagination-info">
          Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong> results
        </p>
      )}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="pagination-btn dots">…</span>
          ) : (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
