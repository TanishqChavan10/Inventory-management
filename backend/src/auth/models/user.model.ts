import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../entities/user.entity';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field()
  role: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  lastLogin?: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserModel)
  user: UserModel;
}