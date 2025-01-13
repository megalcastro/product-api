import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(filters: any) {
    const { page, category, priceMin, priceMax } = filters;
    const take = 5;
    const skip = (page - 1) * take;

    const query = this.productRepository.createQueryBuilder('product').where('product.deleted = :deleted', {
      deleted: false,
    });

    if (category) query.andWhere('product.category = :category', { category });
    if (priceMin) query.andWhere('product.price >= :priceMin', { priceMin });
    if (priceMax) query.andWhere('product.price <= :priceMax', { priceMax });

    const [data, total] = await query.skip(skip).take(take).getManyAndCount();
    return { data, total, page };
  }
}
