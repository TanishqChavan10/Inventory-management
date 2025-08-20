// src/products/models/product.model.ts

import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field(() => ID)
  id: string;

  @Field()
  sku: string;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}