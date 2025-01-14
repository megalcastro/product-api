import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '',
      password: '',
      database: 'tasks_db',
      entities: [
        join(__dirname, '**/entities/*.entity{.ts,.js}'),
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
