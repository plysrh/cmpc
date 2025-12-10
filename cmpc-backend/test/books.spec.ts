import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    const usersService = app.get<UsersService>(UsersService);

    await usersService.create('test@cmpc.com', 'test123');

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@cmpc.com', password: 'test123' });
    accessToken = (loginRes.body as { access_token: string }).access_token;
  });

  afterAll(async () => {
    await app.close();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe('/books (POST)', () => {
    it('should create a book with valid token', () => {
      return request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Cien años de soledad',
          autor: 'Gabriel García Márquez',
          editorial: 'Sudamericana',
          precio: 15000,
          genero: 'Ficción',
        })
        .expect(201)
        .expect((res) => {
          const body = res.body as { id: string; titulo: string };
          expect(body).toHaveProperty('id');
          expect(body.titulo).toBe('Cien años de soledad');
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          titulo: 'Test Book',
          autor: 'Test Author',
          editorial: 'Test Editorial',
          precio: 10000,
          genero: 'Ficción',
        })
        .expect(401);
    });
  });

  describe('/books (GET)', () => {
    it('should return all books with valid token', () => {
      return request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray((res.body as { data: unknown }).data)).toBe(
            true,
          );
        });
    });

    it('should filter books by genero', () => {
      return request(app.getHttpServer())
        .get('/books?genero=Ficción')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
        });
    });

    it('should filter books by search', () => {
      return request(app.getHttpServer())
        .get('/books?search=Test')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer()).get('/books').expect(401);
    });
  });

  describe('/books/:id (GET)', () => {
    it('should return a book by id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Test Book',
          autor: 'Test Author',
          editorial: 'Test Editorial',
          precio: 10000,
          genero: 'Ficción',
        });
      const bookId = (createRes.body as { id: string }).id;

      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect((res.body as { id: string }).id).toBe(bookId);
        });
    });

    it('should return 404 for non-existent book', () => {
      return request(app.getHttpServer())
        .get('/books/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/books/:id (PATCH)', () => {
    it('should update a book', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Original Title',
          autor: 'Test Author',
          editorial: 'Test Editorial',
          precio: 10000,
          genero: 'Ficción',
        });
      const bookId = (createRes.body as { id: string }).id;

      return request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ precio: 20000 })
        .expect(200)
        .expect((res) => {
          const book = res.body as { precio: number };
          expect(book.precio).toBe(20000);
        });
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a book', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'To Delete',
          autor: 'Test Author',
          editorial: 'Test Editorial',
          precio: 10000,
          genero: 'Ficción',
        });

      await request(app.getHttpServer())
        .delete(`/books/${(createRes.body as { id: string }).id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      return request(app.getHttpServer())
        .get(`/books/${(createRes.body as { id: string }).id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/books/export/csv (GET)', () => {
    it('should export books to CSV', () => {
      return request(app.getHttpServer())
        .get('/books/export/csv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', /text\/csv/);
    });
  });
});
