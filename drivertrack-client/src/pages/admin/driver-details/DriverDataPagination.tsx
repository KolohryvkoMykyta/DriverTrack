import { ChevronLeft, ChevronRight } from "lucide-react";

type DriverDataPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function DriverDataPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DriverDataPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="driver-data-pagination">
      <button
        type="button"
        aria-label="Попередня сторінка"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={17} />
        Назад
      </button>

      <span>
        Сторінка <strong>{currentPage}</strong> з {totalPages}
      </span>

      <button
        type="button"
        aria-label="Наступна сторінка"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Далі
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

export default DriverDataPagination;