import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './product.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllProducts(@Query() query: Record<string, any>) {
    const { page = 1, ...filters } = query;

    const processedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      const numValue = Number(value);
      acc[key] = isNaN(numValue) ? value : numValue;
      return acc;
    }, {} as Record<string, any>);

    return this.productsService.getProducts({ page: Number(page), ...processedFilters });
  }
}
