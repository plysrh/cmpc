import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: {
    create: jest.Mock;
    findAll: jest.Mock;
    findAndCountAll: jest.Mock;
    findByPk: jest.Mock;
  };

  const mockBook = {
    id: 'uuid-123',
    titulo: 'Test Book',
    autor: 'Test Author',
    editorial: 'Test Editorial',
    precio: 10000,
    disponibilidad: true,
    genero: 'Ficción',
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockBookModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      mockBookModel.create.mockResolvedValue(mockBook);

      const result = await service.create({
        titulo: 'Test Book',
        autor: 'Test Author',
        editorial: 'Test Editorial',
        precio: 10000,
        genero: 'Ficción',
      });

      expect(result).toEqual(mockBook);
      expect(mockBookModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: [mockBook],
        count: 1,
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([mockBook]);
      expect(result.metadata.total).toBe(1);
      expect(mockBookModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should filter by genero', async () => {
      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: [mockBook],
        count: 1,
      });

      await service.findAll({ page: 1, limit: 10, genero: 'Ficción' });

      expect(mockBookModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ genero: expect.anything() }),
        }),
      );
    });

    it('should filter by search', async () => {
      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: [mockBook],
        count: 1,
      });

      await service.findAll({ page: 1, limit: 10, search: 'Test' });

      expect(mockBookModel.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.findOne('uuid-123');

      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByPk).toHaveBeenCalledWith('uuid-123');
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('uuid-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updatedBook = { ...mockBook, precio: 15000 };

      mockBookModel.findByPk.mockResolvedValue(mockBook);
      mockBook.update.mockResolvedValue(updatedBook);

      const result = await service.update('uuid-123', { precio: 15000 });

      expect(mockBook.update).toHaveBeenCalledWith({ precio: 15000 });
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBookModel.findByPk.mockResolvedValue(mockBook);
      mockBook.destroy.mockResolvedValue(undefined);
      await service.remove('uuid-123');

      expect(mockBook.destroy).toHaveBeenCalled();
    });
  });

  describe('exportToCsv', () => {
    it('should export books to CSV format', async () => {
      mockBookModel.findAll.mockResolvedValue([mockBook]);

      const result = await service.exportToCsv();

      expect(result).toContain('ID,Título,Autor,Editorial,Precio,Disponibilidad,Género');
      expect(result).toContain('Test Book');
      expect(mockBookModel.findAll).toHaveBeenCalled();
    });
  });
});
