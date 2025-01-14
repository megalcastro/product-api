import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './product.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllProducts(
    @Query('page') page = 1,
    @Query('category') category?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
  ) {
    return this.productsService.getProducts({ page, category, priceMin, priceMax });
  }
}
