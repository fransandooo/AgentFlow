import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compareHash } from '../common/utils/hash.util';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compareHash(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: `pending-access-token-for-${user.id}`,
        refreshToken: `pending-refresh-token-for-${user.id}`,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    return {
      data: {
        refreshToken: dto.refreshToken,
        accessToken: 'pending-refreshed-access-token',
      },
    };
  }

  async logout(dto: LogoutDto) {
    return {
      data: {
        revoked: true,
        refreshTokenProvided: Boolean(dto.refreshToken),
      },
    };
  }
}
