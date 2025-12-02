import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { CompanySettings } from './company-settings.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  company_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  logo_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  owner_id: number;

  @OneToOne(() => CompanySettings, { cascade: true })
  @JoinColumn({ name: 'company_id' })
  settings: CompanySettings;
}