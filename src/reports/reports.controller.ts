import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  async getDeletedProductsPercentage(): Promise<{ percentage: number }> {
    const percentage = await this.reportsService.getDeletedProductsPercentage();
    return { percentage };
  }

  @Get('non-deleted-with-price-percentage')
  async getNonDeletedProductsWithPricePercentage(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ percentage: number }> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const percentage =
      await this.reportsService.getNonDeletedProductsWithPricePercentage(
        start,
        end,
      );
    return { percentage };
  }

  @Get('category-report')
  async getCategoryReport(): Promise<any> {
    const report = await this.reportsService.getProductsByCategoryReport();
    return report;
  }
}
