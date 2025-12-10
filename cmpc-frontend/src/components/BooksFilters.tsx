import { useCallback, type ChangeEvent } from "react";

interface BooksFiltersProps {
  searchField: string;
  searchInput: string;
  availability: string;
  onSearchFieldChange: (value: string) => void;
  onSearchInputChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
}

function BooksFilters({
  searchField,
  searchInput,
  availability,
  onSearchFieldChange,
  onSearchInputChange,
  onAvailabilityChange,
}: BooksFiltersProps) {
  const handleSearchFieldChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => onSearchFieldChange(event.target.value), [onSearchFieldChange]);
  const handleSearchInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => onSearchInputChange(event.target.value), [onSearchInputChange]);
  const handleDisponibilidadChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => onAvailabilityChange(event.target.value), [onAvailabilityChange]);

  return (
    <div className="bg-white px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <select
          value={searchField}
          onChange={handleSearchFieldChange}
          className="text-sm text-gray-600 bg-transparent border-0 focus:outline-none focus:ring-0"
        >
          <option value="search">Todos</option>
          <option value="titulo">Título</option>
          <option value="autor">Autor</option>
          <option value="editorial">Editorial</option>
          <option value="genero">Género</option>
        </select>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar libros..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="w-full px-0 py-2 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>
        <select
          value={availability}
          onChange={handleDisponibilidadChange}
          className="text-sm text-gray-600 bg-transparent border-0 focus:outline-none focus:ring-0"
        >
          <option value="">Estado</option>
          <option value="true">Disponible</option>
          <option value="false">Agotado</option>
        </select>
      </div>
    </div>
  );
}

export default BooksFilters;
