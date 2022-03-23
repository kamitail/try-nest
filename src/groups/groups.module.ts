import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../hasura/client.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [ClientModule, AuthModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupModule {}
