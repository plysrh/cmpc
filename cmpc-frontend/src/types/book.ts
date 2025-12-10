export interface Book {
  id: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
  disponibilidad: boolean;
  genero: string;
  createdAt: string;
}

export interface BooksResponse {
  data: Book[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FormData = {
  titulo: string;
  autor: string;
  editorial: string;
  precio: string;
  genero: string;
  disponibilidad: boolean;
};
