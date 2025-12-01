import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { ClerkUser } from './decorators/clerk-user.decorator';
import { ClerkService } from './clerk.service';
import { GraphQLError } from 'graphql';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private clerkService: ClerkService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(ClerkAuthGuard)
  async me(
    @ClerkUser() clerkUser: { clerkId: string } | null,
  ): Promise<UserModel | null> {
    // If ClerkUser is null → return null (no redirect, no loop)
    if (!clerkUser?.clerkId) return null;

    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);

    // If user doesn't exist → return null (again, no loop)
    if (!user) return null;

    await this.clerkService.updateLastLogin(clerkUser.clerkId);

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }
}
