import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          La página que buscas no existe
        </p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
