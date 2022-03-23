import { Injectable } from '@nestjs/common';
import { map } from 'ramda';
import { ClientService } from '../hasura/client.service';
import { Group } from './groups.dto';
import {
  deleteGroupMembers,
  getGroupOwnersByGroupId,
  insertGroup,
  insertGroupMembers,
  updateGroupName,
} from './groups.queries';
import { GroupMember } from './members.dto';

@Injectable()
export class GroupsService {
  constructor(private clientService: ClientService) {}

  async addMembersToGroup(
    groupMembers: GroupMember[],
    groupId: number,
  ): Promise<GroupMember[]> {
    return (
      await this.clientService.clientQuery(insertGroupMembers, {
        groupMembers: map(
          (member: GroupMember): GroupMember => ({ ...member, groupId }),
          groupMembers,
        ),
      })
    ).data.insert_group_members.returning;
  }

  async createNewGroup(group: Group): Promise<Group> {
    return (await this.clientService.clientQuery(insertGroup, { group })).data
      .insert_groups_one;
  }

  async removeMembersFromGroup(
    groupMembers: GroupMember[],
    groupId: number,
  ): Promise<number> {
    return (
      await this.clientService.clientQuery(deleteGroupMembers, {
        membersIds: map(({ userId }: GroupMember) => userId, groupMembers),
        groupId,
      })
    ).data.delete_group_members.affected_rows;
  }

  async updateGroupName(groupId: number, name: string): Promise<number> {
    return (
      await this.clientService.clientQuery(updateGroupName, { groupId, name })
    ).data.update_groups.affected_rows;
  }

  async getGroupOwnersByGroupId(groupId: number): Promise<GroupMember[]> {
    return (
      await this.clientService.clientQuery(getGroupOwnersByGroupId, { groupId })
    ).data.group_members;
  }
}
