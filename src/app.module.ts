import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentfulModule } from './contentful/contentful.module';
import { ReportsModule } from './reports/reports.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [AuthModule, ContentfulModule, ReportsModule, DatabaseModule, ProductModule, UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
