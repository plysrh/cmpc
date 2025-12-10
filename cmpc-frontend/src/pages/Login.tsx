import { useState, type FormEvent } from 'react';
import { login } from '../services/auth.service';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      await cookieStore.set('token', data.access_token);
      window.location.href = '/books';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-2">CMPC</h1>
          <p className="text-sm text-gray-500">Sistema de Libros</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-0 bg-transparent"
              required
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-0 bg-transparent"
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
