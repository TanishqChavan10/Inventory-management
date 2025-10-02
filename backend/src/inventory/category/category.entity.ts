import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { Supplier } from '../../supplier/supplier.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  name: string;

  // A category can have many products
  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  // A category can have many suppliers
  @OneToMany(() => Supplier, (supplier) => supplier.category)
  suppliers: Supplier[];
}
