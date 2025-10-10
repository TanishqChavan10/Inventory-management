import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
import { TransactionItem } from './transaction-item.entity';

export enum PaymentMethod {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  MOBILE_PAYMENT = 'Mobile Payment'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  transaction_id: string;

  @CreateDateColumn()
  transaction_date: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  payment_method: PaymentMethod;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @Column({ nullable: true })
  customer_id: string;

  @Column()
  employee_id: string;

  @Column({ nullable: true })
  payment_refno: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Customer, customer => customer.transactions, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Employee, employee => employee.transactions)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => TransactionItem, item => item.transaction, { cascade: true })
  items: TransactionItem[];
}