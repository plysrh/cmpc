interface BooksHeaderProps {
  onNewBook: () => void;
  onExport: () => void;
  onLogout: () => void;
}

function BooksHeader({ onNewBook, onExport, onLogout }: BooksHeaderProps) {
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CMPC Libros</h1>
      <div className="flex gap-4">
        <button
          onClick={onNewBook}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Libro
        </button>
        <button
          onClick={onExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar CSV
        </button>
        <button
          onClick={onLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default BooksHeader;
