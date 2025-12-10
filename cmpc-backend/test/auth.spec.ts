import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();

    const usersService = app.get(UsersService);

    await usersService.create('test@cmpc.com', 'test123');
  });

  afterAll(async () => {
    await app.close();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@cmpc.com', password: 'test123' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@cmpc.com', password: 'test123' })
        .expect(401);
    });

    it('should reject invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@cmpc.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return profile with valid token', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@cmpc.com', password: 'test123' });

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set(
          'Authorization',
          `Bearer ${(loginRes.body as { access_token: string }).access_token}`,
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', 'test@cmpc.com');
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should reject request with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
