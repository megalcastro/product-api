import { Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Between } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  
  async getDeletedProductsPercentage(): Promise<number> {
    const totalProducts = await this.productRepository.count();
    const deletedProducts = await this.productRepository.count({ where: { deleted: true } });

    if (totalProducts === 0) return 0;
    return (deletedProducts / totalProducts) * 100;
  }

  async getNonDeletedProductsWithPricePercentage(startDate?: Date, endDate?: Date): Promise<number> {
    const totalProducts = await this.productRepository.count({ where: { deleted: false } });

    const dateFilter = startDate && endDate
      ? { createdAt: Between(startDate, endDate) }
      : {};

    const productsWithPrice = await this.productRepository.count({
      where: {
        deleted: false,
        price: Not(IsNull()), 
        ...dateFilter,
      },
    });

    if (totalProducts === 0) return 0;
    return (productsWithPrice / totalProducts) * 100;
  }

  async getProductsByCategoryReport(): Promise<any> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('product.category')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('product.category')
      .getRawMany();

    return categories;
  }
}
