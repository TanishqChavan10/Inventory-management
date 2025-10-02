import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsOptional, IsString, IsNumber, IsPositive, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int)
  product_id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  product_name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  default_price?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_stock?: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  categoryIds?: number[];
}