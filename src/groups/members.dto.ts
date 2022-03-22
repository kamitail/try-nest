import { IsBoolean, IsInt } from 'class-validator';
import { exceptionsMessages } from '../exceptions.messages';
import { User } from '../users/users.dto';

export class GroupMember {
  @IsInt({ message: exceptionsMessages.idIsNaN })
  id?: number;

  @IsInt({ message: exceptionsMessages.idIsNaN })
  userId?: number;

  @IsInt({ message: exceptionsMessages.idIsNaN })
  groupId?: number;

  @IsBoolean({ message: 'המשתנה צריך להיות בוליאני' })
  isOwner?: boolean;

  user?: User;
}
