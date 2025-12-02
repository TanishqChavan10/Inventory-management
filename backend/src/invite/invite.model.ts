import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../role/role.model';

@ObjectType()
export class Invite {
  @Field(() => Int)
  invite_id: number;

  @Field()
  email: string;

  @Field(() => Int)
  company_id: number;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Int)
  invited_by: number;

  @Field()
  status: string; // pending, accepted, rejected, expired

  @Field({ nullable: true })
  token?: string;

  @Field()
  expires_at: Date;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  accepted_at?: Date;
}