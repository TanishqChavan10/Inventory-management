import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductCategory {
  @Field(() => Int)
  product_id: number;

  @Field(() => Int)
  category_id: number;
}
