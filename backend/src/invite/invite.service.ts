import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { UserCompany } from '../user-company/user-company.entity';
import { Role } from '../role/role.entity';
import { SendInviteInput } from './dto/send-invite.input';
import { AcceptInviteInput } from './dto/accept-invite.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createInvite(input: SendInviteInput, companyId: number, invitedBy: number): Promise<Invite> {
    // Check if user is already a member
    const existingMembership = await this.userCompanyRepository.findOne({
      where: { company_id: companyId, user_id: invitedBy }, // Note: need user_id from email, but since no user table, assume we get user_id later
    });

    // For now, assume we check by email, but since no user table, skip this check

    // Check if invite already exists
    const existingInvite = await this.inviteRepository.findOne({
      where: { email: input.email, company_id: companyId, status: 'pending' },
    });

    if (existingInvite) {
      throw new ConflictException('Invite already sent to this email');
    }

    // Verify role exists
    const role = await this.roleRepository.findOne({
      where: { role_id: input.role_id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Create invite
    const invite = this.inviteRepository.create({
      email: input.email,
      company_id: companyId,
      role_id: input.role_id,
      invited_by: invitedBy,
      token: uuidv4(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.inviteRepository.save(invite);
  }

  async validateInviteToken(token: string): Promise<Invite> {
    const invite = await this.inviteRepository.findOne({
      where: { token, status: 'pending' },
      relations: ['company', 'role'],
    });

    if (!invite) {
      throw new NotFoundException('Invalid or expired invite');
    }

    if (invite.expires_at < new Date()) {
      invite.status = 'expired';
      await this.inviteRepository.save(invite);
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  async acceptInvite(input: AcceptInviteInput, userId: number): Promise<UserCompany> {
    const invite = await this.validateInviteToken(input.token);

    // Check if user is already a member
    const existingMembership = await this.userCompanyRepository.findOne({
      where: { user_id: userId, company_id: invite.company_id },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this company');
    }

    // Create membership
    const membership = this.userCompanyRepository.create({
      user_id: userId,
      company_id: invite.company_id,
      role_id: invite.role_id,
      invited_by: invite.invited_by,
      status: 'active',
    });

    const savedMembership = await this.userCompanyRepository.save(membership);

    // Update invite
    invite.status = 'accepted';
    invite.accepted_at = new Date();
    await this.inviteRepository.save(invite);

    return savedMembership;
  }

  async cancelInvite(inviteId: number, userId: number): Promise<void> {
    const invite = await this.inviteRepository.findOne({
      where: { invite_id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Check if user can cancel (owner or invited_by)
    if (invite.invited_by !== userId) {
      // TODO: Check if user is company owner
      throw new BadRequestException('Not authorized to cancel this invite');
    }

    invite.status = 'cancelled';
    await this.inviteRepository.save(invite);
  }
}
