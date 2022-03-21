import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { pipe } from 'ramda';
import { AuthService } from '../auth/auth.service';
import { ClientService } from '../hasura/client.service';
import { User } from './users.dto';
import { insertUser } from './users.queries';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private clientService: ClientService,
    private authService: AuthService,
  ) {}

  addPasswordSaltAndPepper({ password, email }: User): string {
    return password + email + process.env.SERVER_PEPPER;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return hash(password, saltOrRounds);
  }

  async createNewUser(user: User): Promise<string> {
    const hashedPassword = await pipe(
      this.addPasswordSaltAndPepper,
      this.hashPassword,
    )(user);

    const userId: number = (
      await this.clientService.clientQuery(insertUser, {
        user: { ...user, password: hashedPassword },
      })
    ).data.insert_users_one.id;

    return this.authService.login(userId);
  }
}
