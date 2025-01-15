import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByUserEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateToken', () => {
    it('should return decoded token if token is valid', async () => {
      const token = 'validToken';
      const decoded = { email: 'user@example.com', sub: '1' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);

      expect(await authService.validateToken(token)).toEqual(decoded);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await expect(authService.validateToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      const email = 'user@example.com';
      const password = 'password123';
  
      
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash(password, 10),
        username: 'testuser',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findByUserEmail').mockResolvedValue(user);
  
      const result = await authService.validateUser(email, password);
  
      expect(result).toEqual({ id: 1, email, username: 'testuser', role: 'user',createdAt: expect.any(Date),
        updatedAt: expect.any(Date) });
    });
  
    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'user@example.com';
      const password = 'wrongPassword';
  
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash('password123', 10),
        username: 'testuser',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      jest.spyOn(usersService, 'findByUserEmail').mockResolvedValue(user);
  
      await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
  
  

  describe('login', () => {
    it('should return a JWT access token', async () => {
      const user = { id: '1', email: 'user@example.com' };
      const payload = { email: user.email, sub: user.id };
      const accessToken = 'jwtAccessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await authService.login(user);

      expect(result).toEqual({ access_token: accessToken });
    });
  });
});
