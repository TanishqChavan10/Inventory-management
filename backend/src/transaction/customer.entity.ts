import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('customers')
export class Customer {
  @PrimaryColumn()
  customer_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  address?: string;

 

  @Column({ type: 'int', default: 0 })
  total_purchases: number;

  @Column({ type: 'int', default: 0 })
  loyalty_points: number;

  @CreateDateColumn()
  created_date: Date;

  @OneToMany(() => Transaction, transaction => transaction.customer)
  transactions: Transaction[];
}