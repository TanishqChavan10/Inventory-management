import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './providers/users.service';
import { LoginInput } from './dtos/login.input';
import { UserOutput } from './dtos/user.output';

@Resolver(() => UserOutput) 
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserOutput)
  login(@Args('input') input: LoginInput): Promise<UserOutput> {
    return this.usersService.login(input);
  }
}
