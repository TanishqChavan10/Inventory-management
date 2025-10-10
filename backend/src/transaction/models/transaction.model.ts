import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CustomerModel {
  @Field(() => ID)
  customer_id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  address?: string;







  @Field(() => Int, { defaultValue: 0 })
  total_purchases: number;

  @Field(() => Int, { defaultValue: 0 })
  loyalty_points: number;

  @Field()
  created_date: Date;

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[];
}

@ObjectType()
export class EmployeeModel {
  @Field(() => ID)
  employee_id: string;

  @Field()
  name: string;

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[];
}

@ObjectType()
export class TransactionItemModel {
  @Field(() => ID)
  transaction_id: string;

  @Field(() => Int)
  product_id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unit_price: number;

  @Field(() => Float, { defaultValue: 0 })
  discount: number;

  @Field(() => Float)
  total_price: number;

  @Field(() => String)
  product_name: string;

  @Field(() => String, { nullable: true })
  category_name?: string;
}

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  transaction_id: string;

  @Field()
  transaction_date: Date;

  @Field()
  payment_method: string;

  @Field(() => Float)
  total_amount: number;

  @Field({ nullable: true })
  customer_id?: string;

  @Field()
  employee_id: string;

  @Field({ nullable: true })
  payment_refno?: string;

  @Field()
  status: string;

  @Field(() => Float, { defaultValue: 0 })
  tax_amount: number;

  @Field(() => Float, { defaultValue: 0 })
  discount_amount: number;

  @Field(() => Float)
  subtotal: number;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => CustomerModel, { nullable: true })
  customer?: CustomerModel;

  @Field(() => EmployeeModel)
  employee: EmployeeModel;

  @Field(() => [TransactionItemModel])
  items: TransactionItemModel[];
}