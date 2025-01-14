import { BadRequestException, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './product.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() query: Record<string, any>) {
    const { page = 1, ...filters } = query;

    const processedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      const numValue = Number(value);
      acc[key] = isNaN(numValue) ? value : numValue;
      return acc;
    }, {} as Record<string, any>);

    return this.productsService.getProducts({ page: Number(page), ...processedFilters });
  }

  @Patch('delete/:sku')
  async deleteProduct(@Param('sku') sku: string) {
    const result = await this.productsService.deleteProductBySku(sku);
    if (!result) {
      throw new BadRequestException('Product not found or already deleted');
    }
    return { message: 'Product deleted' };
  }

}
