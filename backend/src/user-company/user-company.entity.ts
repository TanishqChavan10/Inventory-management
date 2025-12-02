import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { Role } from '../role/role.entity';

@Entity('user_companies')
export class UserCompany {
  @PrimaryGeneratedColumn()
  membership_id: number;

  @Column()
  user_id: number;

  @Column()
  company_id: number;

  @Column({ nullable: true })
  role_id: number;

  @CreateDateColumn()
  joined_at: Date;

  @Column({ nullable: true })
  invited_by: number;

  @Column({ length: 20, default: 'active' })
  status: string; // active, pending, inactive

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}