import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    return {
      data: {
        email: dto.email,
        accessToken: 'pending-access-token',
        refreshToken: 'pending-refresh-token',
      },
    };
  }

  refresh(dto: RefreshTokenDto) {
    return {
      data: {
        refreshToken: dto.refreshToken,
        accessToken: 'pending-refreshed-access-token',
      },
    };
  }

  logout(dto: LogoutDto) {
    return {
      data: {
        revoked: true,
        refreshTokenProvided: Boolean(dto.refreshToken),
      },
    };
  }
}
