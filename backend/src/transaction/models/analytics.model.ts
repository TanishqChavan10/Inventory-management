import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SalesOverviewModel {
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  totalTransactions: number;

  @Field(() => Float)
  avgOrderValue: number;

  @Field(() => Float)
  growthRate: number;
}

@ObjectType()
export class TopProductModel {
  @Field(() => Int)
  product_id: number;

  @Field()
  product_name: string;

  @Field()
  category_name: string;

  @Field(() => Int)
  total_sold: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  avg_price: number;

  @Field()
  trend: string;
}

@ObjectType()
export class PaymentMethodStatsModel {
  @Field()
  method: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  total_amount: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType()
export class RevenueByCategoryModel {
  @Field()
  category: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType()
export class SalesAnalyticsModel {
  @Field(() => SalesOverviewModel)
  overview: SalesOverviewModel;

  @Field(() => [TopProductModel])
  topProducts: TopProductModel[];

  @Field(() => [PaymentMethodStatsModel])
  paymentMethods: PaymentMethodStatsModel[];

  @Field(() => [RevenueByCategoryModel])
  revenueByCategory: RevenueByCategoryModel[];
}
