import {
  IsDateString,
  IsEmail,
  IsInt,
  Matches,
  MinLength,
} from 'class-validator';
import { __ } from 'ramda';
import { exceptionsMessages } from '../exceptions.messages';

export class User {
  @IsInt({ message: exceptionsMessages.idIsNaN })
  id?: number;

  @Matches(/^[א-ת]+$/, { message: exceptionsMessages.firstnameIsNotValid })
  firstname?: string;

  @Matches(/^[א-ת]+$/, { message: exceptionsMessages.lastnameIsNotValid })
  lastname?: string;

  @IsEmail(__, { message: exceptionsMessages.emailIsNotValid })
  email?: string;

  @Matches(/^\d+$/, { message: exceptionsMessages.phoneNumIsNotValid })
  phoneNum?: string;

  @IsDateString(__, { message: exceptionsMessages.birthdateIsNotValid })
  birthdate?: string;

  @MinLength(8, { message: exceptionsMessages.passwordIsTooShort })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: exceptionsMessages.passwordIsNotValid,
  })
  password?: string;
}
