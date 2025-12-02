import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

@InputType()
export class SendInviteInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}