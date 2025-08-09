import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from 'src/sales/transaction.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({ length: 255 })
  name: string;

  // Other fields like password hash, role, etc. would go here
  // For simplicity, we'll stick to the ERD.

  @OneToMany(() => Transaction, (transaction) => transaction.employee)
  transactions: Transaction[];
}