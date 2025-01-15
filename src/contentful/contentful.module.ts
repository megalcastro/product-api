import { Module } from '@nestjs/common';
import { ContentfulService } from './contentful.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ContentfulService],
})
export class ContentfulModule {}
