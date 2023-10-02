import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private readonly _prismaService: PrismaService
  ) { }

  async login({ email, password }: LoginDto) {
    const user = await this._prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.hashedPassword, password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    // await this.updateRtHash(user.id, tokens.refresh_token);

    return { tokens, user };
  }

  handleDatabaseUser() {
    throw new Error('Method not implemented.');
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  logout() {
    return {};
  }

  async refresh(userId: string) {
    const user = await this._prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);

    return tokens;
  }
}
