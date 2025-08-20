// src/products/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  sku: string; // Stock Keeping Unit, like 'OIL001'

  @Column()
  name: string; // Product name, like 'Sunflower Oil'

  @Column()
  category: string;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}