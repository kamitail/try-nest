import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Locals } from '../decorators/locals.decorator';
import { FilesService } from '../files/files.service';
import { Group } from '../groups/groups.dto';
import { User } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

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

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(@Locals('userId') userId: number) {
    this.filesService.changeFileName(`${userId}`);
  }
}
