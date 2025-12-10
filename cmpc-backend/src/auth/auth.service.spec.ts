import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

type MockUser = Pick<User, 'id' | 'email' | 'password'>;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockUser: MockUser = {
    id: 'uuid-123',
    email: 'test@cmpc.com',
    password: '$2b$10$XDyAZ1wwNxizvB1JEwRZr.koGrRZfcUCwoedJ3m5NUe85jJqgo5k2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as User);

      const result = await service.login('test@cmpc.com', 'test123');

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('test-token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid-123',
        email: 'test@cmpc.com',
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.login('wrong@cmpc.com', 'test123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as User);

      await expect(
        service.login('test@cmpc.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user for valid userId', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as User);

      const user = await service.validateUser('uuid-123');

      expect(user).toEqual({ id: 'uuid-123', email: 'test@cmpc.com' });
    });

    it('should return null for invalid userId', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      const user = await service.validateUser('uuid-999');

      expect(user).toBeNull();
    });
  });
});
