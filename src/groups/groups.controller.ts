import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Group } from './groups.dto';
import { GroupsService } from './groups.service';
import { GroupMember } from './members.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  createNewGroup(@Body('group') group: Group): Promise<Group> {
    return this.groupsService.createNewGroup(group);
  }

  @Post('members')
  addMembersToGroup(
    @Body('groupMembers') groupMembers: GroupMember[],
    @Body('groupId') groupId: number,
  ): Promise<GroupMember[]> {
    return this.groupsService.addMembersToGroup(groupMembers, groupId);
  }

  @Delete('members')
  removeMembersFromGroup(
    @Body('groupMembers') groupMembers: GroupMember[],
    @Body('groupId') groupId: number,
  ): Promise<number> {
    return this.groupsService.removeMembersFromGroup(groupMembers, groupId);
  }
}
