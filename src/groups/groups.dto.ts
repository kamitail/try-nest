import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { exceptionsMessages } from '../exceptions.messages';
import { GroupMember } from './members.dto';

export class Group {
  @IsInt({ message: exceptionsMessages.idIsNaN })
  id?: number;

  @IsString({ message: exceptionsMessages.groupNameIsNotText })
  @IsNotEmpty({ message: exceptionsMessages.groupNameIsEmpty })
  name?: string;

  groupMembers?: GroupMember[];
}
