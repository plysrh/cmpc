import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import * as authService from '../services/auth.service';

jest.mock('../services/auth.service');

declare const global: typeof globalThis;
const mockCookieStore = {
  set: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
};
global.cookieStore = mockCookieStore as unknown as CookieStore;

describe('Login', () => {
  let locationHref = '';

  beforeEach(() => {
    jest.clearAllMocks();
    locationHref = '';
    delete (window as { location?: unknown }).location;
    (window as { location: { href: string } }).location = {
      get href() { return locationHref; },
      set href(value: string) { locationHref = value; },
    } as Location;
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('CMPC Libros')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should call login and set cookie', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ access_token: 'test-token' });
    mockCookieStore.set.mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@cmpc.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@cmpc.com', 'test123');
      expect(mockCookieStore.set).toHaveBeenCalledWith('token', 'test-token');
    });
  });

  it('should show error on failed login', async () => {
    (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@cmpc.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });
});
