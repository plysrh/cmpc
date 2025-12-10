import type { BooksResponse, Book } from '../types/book';

const API_URL = 'http://localhost:3000/v1';

export async function getBooks(params: URLSearchParams): Promise<BooksResponse> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error();
  return res.json();
}

export async function getBook(id: string): Promise<Book> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error();
  return res.json();
}

export async function createBook(data: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error();
  return res.json();
}

export async function updateBook(id: string, data: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error();
  return res.json();
}

export async function deleteBook(id: string): Promise<void> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error();
}

export async function exportCsv(): Promise<Blob> {
  const token = (await cookieStore.get('token'))?.value;
  const res = await fetch(`${API_URL}/books/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.blob();
}
