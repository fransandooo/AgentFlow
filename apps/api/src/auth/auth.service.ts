import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

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
}
