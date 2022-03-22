import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { replace } from 'ramda';
import { exceptionsMessages } from '../exceptions.messages';
import { ValidUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(authToken: string): Promise<ValidUser> {
    const isTokenValid: ValidUser = await this.jwtService
      .verifyAsync(replace('Bearer ', '', authToken), {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch(() => {
        throw new HttpException(
          exceptionsMessages.userIsNotAuth,
          HttpStatus.FORBIDDEN,
        );
      });

    return isTokenValid;
  }

  login(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );
  }
}
