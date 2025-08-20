// src/products/dto/update-product.input.ts

import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string; // The ID of the product to update

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sku?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  quantity?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  price?: number;
}