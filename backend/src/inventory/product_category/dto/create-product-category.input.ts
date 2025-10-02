import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class CreateProductCategoryInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  product_id: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  category_id: number;
}