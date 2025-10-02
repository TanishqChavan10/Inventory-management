import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from '../category/category.model';

@ObjectType()
export class Product {
  @Field(() => Int)
  product_id: number;

  @Field()
  product_name: string;

  @Field(() => Float)
  default_price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  min_stock: number;

  // A product can belong to many categories
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
