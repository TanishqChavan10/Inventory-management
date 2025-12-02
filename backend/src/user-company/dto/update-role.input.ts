import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateRoleInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  membership_id: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}