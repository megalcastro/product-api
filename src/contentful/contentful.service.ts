import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Product } from '../database/entities/product.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentfulService {
  private readonly logger = new Logger(ContentfulService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {}

  private async fetchContentfulProducts(): Promise<any[]> {
    const CONTENTFUL_SPACE_ID = this.configService.get<string>(
      'CONTENTFUL_SPACE_ID',
    );
    const CONTENTFUL_ENVIRONMENT = this.configService.get<string>(
      'CONTENTFUL_ENVIRONMENT',
    );
    const CONTENTFUL_ACCESS_TOKEN = this.configService.get<string>(
      'CONTENTFUL_ACCESS_TOKEN',
    );

    const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=product`;

    try {
      this.logger.log('Fetching products from Contentful...');
      const response = await axios.get(url);

      if (!response.data.items || !Array.isArray(response.data.items)) {
        this.logger.warn('No valid items found in Contentful response.');
        return [];
      }

      return response.data.items;
    } catch (error) {
      this.logger.error(
        'Error fetching products from Contentful:',
        error.message,
      );
      throw error;
    }
  }

  private mapContentfulData(items: any[]): Partial<Product>[] {
    return items
      .filter((item) => item.fields && item.fields.sku)
      .map((item) => ({
        sku: item.fields.sku,
        name: item.fields.name,
        brand: item.fields.brand || null,
        model: item.fields.model || null,
        category: item.fields.category || null,
        color: item.fields.color || null,
        price: item.fields.price || null,
        currency: item.fields.currency || null,
        stock: item.fields.stock || 0,
      }));
  }

  private async syncProducts(products: Partial<Product>[]): Promise<void> {
    const existingProducts = await this.productRepository.find({
      where: products.map((p) => ({ sku: p.sku })),
      select: ['sku'],
    });

    const existingSkus = new Set(existingProducts.map((p) => p.sku));
    const newProducts = products.filter((p) => !existingSkus.has(p.sku));

    if (newProducts.length > 0) {
      await this.productRepository.save(newProducts);
      this.logger.log(`${newProducts.length} new products synced.`);
    } else {
      this.logger.log('No new products to sync.');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async fetchAndSyncProducts(): Promise<void> {
    try {
      const items = await this.fetchContentfulProducts();
      const products = this.mapContentfulData(items);
      await this.syncProducts(products);
    } catch (error) {
      this.logger.error('Failed to fetch or sync products:', error.message);
    }
  }
}
