import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteService } from './invite.service';
import { InviteResolver } from './invite.resolver';
import { Invite } from './invite.entity';
import { UserCompany } from '../user-company/user-company.entity';
import { Role } from '../role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invite, UserCompany, Role])],
  providers: [InviteService, InviteResolver],
  exports: [InviteService],
})
export class InviteModule {}
