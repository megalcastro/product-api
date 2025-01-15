import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
  
    const result = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword', 
      role: 'user',               
      createdAt: new Date(),      
      updatedAt: new Date(),      
    };
  
    
    jest.spyOn(service, 'register').mockResolvedValue(result);
  
    expect(await controller.createUser(createUserDto)).toEqual(result);
  });
  

  it('should return all users', async () => {
    const users = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
        password: 'hashedPassword',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  
    jest.spyOn(service, 'findAll').mockResolvedValue(users);
  
    const result = await controller.findAll();
    expect(result).toEqual(users);
  });
  

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword', 
        role: 'user',               
        createdAt: new Date(),      
        updatedAt: new Date(),      
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('User with ID 999 not found'));

      try {
        await controller.findOne(999);
      } catch (e) {
        expect(e.response.message).toBe('User with ID 999 not found');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const result = { message: 'User with ID 1 deleted successfully' };

      jest.spyOn(service, 'deleteUser').mockResolvedValue(result);

      expect(await controller.deleteUser(1)).toEqual(result);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(service, 'deleteUser').mockRejectedValue(new NotFoundException('User with ID 999 not found'));

      try {
        await controller.deleteUser(999);
      } catch (e) {
        expect(e.response.message).toBe('User with ID 999 not found');
      }
    });
  });
});
