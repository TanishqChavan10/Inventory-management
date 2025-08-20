// src/products/dto/create-product.input.ts

import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;
}