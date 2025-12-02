import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompanyService } from './user-company.service';
import { UserCompanyResolver } from './user-company.resolver';
import { UserCompany } from './user-company.entity';
import { Role } from '../role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany, Role])],
  providers: [UserCompanyService, UserCompanyResolver],
  exports: [UserCompanyService],
})
export class UserCompanyModule {}
