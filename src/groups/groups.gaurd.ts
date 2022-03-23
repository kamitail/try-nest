import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { any } from 'ramda';
import { ValidUser } from '../auth/auth.types';
import { AuthService } from '../auth/auth.service';
import { GroupsService } from './groups.service';
import { GroupMember } from './members.dto';

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private groupsSerivce: GroupsService,
  ) {}

  private async validateRequest(
    request: Request,
    handlerName: string,
  ): Promise<boolean> {
    const authorizationToken = request.headers.authorization;
    const { userId }: ValidUser = await this.authService.validateUser(
      authorizationToken,
    );

    handlerName === 'addMembersToGroup' && (request.body.userId = userId);

    const isUserGroupOwner = async (groupId: number) => {
      const groupOwners = await this.groupsSerivce.getGroupOwnersByGroupId(
        groupId,
      );

      return any((owner: GroupMember) => owner.user.id === userId, groupOwners);
    };

    return (
      handlerName === 'createNewGroup' ||
      (typeof request.body.groupId === 'number' &&
        isUserGroupOwner(request.body.groupId))
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handlerName: string = context.getHandler().name;
    return await this.validateRequest(request, handlerName);
  }
}
