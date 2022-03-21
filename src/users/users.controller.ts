import { Body, Controller, Post } from '@nestjs/common';
import { User } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createNewUser(@Body('user') user: User): Promise<string> {
    return this.usersService.createNewUser(user);
  }
}
