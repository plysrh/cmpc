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
    <div className="bg-white relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-sm text-gray-500">Cargando...</div>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={handleSort('titulo')}>
              Título {sortBy === 'titulo' && <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={handleSort('autor')}>
              Autor {sortBy === 'autor' && <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={handleSort('editorial')}>
              Editorial {sortBy === 'editorial' && <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={handleSort('precio')}>
              Precio {sortBy === 'precio' && <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={handleSort('genero')}>
              Género {sortBy === 'genero' && <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{book.titulo}</div>
                <div className="text-sm text-gray-500">{book.disponibilidad ? 'Disponible' : 'Agotado'}</div>
              </td>
              <td className="px-6 py-4 text-gray-900">{book.autor}</td>
              <td className="px-6 py-4 text-gray-600">{book.editorial}</td>
              <td className="px-6 py-4 font-medium text-gray-900">${book.precio.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {book.genero}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleEdit(book.id)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDelete(book.id)}
                    className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksList;
