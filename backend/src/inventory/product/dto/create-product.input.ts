import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsPositive, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  product_name: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  default_price: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stock: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  min_stock: number;

  @Field(() => [Int], { nullable: true })
  categoryIds?: number[];
}