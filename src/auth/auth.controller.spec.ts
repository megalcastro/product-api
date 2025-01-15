import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call validateUser and login on login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', username: 'testuser', role: 'user' };
    const mockToken = { access_token: 'mockToken' };
    const loginDto = { email: 'test@example.com', password: 'testPassword' };

    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

    const result = await authController.login(loginDto);

    expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  });

  it('should throw UnauthorizedException if validateUser fails', async () => {
    const loginDto = { email: 'wrong@example.com', password: 'wrongPassword' };

    jest.spyOn(authService, 'validateUser').mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).not.toHaveBeenCalled();
  });
});
