import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthService } from '../auth/auth.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly _authService: AuthService,
    private readonly _prismaService: PrismaService,
  ) {}

  async register({ email, firstName, lastName, password, role }: RegisterDto) {
    const hash = await argon.hash(password);

    const user = await this._prismaService.user
      .create({
        data: {
          email,
          hashedPassword: hash,
          firstName,
          lastName,
          role
        },
      })
      .catch((error) => {
        if (error) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this._authService.getTokens(user.id, user.email);

    return tokens;
  }

  async getAgent(userId: string) {
    return await this._prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
