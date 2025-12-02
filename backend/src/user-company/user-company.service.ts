import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from './user-company.entity';
import { Role } from '../role/role.entity';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async listUsersInCompany(companyId: number): Promise<UserCompany[]> {
    return this.userCompanyRepository.find({
      where: { company_id: companyId, status: 'active' },
      relations: ['role'],
      order: { joined_at: 'ASC' },
    });
  }

  async changeRole(input: UpdateRoleInput, requestingUserId: number): Promise<UserCompany> {
    const membership = await this.userCompanyRepository.findOne({
      where: { membership_id: input.membership_id },
      relations: ['role'],
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Verify requesting user has permission (is owner or admin)
    const requestingMembership = await this.userCompanyRepository.findOne({
      where: { user_id: requestingUserId, company_id: membership.company_id },
      relations: ['role'],
    });

    if (!requestingMembership) {
      throw new BadRequestException('Requesting user is not a member of this company');
    }

    // TODO: Check if requesting user has permission to change roles

    // Verify new role exists
    const newRole = await this.roleRepository.findOne({
      where: { role_id: input.role_id },
    });

    if (!newRole) {
      throw new NotFoundException('Role not found');
    }

    membership.role_id = input.role_id;
    return this.userCompanyRepository.save(membership);
  }

  async removeUser(membershipId: number, requestingUserId: number): Promise<void> {
    const membership = await this.userCompanyRepository.findOne({
      where: { membership_id: membershipId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Verify requesting user has permission
    const requestingMembership = await this.userCompanyRepository.findOne({
      where: { user_id: requestingUserId, company_id: membership.company_id },
    });

    if (!requestingMembership) {
      throw new BadRequestException('Requesting user is not a member of this company');
    }

    // TODO: Check if requesting user can remove this user

    // Cannot remove yourself
    if (membership.user_id === requestingUserId) {
      throw new BadRequestException('Cannot remove yourself from the company');
    }

    membership.status = 'inactive';
    await this.userCompanyRepository.save(membership);
  }

  async getMembership(userId: number, companyId: number): Promise<UserCompany | null> {
    return this.userCompanyRepository.findOne({
      where: { user_id: userId, company_id: companyId, status: 'active' },
      relations: ['role', 'company'],
    });
  }
}
