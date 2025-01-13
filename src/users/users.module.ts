import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra la entidad
  controllers: [UsersController],
  providers: [UsersService], // Registra el servicio
  exports: [UsersService],
})
export class UsersModule {}
