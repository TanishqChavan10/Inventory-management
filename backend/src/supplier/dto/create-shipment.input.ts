import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class ShipmentItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity_received: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  unit_price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  batch_number?: string;
}

@InputType()
export class CreateShipmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  supplier_id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  ref_no: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  received_date?: Date;

  @Field({ defaultValue: 'Pending' })
  @IsOptional()
  @IsEnum(['Pending', 'Paid', 'Failed'])
  payment_status?: 'Pending' | 'Paid' | 'Failed';

  @Field()
  @IsString()
  @IsNotEmpty()
  payment_mthd: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  invoice_amt: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  total_items: number;

  @Field(() => [ShipmentItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemInput)
  items: ShipmentItemInput[];
}