import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanySettings } from './company-settings.entity';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanySettingsInput } from './dto/update-company-settings.input';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanySettings)
    private settingsRepository: Repository<CompanySettings>,
  ) {}

  async createCompany(input: CreateCompanyInput, ownerId: number): Promise<Company> {
    // Check if company name already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { name: input.name },
    });

    if (existingCompany) {
      throw new BadRequestException('Company name already exists');
    }

    // Create company
    const company = this.companyRepository.create({
      ...input,
      owner_id: ownerId,
    });

    const savedCompany = await this.companyRepository.save(company);

    // Create default settings
    const settings = this.settingsRepository.create({
      company_id: savedCompany.company_id,
      theme: 'light',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      notifications_enabled: true,
      auto_backup: false,
      max_users: 10,
      storage_limit_gb: 5,
    });

    await this.settingsRepository.save(settings);

    return savedCompany;
  }

  async updateSettings(companyId: number, input: UpdateCompanySettingsInput): Promise<CompanySettings> {
    const settings = await this.settingsRepository.findOne({
      where: { company_id: companyId },
    });

    if (!settings) {
      throw new NotFoundException('Company settings not found');
    }

    Object.assign(settings, input);
    settings.updated_at = new Date();

    return this.settingsRepository.save(settings);
  }

  async getCompanyById(companyId: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { company_id: companyId },
      relations: ['settings'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async getCompaniesByUser(userId: number): Promise<Company[]> {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .innerJoin('user_companies', 'uc', 'uc.company_id = company.company_id')
      .where('uc.user_id = :userId', { userId })
      .andWhere('uc.status = :status', { status: 'active' })
      .leftJoinAndSelect('company.settings', 'settings')
      .getMany();

    return companies;
  }

  async switchCompany(userId: number, companyId: number): Promise<Company> {
    // Verify user is member of the company
    const membership = await this.companyRepository
      .createQueryBuilder('company')
      .innerJoin('user_companies', 'uc', 'uc.company_id = company.company_id')
      .where('uc.user_id = :userId', { userId })
      .andWhere('uc.company_id = :companyId', { companyId })
      .andWhere('uc.status = :status', { status: 'active' })
      .getOne();

    if (!membership) {
      throw new BadRequestException('User is not a member of this company');
    }

    return this.getCompanyById(companyId);
  }
}
