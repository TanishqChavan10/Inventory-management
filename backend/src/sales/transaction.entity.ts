import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Employee } from 'src/staffs/employee.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @CreateDateColumn()
  transaction_date: Date;

  @Column({ type: 'float' })
  total_amt: number;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 100, nullable: true })
  payment_refno: string;

  @ManyToOne(() => Customer, (customer) => customer.transactions, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Employee, (employee) => employee.transactions)
  @JoinColumn({ name: 'cashier_id' })
  employee: Employee;

  @OneToMany(() => OrderItem, (item) => item.transaction, { cascade: true })
  orderItems: OrderItem[];
}