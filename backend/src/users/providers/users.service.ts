import { Injectable } from '@nestjs/common';
import { LoginInput } from '../dtos/login.input';
import { UserOutput } from '../dtos/user.output';

@Injectable()
export class UsersService {
  async login(input: LoginInput): Promise<UserOutput> {
    // Dummy login logic (replace with DB + JWT later)
    if (input.email === 'test@example.com' && input.password === '123456') {
      return {
        id: '1',
        email: input.email,
        name: 'Tanishq',
        token: 'dummy-jwt-token',
      };
    }
    throw new Error('Invalid credentials');
  }
}
