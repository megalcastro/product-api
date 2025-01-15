import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');

describe('ContentfulService', () => {
  let contentfulService: ContentfulService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'CONTENTFUL_SPACE_ID') return 'spaceId';
              if (key === 'CONTENTFUL_ENVIRONMENT') return 'environment';
              if (key === 'CONTENTFUL_ACCESS_TOKEN') return 'accessToken';
            }),
          },
        },
      ],
    }).compile();

    contentfulService = module.get<ContentfulService>(ContentfulService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(contentfulService).toBeDefined();
  });

  it('should sync new products', async () => {
    const products = [
      {
        sku: 'sku1',
        name: 'Product 1',
        price: 100,
        stock: 10,
        brand: 'Brand 1',
        model: 'Model 1',
        category: 'Category 1',
        color: 'Red',
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 1,
      },
    ];

    jest.spyOn(productRepository, 'find').mockResolvedValue([
      {
        sku: 'sku1',
        id: 1,
        name: 'Product 1',
        price: 100,
        stock: 10,
        brand: 'Brand 1',
        model: 'Model 1',
        category: 'Category 1',
        color: 'Red',
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product,
    ]);

    const saveSpy = jest
      .spyOn(productRepository, 'save')
      .mockResolvedValue(undefined);

    await contentfulService['syncProducts'](products);

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should save new products', async () => {
    const products = [
      { sku: 'sku2', name: 'Product 2', price: 100, stock: 20 },
    ];

    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    const saveSpy = jest
      .spyOn(productRepository, 'save')
      .mockResolvedValue(undefined);

    await contentfulService['syncProducts'](products);

    expect(saveSpy).toHaveBeenCalledWith(products);
  });

  it('should handle errors when fetching products', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'));

    await expect(
      contentfulService['fetchContentfulProducts'](),
    ).rejects.toThrow('Network error');
  });

  it('should map Contentful data to Product model', () => {
    const contentfulItems = [
      {
        fields: {
          sku: 'sku1',
          name: 'Product 1',
          price: 100,
          stock: 10,
        },
      },
    ];

    const mappedProducts =
      contentfulService['mapContentfulData'](contentfulItems);

    expect(mappedProducts).toHaveLength(1);
    expect(mappedProducts[0]).toEqual({
      sku: 'sku1',
      name: 'Product 1',
      brand: null,
      model: null,
      category: null,
      color: null,
      price: 100,
      currency: null,
      stock: 10,
    });
  });
});
