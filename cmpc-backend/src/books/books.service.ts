import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

type WhereType = {
  genero?: string | { [Op.iLike]: string };
  editorial?: string | { [Op.iLike]: string };
  autor?: string | { [Op.iLike]: string };
  disponibilidad?: boolean;
  [Op.or]?: Array<Record<string, { [Op.iLike]: string }>>;
};

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book) private bookModel: typeof Book) { }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create({ ...createBookDto });
  }

  async findAll(queryParams: QueryBooksDto) {
    const offset = ((queryParams.page || 1) - 1) * (queryParams.limit || 0);
    const where: WhereType = {};

    if (queryParams.disponibilidad !== undefined) {
      where.disponibilidad = queryParams.disponibilidad;
    }

    if (queryParams.search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${queryParams.search}%` } },
        { autor: { [Op.iLike]: `%${queryParams.search}%` } },
        { editorial: { [Op.iLike]: `%${queryParams.search}%` } },
        { genero: { [Op.iLike]: `%${queryParams.search}%` } },
      ];
    } else {
      if (queryParams.genero) {
        where.genero = { [Op.iLike]: `%${queryParams.genero}%` };
      }

      if (queryParams.editorial) {
        where.editorial = { [Op.iLike]: `%${queryParams.editorial}%` };
      }

      if (queryParams.autor) {
        where.autor = { [Op.iLike]: `%${queryParams.autor}%` };
      }
    }

    const sortBy = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder || 'DESC';

    const { rows: data, count: total } = await this.bookModel.findAndCountAll({
      where,
      limit: queryParams.limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      data,
      metadata: {
        total,
        page: queryParams.page || 1,
        limit: queryParams.limit || total,
        totalPages: Math.ceil(total / (queryParams.limit || total)),
      },
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);

    if (!book) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    return book.update(updateBookDto);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);

    await book.destroy();
  }

  async exportToCsv(): Promise<string> {
    const books = await this.bookModel.findAll();

    const headers = 'ID,Título,Autor,Editorial,Precio,Disponibilidad,Género\n';
    const rows = books
      .map(
        (book) =>
          `${book.id},"${book.titulo}","${book.autor}","${book.editorial}",${book.precio},${book.disponibilidad},"${book.genero}"`,
      )
      .join('\n');

    return headers + rows;
  }
}
