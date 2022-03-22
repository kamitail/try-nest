import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { pipe } from 'ramda';
import { exceptionsMessages } from '../exceptions.messages';
import { AuthService } from '../auth/auth.service';
import { ClientService } from '../hasura/client.service';
import { User } from './users.dto';
import {
  findAllUsers,
  findUserByEmailAndPassword,
  insertUser,
} from './users.queries';
import { Group } from 'src/groups/groups.dto';
import { findGroupsByMemberId } from 'src/groups/groups.queries';

@Injectable()
export class UsersService {
  constructor(
    private clientService: ClientService,
    private authService: AuthService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return (await this.clientService.clientQuery(findAllUsers)).data.users;
  }

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

  async userLogin(user: User): Promise<string> {
    const passwordWithSpice = this.addPasswordSaltAndPepper(user);

    const DBUser: { id: number; password: string } = (
      await this.clientService.clientQuery(findUserByEmailAndPassword, {
        email: user.email,
      })
    ).data.users[0];

    if (!DBUser) {
      throw new HttpException(
        exceptionsMessages.emailDoesNotExist,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!(await compare(passwordWithSpice, DBUser.password))) {
      throw new HttpException(
        exceptionsMessages.passwordIsWrong,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.login(DBUser.id);
  }

  async getUserGroups(userId: number): Promise<Group[]> {
    return (
      await this.clientService.clientQuery(findGroupsByMemberId, { userId })
    ).data;
  }
}
