import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Group } from 'src/groups/groups.dto';
import { User } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':userId/groups')
  getUserGroups(@Param('userId') userId: number): Promise<Group[]> {
    return this.usersService.getUserGroups(userId);
  }

  @Post()
  createNewUser(@Body('user') user: User): Promise<string> {
    return this.usersService.createNewUser(user);
  }

  @Post('login')
  userLogin(@Body('user') user: User): Promise<string> {
    return this.usersService.userLogin(user);
  }
}
