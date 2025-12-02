import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../role/role.model';

@ObjectType()
export class UserCompany {
  @Field(() => Int)
  membership_id: number;

  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  company_id: number;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field()
  joined_at: Date;

  @Field({ nullable: true })
  invited_by?: number;

  @Field({ nullable: true })
  status?: string; // active, pending, inactive
}