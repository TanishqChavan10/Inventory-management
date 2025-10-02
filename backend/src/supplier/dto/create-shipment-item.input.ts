import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

@InputType()
export class CreateShipmentItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  shipment_id: string;

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
  @IsDateString()
  mfg_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiry_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  batch_number?: string;
}