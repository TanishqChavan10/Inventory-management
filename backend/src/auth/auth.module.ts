import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { User } from './entities/user.entity';
import { ClerkService } from './clerk.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [AuthResolver, ClerkService, ClerkAuthGuard],
  exports: [ClerkService, ClerkAuthGuard],
})
export class AuthModule {}
