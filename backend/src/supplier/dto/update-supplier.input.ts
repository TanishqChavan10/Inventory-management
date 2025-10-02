import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator';

@InputType()
export class UpdateSupplierInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  supplier_id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_no?: string;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: 'Active' | 'Inactive';

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  category_id?: number;
}