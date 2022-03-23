import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { Group } from './groups.dto';
import { GroupsGuard } from './groups.gaurd';
import { GroupsService } from './groups.service';
import { GroupMember } from './members.dto';

@Controller('groups')
@UseGuards(GroupsGuard)
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

  @Put()
  updateGroupName(
    @Body('groupId') groupId: number,
    @Body('name') name: string,
  ): Promise<number> {
    return this.groupsService.updateGroupName(groupId, name);
  }
}
