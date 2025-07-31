import { Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersResolver } from './users.resolver';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver],
  exports: [TypeOrmModule], // ✅ This makes the User entity available to other modules
})
export class UsersModule {}
