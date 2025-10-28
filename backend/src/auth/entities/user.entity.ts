import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../inventory/product/product.entity';
import { Category } from '../../inventory/category/category.entity';
import { Supplier } from '../../supplier/supplier.entity';
import { Shipment } from '../../supplier/shipment.entity';
import { Transaction } from '../../transaction/transaction.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  INVENTORY = 'inventory'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CASHIER
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  // Relationships for multi-tenant data isolation
  @OneToMany(() => Product, product => product.user)
  products: Product[];

  @OneToMany(() => Category, category => category.user)
  categories: Category[];

  @OneToMany(() => Supplier, supplier => supplier.user)
  suppliers: Supplier[];

  @OneToMany(() => Shipment, shipment => shipment.user)
  shipments: Shipment[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}