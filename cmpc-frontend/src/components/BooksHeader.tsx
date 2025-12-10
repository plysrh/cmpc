interface BooksHeaderProps {
  onNewBook: () => void;
  onExport: () => void;
  onLogout: () => void;
}

function BooksHeader({ onNewBook, onExport, onLogout }: BooksHeaderProps) {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light text-gray-900">CMPC</h1>
          <p className="text-xs text-gray-500 mt-1">Sistema de Libros</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewBook}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
          >
            Nuevo
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
          >
            Exportar
          </button>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default BooksHeader;
