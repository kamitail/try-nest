import { Module } from '@nestjs/common';
import { ClientModule } from 'src/hasura/client.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [ClientModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupModule {}
