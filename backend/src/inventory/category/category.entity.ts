import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Supplier } from '../../supplier/supplier.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  name: string;

  // Multi-tenant: Each category belongs to a user
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, user => user.categories)
  @JoinColumn({ name: 'userId' })
  user: User;

  // A category can have many products
  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  // A category can have many suppliers
  @OneToMany(() => Supplier, (supplier) => supplier.category)
  suppliers: Supplier[];
}
