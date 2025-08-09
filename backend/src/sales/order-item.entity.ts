import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number; // Added a primary key for good practice

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  unit_price: number; // This is the price at the time of sale

  @ManyToOne(() => Transaction, (transaction) => transaction.orderItems)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}