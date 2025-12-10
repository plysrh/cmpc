interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-500">
        {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
