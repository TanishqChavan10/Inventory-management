import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SupplierModel {
  @Field(() => ID)
  supplier_id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone_no: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  contact_person?: string;

  @Field({ nullable: true })
  registration_number?: string;

  @Field({ nullable: true })
  tax_id?: string;

  @Field()
  status: string;

  @Field(() => Int)
  category_id: number;

  @Field()
  created_date: Date;

  @Field()
  updated_date: Date;
}