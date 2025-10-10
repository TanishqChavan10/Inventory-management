import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field(() => ID)
  @IsString()
  customer_id: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  loyalty_points?: number;




}

@InputType()
export class CreateEmployeeInput {
  @Field(() => ID)
  @IsString()
  employee_id: string;

  @Field()
  @IsString()
  name: string;
}

@InputType()
export class CreateTransactionItemInput {
  @Field(() => Int)
  product_id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unit_price: number;

  @Field(() => Float, { defaultValue: 0 })
  discount?: number;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => ID)
  @IsString()
  transaction_id: string;

  @Field()
  payment_method: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @Field()
  @IsString()
  employee_id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  payment_refno?: string;

  @Field(() => [CreateTransactionItemInput])
  items: CreateTransactionItemInput[];
}