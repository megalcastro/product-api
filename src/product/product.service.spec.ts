
import { ProductsService } from './product.service';
import { Product } from '../database/entities/product.entity';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: any;

  beforeEach(() => {
    productRepository = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    productService = new ProductsService(productRepository);
  });

  describe('getProducts', () => {
    it('should return paginated products with filters', async () => {
      const filters = { page: 1, priceMin: 100, priceMax: 500, name: 'product' };

      const products: Product[] = [
        { sku: 'sku1', name: 'Product 1', price: 100, stock: 10, deleted: false } as Product,
        { sku: 'sku2', name: 'Product 2', price: 300, stock: 5, deleted: false } as Product,
      ];

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([products, 2]),
      };

      productRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);

      const result = await productService.getProducts(filters);

      expect(result.data).toEqual(products);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('should return an empty array if no products match the filters', async () => {
      const filters = { page: 1, priceMin: 100, priceMax: 500 };

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      productRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);

      const result = await productService.getProducts(filters);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
    });
  });

  describe('deleteProductBySku', () => {
    it('should return true if product is successfully deleted', async () => {
      const product = { sku: 'sku1', deleted: false };
      productRepository.findOne.mockResolvedValue(product);
      productRepository.save.mockResolvedValue(undefined);

      const result = await productService.deleteProductBySku('sku1');

      expect(result).toBe(true);
      expect(productRepository.save).toHaveBeenCalledWith({ ...product, deleted: true });
    });

    it('should return false if product does not exist', async () => {
      productRepository.findOne.mockResolvedValue(null);

      const result = await productService.deleteProductBySku('sku1');

      expect(result).toBe(false);
      expect(productRepository.save).not.toHaveBeenCalled();
    });

    it('should return false if product is already deleted', async () => {
      const product = { sku: 'sku1', deleted: true };
      productRepository.findOne.mockResolvedValue(product);

      const result = await productService.deleteProductBySku('sku1');

      expect(result).toBe(false);
      expect(productRepository.save).not.toHaveBeenCalled();
    });
  });
});
