import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { Category } from '../inventory/category/category.entity';
import { User } from '../auth/entities/user.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  supplier_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_no: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  contact_person?: string;

  @Column({ unique: true, nullable: true })
  registration_number?: string;

  @Column({ nullable: true })
  tax_id?: string;

  @Column({ default: 'Active' })
  status: 'Active' | 'Inactive';

  @Column()
  category_id: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  // Multi-tenant: Each supplier belongs to a user
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.suppliers)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationships
  @OneToMany(() => Shipment, (shipment) => shipment.supplier)
  shipments: Shipment[];

  @ManyToOne(() => Category, (category) => category.suppliers)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
