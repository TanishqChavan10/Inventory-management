import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from '../product/product.model';

@ObjectType()
export class Category {
  @Field(() => Int)
  category_id: number;

  @Field()
  name: string;

  // A category can have many products
  @Field(() => [Product], { nullable: true })
  products?: Product[];

  // Note: suppliers relationship is not exposed in GraphQL model to avoid circular dependencies
  // but exists in the entity for database relationships
}
