import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ShipmentModel {
  @Field(() => ID)
  shipment_id: string;

  @Field()
  supplier_id: string;

  @Field()
  ref_no: string;

  @Field()
  received_date: Date;

  @Field()
  payment_status: string;

  @Field()
  payment_mthd: string;

  @Field(() => Float)
  invoice_amt: number;

  @Field(() => Int)
  total_items: number;
}