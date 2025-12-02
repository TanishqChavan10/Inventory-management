import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('company_settings')
export class CompanySettings {
  @PrimaryColumn()
  company_id: number;

  @Column({ length: 50, nullable: true })
  theme: string;

  @Column({ length: 100, nullable: true })
  timezone: string;

  @Column({ length: 10, nullable: true })
  currency: string;

  @Column({ length: 10, nullable: true })
  language: string;

  @Column({ type: 'boolean', default: true })
  notifications_enabled: boolean;

  @Column({ type: 'boolean', default: false })
  auto_backup: boolean;

  @Column({ type: 'int', nullable: true })
  max_users: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  storage_limit_gb: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}