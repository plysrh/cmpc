import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './book.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: Partial<Book> = {
    id: 'uuid-123',
    titulo: 'Test Book',
    autor: 'Test Author',
    editorial: 'Test Editorial',
    precio: 10000,
    disponibilidad: true,
    genero: 'Ficción',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockBook as Book);

      const result = await controller.create({
        titulo: 'Test Book',
        autor: 'Test Author',
        editorial: 'Test Editorial',
        precio: 10000,
        genero: 'Ficción',
      });

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({
        data: [mockBook as Book],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const result = await controller.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook as Book);

      const result = await controller.findOne('uuid-123');

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updatedBook = { ...mockBook, precio: 15000 };
      jest.spyOn(service, 'update').mockResolvedValue(updatedBook as Book);

      const result = await controller.update('uuid-123', { precio: 15000 });

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith('uuid-123', {
        precio: 15000,
      });
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('uuid-123');

      expect(service.remove).toHaveBeenCalledWith('uuid-123');
    });
  });
});
