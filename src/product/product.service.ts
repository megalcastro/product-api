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
    const { page = 1, ...filterParams } = filters;
    const take = 5;
    const skip = (page - 1) * take;
  
    const query = this.productRepository.createQueryBuilder('product').where('product.deleted = :deleted', {
      deleted: false,
    });
  
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        if (key.endsWith('Min')) {
          const column = key.replace('Min', '');
          query.andWhere(`product.${column} >= :${key}`, { [key]: value });
        } else if (key.endsWith('Max')) {
          const column = key.replace('Max', '');
          query.andWhere(`product.${column} <= :${key}`, { [key]: value });
        } else {
          query.andWhere(`product.${key} = :${key}`, { [key]: value });
        }
      }
    });
  
    const [data, total] = await query.skip(skip).take(take).getManyAndCount();
  
    return { data, total, page };
  }
  
}
