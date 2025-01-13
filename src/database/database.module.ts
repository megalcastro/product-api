import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '', // Cambia esto
      password: '', // Cambia esto
      database: 'tasks_db', // Cambia esto
      entities: [Product,User],
      synchronize: true, // Usar solo en desarrollo, en producción usa migraciones
    }),
  ],
})
export class DatabaseModule {}
