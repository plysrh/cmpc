import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BookCreate from './BookCreate';
import * as booksService from '../services/books.service';

jest.mock('../services/books.service');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('BookCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario', () => {
    render(
      <BrowserRouter>
        <BookCreate />
      </BrowserRouter>
    );
    expect(screen.getByText('Nuevo Libro')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
  });

  it('crea un libro y navega', async () => {
    (booksService.createBook as jest.Mock).mockResolvedValue({});
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BookCreate />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText('Título'), 'Test');
    await user.type(screen.getByLabelText('Autor'), 'Autor');
    await user.type(screen.getByLabelText('Editorial'), 'Editorial');
    await user.type(screen.getByLabelText('Precio'), '100');
    await user.type(screen.getByLabelText('Género'), 'Ficción');
    await user.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(booksService.createBook).toHaveBeenCalledWith({
        titulo: 'Test',
        autor: 'Autor',
        editorial: 'Editorial',
        precio: 100,
        genero: 'Ficción',
        disponibilidad: false,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/books');
    });
  });

  it('cancela y navega', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BookCreate />
      </BrowserRouter>
    );

    await user.click(screen.getByText('Cancelar'));
    expect(mockNavigate).toHaveBeenCalledWith('/books');
  });
});
