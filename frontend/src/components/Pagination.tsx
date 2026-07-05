import type { PaginationMeta } from '../types/todo';

const PAGE_SIZE_OPTIONS = [1, 3, 5, 10, 20];

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

function Pagination({
  pagination,
  onPageChange,
  limit,
  onLimitChange,
}: PaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasItems = totalItems > 0;

  const startItem = hasItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = hasItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="pagination-wrap">
      <div className="pagination-summary">
        <p className="pagination-info">
          Hiển thị {startItem} - {endItem} / {totalItems} công việc
        </p>

        <label className="page-size-control">
          <span>Số lượng</span>
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} / trang
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-button"
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Trước
          </button>

          {pages.map((page) => (
            <button
              key={page}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              type="button"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-button"
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
