import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Books from './Books';
import * as booksService from '../services/books.service';

jest.mock('../services/books.service');

describe('Books', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    (booksService.getBooks as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Books />
      </BrowserRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render books list', async () => {
    (booksService.getBooks as jest.Mock).mockResolvedValue({
      data: [
        {
          id: '1',
          titulo: 'Test Book',
          autor: 'Test Author',
          editorial: 'Test Editorial',
          precio: 10000,
          genero: 'Ficción',
          disponibilidad: true,
        },
      ],
      metadata: { total: 1, page: 1, limit: 20, totalPages: 1 },
    });

    render(
      <BrowserRouter>
        <Books />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  it('should show error state', async () => {
    (booksService.getBooks as jest.Mock).mockRejectedValue(new Error('Error'));

    render(
      <BrowserRouter>
        <Books />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar libros')).toBeInTheDocument();
    });
  });

  it('should have new book button', async () => {
    (booksService.getBooks as jest.Mock).mockResolvedValue({
      data: [],
      metadata: { total: 0, page: 1, limit: 20, totalPages: 1 },
    });

    render(
      <BrowserRouter>
        <Books />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nuevo libro/i })).toBeInTheDocument();
    });
  });
});
