import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('customers')
export class Customer {
  @PrimaryColumn()
  customer_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone_number: string;

  @CreateDateColumn()
  created_date: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Transaction[];
}
