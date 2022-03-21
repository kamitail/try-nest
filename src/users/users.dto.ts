import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
  MinLength,
} from 'class-validator';
import { __ } from 'ramda';
import { exceptionsMessages } from '../exceptions.messages';

export class User {
  @IsInt({ message: exceptionsMessages.idIsNaN })
  id?: number;

  @IsString({ message: exceptionsMessages.firstnameIsNotText })
  @IsNotEmpty({ message: exceptionsMessages.firstnameIsEmpty })
  firstname?: string;

  @IsString({ message: exceptionsMessages.lastnameIsNotText })
  @IsNotEmpty({ message: exceptionsMessages.lastnameIsEmpty })
  lastname?: string;

  @IsEmail(__, { message: exceptionsMessages.emailIsNotValid })
  email?: string;

  @IsString({ message: exceptionsMessages.phoneNumIsNotText })
  @IsNotEmpty({ message: exceptionsMessages.phoneNumIsEmpty })
  phoneNum?: string;

  @IsDateString(__, { message: exceptionsMessages.birthdateIsNotValid })
  birthdate?: string;

  @MinLength(8, { message: exceptionsMessages.passwordIsTooShort })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: exceptionsMessages.passwordIsNotValid,
  })
  password?: string;
}
