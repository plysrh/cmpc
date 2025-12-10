import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BookEdit from './BookEdit';
import * as booksService from '../services/books.service';

jest.mock('../services/books.service');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('BookEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario con datos', async () => {
    (booksService.getBook as jest.Mock).mockResolvedValue({
      id: '1',
      titulo: 'Test',
      autor: 'Autor',
      editorial: 'Editorial',
      precio: 100,
      genero: 'Ficción',
      disponibilidad: true,
    });

    render(
      <BrowserRouter>
        <BookEdit />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });
  });

  it('actualiza un libro y navega', async () => {
    (booksService.getBook as jest.Mock).mockResolvedValue({
      id: '1',
      titulo: 'Test',
      autor: 'Autor',
      editorial: 'Editorial',
      precio: 100,
      genero: 'Ficción',
      disponibilidad: true,
    });
    (booksService.updateBook as jest.Mock).mockResolvedValue({});
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BookEdit />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText('Título'));
    await user.type(screen.getByLabelText('Título'), 'Nuevo');
    await user.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(booksService.updateBook).toHaveBeenCalledWith('1', expect.objectContaining({
        titulo: 'Nuevo',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/books');
    });
  });

  it('cancela y navega', async () => {
    (booksService.getBook as jest.Mock).mockResolvedValue({
      id: '1',
      titulo: 'Test',
      autor: 'Autor',
      editorial: 'Editorial',
      precio: 100,
      genero: 'Ficción',
      disponibilidad: true,
    });
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BookEdit />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancelar'));
    expect(mockNavigate).toHaveBeenCalledWith('/books');
  });
});
