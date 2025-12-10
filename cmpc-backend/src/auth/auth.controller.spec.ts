import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const mockToken = { access_token: 'test-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await controller.login({
        email: 'test@cmpc.com',
        password: 'test123',
      });

      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(
        'test@cmpc.com',
        'test123',
      );
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.login({ email: 'wrong@cmpc.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockUser = { id: 'uuid-123', email: 'test@cmpc.com' };
      const result = controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
