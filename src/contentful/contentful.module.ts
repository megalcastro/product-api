import { Module } from '@nestjs/common';
import { ContentfulService } from './contentful.service';

@Module({
  providers: [ContentfulService]
})
export class ContentfulModule {}
