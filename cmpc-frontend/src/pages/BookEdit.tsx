import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getBook, updateBook } from '../services/books.service';
import type { Book, FormData } from '../types/book';

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    values: book ? { ...book, precio: book.precio.toString() } : undefined,
  });

  useEffect(() => {
    if (id) {
      getBook(id).then(setBook);
    }
  }, [id]);

  const onSubmit = async (data: FormData) => {
    await updateBook(id!, { ...data, precio: Number(data.precio) });
    navigate('/books');
  };

  if (!book) return <div className="p-4">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Editar Libro</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block mb-1">Título</label>
            <input
              id="titulo"
              {...register('titulo', { required: 'Requerido' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
          </div>
          <div>
            <label htmlFor="autor" className="block mb-1">Autor</label>
            <input
              id="autor"
              {...register('autor', { required: 'Requerido' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.autor && <span className="text-red-500 text-sm">{errors.autor.message}</span>}
          </div>
          <div>
            <label htmlFor="editorial" className="block mb-1">Editorial</label>
            <input
              id="editorial"
              {...register('editorial', { required: 'Requerido' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.editorial && <span className="text-red-500 text-sm">{errors.editorial.message}</span>}
          </div>
          <div>
            <label htmlFor="precio" className="block mb-1">Precio</label>
            <input
              id="precio"
              type="number"
              step="0.01"
              {...register('precio', { required: 'Requerido' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.precio && <span className="text-red-500 text-sm">{errors.precio.message}</span>}
          </div>
          <div>
            <label htmlFor="genero" className="block mb-1">Género</label>
            <input
              id="genero"
              {...register('genero', { required: 'Requerido' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.genero && <span className="text-red-500 text-sm">{errors.genero.message}</span>}
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('disponibilidad')} />
              Disponible
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Guardar
            </button>
            <button type="button" onClick={() => navigate('/books')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
