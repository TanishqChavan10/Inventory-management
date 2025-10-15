import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @Field({ nullable: true })
  fullName?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}