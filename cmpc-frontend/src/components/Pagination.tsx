interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = (value: number) => () => {
    onPageChange(value - 1);
  };
  const handleNext = (value: number) => () => {
    onPageChange(value - 1);
  };

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={handlePrev(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="px-4 py-2">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
