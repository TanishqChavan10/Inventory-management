import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ShipmentItemModel {
  @Field(() => ID)
  id: string;

  @Field()
  shipment_id: string;

  @Field()
  product_id: string;

  @Field()
  product_name: string;

  @Field(() => Int)
  quantity_received: number;

  @Field(() => Float)
  unit_price: number;

  @Field({ nullable: true })
  mfg_date?: Date;

  @Field({ nullable: true })
  expiry_date?: Date;

  @Field({ nullable: true })
  batch_number?: string;
}
