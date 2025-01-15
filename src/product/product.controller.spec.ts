import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Product } from '../database/entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
            deleteProductBySku: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return paginated products with filters', async () => {
      const filters = { page: 1, name: 'Product' };
      const products: Product[] = [
        {
          sku: 'sku1',
          name: 'Product 1',
          price: 100,
          stock: 10,
          id: 1,
          brand: 'Brand A',
          model: 'Model X',
          category: 'Category 1',
          color: 'Red',
          currency: 'USD',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          sku: 'sku2',
          name: 'Product 2',
          price: 200,
          stock: 20,
          id: 2,
          brand: 'Brand B',
          model: 'Model Y',
          category: 'Category 2',
          color: 'Blue',
          currency: 'USD',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
  
      jest.spyOn(service, 'getProducts').mockResolvedValue({ data: products, total: 2, page: 1 });
  
      const result = await controller.getAllProducts(filters);
      expect(result.data).toEqual(products);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });
  

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const sku = 'sku1';
      jest.spyOn(service, 'deleteProductBySku').mockResolvedValue(true);

      const result = await controller.deleteProduct(sku);
      expect(result).toEqual({ message: 'Product deleted' });
    });

    it('should throw BadRequestException if product is not found', async () => {
      const sku = 'sku-not-found';
      jest.spyOn(service, 'deleteProductBySku').mockResolvedValue(false);

      try {
        await controller.deleteProduct(sku);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Product not found or already deleted');
      }
    });
  });
});
