type OverviewPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function OverviewPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: OverviewPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const firstItem =
    (currentPage - 1) * pageSize + 1;

  const lastItem = Math.min(
    currentPage * pageSize,
    totalItems
  );

  return (
    <div className="overview-pagination">
      <span className="overview-pagination__summary">
        Показано {firstItem}–{lastItem} із {totalItems}
      </span>

      <div className="overview-pagination__controls">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >
          ‹
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={
                  currentPage === page
                    ? "overview-pagination__page overview-pagination__page--active"
                    : "overview-pagination__page"
                }
                onClick={() =>
                  onPageChange(page)
                }
              >
                {page}
              </button>
            );
          }
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default OverviewPagination;