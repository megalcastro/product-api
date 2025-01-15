import { Injectable } from '@nestjs/common';
import {
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
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
    const deletedProducts = await this.productRepository.count({
      where: { deleted: true },
    });

    if (totalProducts === 0) return 0;
    return (deletedProducts / totalProducts) * 100;
  }

  async getNonDeletedProductsWithPricePercentage(
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const baseFilter = { deleted: false };

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter['createdAt'] = Between(startDate, endDate);
    } else {
      if (startDate) {
        dateFilter['createdAt'] = MoreThanOrEqual(startDate);
      }
      if (endDate) {
        dateFilter['createdAt'] = LessThanOrEqual(endDate);
      }
    }

    const totalProducts = await this.productRepository.count({
      where: baseFilter,
    });

    const productsWithPrice = await this.productRepository.count({
      where: {
        ...baseFilter,
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
