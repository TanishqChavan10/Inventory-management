import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../category/category.entity';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column('decimal')
  default_price: number;

  @Column()
  stock: number;

  @Column()
  min_stock: number;

  // A product can belong to many categories
  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_category', // join table name
    joinColumn: { name: 'product_id', referencedColumnName: 'product_id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' },
  })
  categories: Category[];
}
