import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          } as Partial<AuthService>,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user for valid payload', async () => {
      const mockUser = { id: 'uuid-123', email: 'test@cmpc.com' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await strategy.validate({
        sub: 'uuid-123',
        email: 'test@cmpc.com',
      });

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('uuid-123');
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      try {
        await strategy.validate({ sub: 'uuid-999', email: 'test@cmpc.com' });

        fail('Should have thrown UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
