import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { Role } from '../role/role.entity';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn()
  invite_id: number;

  @Column({ length: 255 })
  email: string;

  @Column()
  company_id: number;

  @Column({ nullable: true })
  role_id: number;

  @Column()
  invited_by: number;

  @Column({ length: 20, default: 'pending' })
  status: string; // pending, accepted, rejected, expired

  @Column({ length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  accepted_at: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}