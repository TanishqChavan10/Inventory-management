import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  employee_id: string;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.employee)
  transactions: Transaction[];
}
