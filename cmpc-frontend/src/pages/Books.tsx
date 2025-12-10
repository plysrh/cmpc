import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { BooksResponse } from '../types/book';
import { getBooks, deleteBook, exportCsv } from '../services/books.service';
import { logout } from '../services/auth.service';
import BooksList from '../components/BooksList';
import BooksFilters from '../components/BooksFilters';
import Pagination from '../components/Pagination';
import BooksHeader from '../components/BooksHeader';

function Books() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  const [page, setPage] = useState(Number(urlParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState(urlParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>((urlParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC');
  const [searchInput, setSearchInput] = useState(urlParams.get('search') || urlParams.get('genero') || urlParams.get('editorial') || urlParams.get('autor') || '');
  const [searchQuery, setSearchQuery] = useState(urlParams.get('search') || urlParams.get('genero') || urlParams.get('editorial') || urlParams.get('autor') || '');
  const [searchField, setSearchField] = useState(() => {
    if (urlParams.get('search')) {
      return 'search';
    }

    if (urlParams.get('genero')) {
      return 'genero';
    }

    if (urlParams.get('editorial')) {
      return 'editorial';
    }

    if (urlParams.get('autor')) {
      return 'autor';
    }

    return 'search';
  });
  const [availability, setAvailability] = useState(urlParams.get('disponibilidad') || '');
  const [data, setData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleNew = useCallback(() => {
    navigate('/books/new');
  }, [navigate]);
  const handleExportCsv = useCallback(async () => {
    const blob = await exportCsv();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'libros.csv';
    a.click();
  }, []);
  const handleSearchField = useCallback((value: string) => {
    setSearchField(value);
    setSearchInput('');
  }, []);
  const handleAvailability = useCallback((value: string) => {
    setAvailability(value);
    setPage(1);
  }, [])
  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';

    setSortBy(field);
    setSortOrder(newOrder);
    setPage(1);
  };
  const handleDelete = useCallback(async (id: string) => {
    await deleteBook(id);
    setData(prev => prev ? { ...prev, data: prev.data.filter(b => b.id !== id) } : null);
  }, []);
  const handleLogout = useCallback(async () => {
    await logout();

    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(false);

      try {
        const apiParams = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          sortBy,
          sortOrder,
        });

        if (searchQuery) {
          if (searchField === 'search' || searchField === 'titulo') {
            apiParams.append('search', searchQuery);
          } else {
            apiParams.append(searchField, searchQuery);
          }
        }

        if (availability) {
          apiParams.append('disponibilidad', availability);
        }

        const json = await getBooks(apiParams);

        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();

    const params = new URLSearchParams();

    if (page > 1) {
      params.set('page', page.toString());
    }

    if (sortBy !== 'createdAt') {
      params.set('sortBy', sortBy);
    }

    if (sortOrder !== 'DESC') {
      params.set('sortOrder', sortOrder);
    }

    if (searchQuery) {
      const field = searchField === 'titulo' ? 'search' : searchField;

      params.set(field, searchQuery);
    }
    if (availability) {
      params.set('disponibilidad', availability);
    }

    const newSearch = params.toString();
    const newUrl = `/books${newSearch ? `?${newSearch}` : ''}`;

    if (location.pathname + location.search !== newUrl) {
      navigate(newUrl, { replace: true });
    }
  }, [page, sortBy, sortOrder, searchQuery, searchField, availability, location, navigate]);

  if (error) {
    return <div className="p-4">Error al cargar libros</div>;
  }

  if (!data) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <BooksHeader
        onNewBook={handleNew}
        onExport={handleExportCsv}
        onLogout={handleLogout}
      />
      <BooksFilters
        searchField={searchField}
        searchInput={searchInput}
        availability={availability}
        onSearchFieldChange={handleSearchField}
        onSearchInputChange={setSearchInput}
        onAvailabilityChange={handleAvailability}
      />
      <div className="px-6">
        <BooksList
          books={data.data}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onDelete={handleDelete}
        />
        <div className="py-6">
          <Pagination
            currentPage={page}
            totalPages={data.metadata.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Books;
