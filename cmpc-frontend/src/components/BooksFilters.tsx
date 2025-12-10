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
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex gap-3">
        <select
          value={searchField}
          onChange={handleSearchFieldChange}
          className="border rounded px-3 py-2"
        >
          <option value="search">Todos los campos</option>
          <option value="titulo">Título</option>
          <option value="autor">Autor</option>
          <option value="editorial">Editorial</option>
          <option value="genero">Género</option>
        </select>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchInput}
          onChange={handleSearchInputChange}
          className="flex-1 border rounded px-3 py-2"
        />
        <select
          value={availability}
          onChange={handleDisponibilidadChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Disponibilidad</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
      </div>
    </div>
  );
}

export default BooksFilters;
