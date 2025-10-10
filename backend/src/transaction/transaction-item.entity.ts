import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../inventory/product/product.entity';

@Entity('transaction_items')
export class TransactionItem {
  @PrimaryColumn()
  transaction_id: string;

  @PrimaryColumn()
  product_id: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;

  @ManyToOne(() => Transaction, transaction => transaction.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}