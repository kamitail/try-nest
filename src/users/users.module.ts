import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../hasura/client.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ClientModule, AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
