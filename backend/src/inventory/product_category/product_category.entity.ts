import { Entity, PrimaryColumn } from 'typeorm';

@Entity('product_category')
export class ProductCategory {
  @PrimaryColumn()
  product_id: number;

  @PrimaryColumn()
  category_id: number;
}
