import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/book';

interface BooksListProps {
  books: Book[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

function BooksList({ books, loading, sortBy, sortOrder, onSort, onDelete }: BooksListProps) {
  const navigate = useNavigate();
  const handleSort = (field: string) => () => {
    onSort(field);
  }
  const handleEdit = (id: string) => () => {
    navigate(`/books/${id}/edit`)
  };
  const handleDelete = (id: string) => () => {
    onDelete(id);
  };

  return (
    <div className="bg-white rounded-lg shadow relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-gray-600">Cargando...</div>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('titulo')}>
              Título {sortBy === 'titulo' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('autor')}>
              Autor {sortBy === 'autor' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('editorial')}>
              Editorial {sortBy === 'editorial' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('precio')}>
              Precio {sortBy === 'precio' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('genero')}>
              Género {sortBy === 'genero' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={handleSort('createdAt')}>
              Fecha {sortBy === 'createdAt' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="px-4 py-3">{book.titulo}</td>
              <td className="px-4 py-3">{book.autor}</td>
              <td className="px-4 py-3">{book.editorial}</td>
              <td className="px-4 py-3">${book.precio}</td>
              <td className="px-4 py-3">{book.genero}</td>
              <td className="px-4 py-3">{new Date(book.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  onClick={handleEdit(book.id)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete(book.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksList;
