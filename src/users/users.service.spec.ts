import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({
        email: 'test@test.com',
      });

      try {
        await service.register('testuser', 'test@test.com', 'password');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Email user test@test.com already exist ',
        );
      }
    });

    it('should create and save user if email does not exist', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedpassword',
      };
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.register(
        'testuser',
        'test@test.com',
        'password',
      );
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      try {
        await service.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User with ID 1 not found');
      }
    });

    it('should return user if found', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.delete.mockResolvedValueOnce({ affected: 0 });

      try {
        await service.deleteUser(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User with ID 1 not found');
      }
    });

    it('should delete user if found', async () => {
      mockUserRepository.delete.mockResolvedValueOnce({ affected: 1 });

      const result = await service.deleteUser(1);
      expect(result).toEqual({
        message: 'User with ID 1 deleted successfully',
      });
    });
  });

  describe('findByUserEmail', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      try {
        await service.findByUserEmail('test@test.com');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          'User with username "test@test.com" not found',
        );
      }
    });

    it('should return user if found', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findByUserEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });
});
