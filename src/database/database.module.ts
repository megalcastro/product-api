import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_username', // Cambia esto
      password: 'your_password', // Cambia esto
      database: 'your_database', // Cambia esto
      entities: [Product],
      synchronize: true, // Usar solo en desarrollo, en producción usa migraciones
    }),
  ],
})
export class DatabaseModule {}
