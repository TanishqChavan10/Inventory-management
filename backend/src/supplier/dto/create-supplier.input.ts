import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';

@InputType()
export class CreateSupplierInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone_no: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @Field({ defaultValue: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: 'Active' | 'Inactive';

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}