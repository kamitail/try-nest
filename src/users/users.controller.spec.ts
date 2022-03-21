import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../hasura/client.module';
import { exceptionsMessages } from '../exceptions.messages';
import { UsersController } from './users.controller';
import { User } from './users.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;
  let target: ValidationPipe;
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: User,
    data: '',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientModule,
        AuthModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
    usersController = app.get<UsersController>(UsersController);

    target = new ValidationPipe({ skipMissingProperties: true });
  });

  describe('User Validation Pipe', () => {
    it('should return email is not valid', async () => {
      await target
        .transform({ email: '' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.emailIsNotValid,
          ]),
        );
    });

    it('should return email is valid', async () => {
      const emailData = await target.transform(
        { email: 'amitai@gmail.com' },
        metadata,
      );
      expect(emailData).toEqual({ email: 'amitai@gmail.com' });
    });

    it('should return id is not a number', async () => {
      await target
        .transform({ id: 'abd' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.idIsNaN,
          ]),
        );
    });

    it('should return id is valid', async () => {
      const idData = await target.transform({ id: 21 }, metadata);
      expect(idData).toEqual({ id: 21 });
    });

    it('should return first name is not string', async () => {
      await target
        .transform({ firstname: 1 }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.firstnameIsNotText,
          ]),
        );
    });

    it('should return first name is empty', async () => {
      await target
        .transform({ firstname: '' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.firstnameIsEmpty,
          ]),
        );
    });

    it('should return first name is valid', async () => {
      const firstnameData = await target.transform(
        { firstname: 'Amitai' },
        metadata,
      );
      expect(firstnameData).toEqual({ firstname: 'Amitai' });
    });

    it('should return last name is not string', async () => {
      await target
        .transform({ lastname: 1 }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.lastnameIsNotText,
          ]),
        );
    });

    it('should return last name is empty', async () => {
      await target
        .transform({ lastname: '' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.lastnameIsEmpty,
          ]),
        );
    });

    it('should return last name is valid', async () => {
      const lastnameData = await target.transform(
        { lastname: 'Eldar' },
        metadata,
      );
      expect(lastnameData).toEqual({ lastname: 'Eldar' });
    });

    it('should return phone number is not string', async () => {
      await target
        .transform({ phoneNum: 1 }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.phoneNumIsNotText,
          ]),
        );
    });

    it('should return phone number is empty', async () => {
      await target
        .transform({ phoneNum: '' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.phoneNumIsEmpty,
          ]),
        );
    });

    it('should return phone number is valid', async () => {
      const phoneData = await target.transform(
        { phoneNum: '0505050505' },
        metadata,
      );
      expect(phoneData).toEqual({ phoneNum: '0505050505' });
    });

    it('should return birthdate is after today', async () => {
      await target
        .transform(
          { birthdate: DateTime.fromISO('2027-05-15T08:30:00').toJSDate() },
          metadata,
        )
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.birthdateIsNotValid,
          ]),
        );
    });

    it('should return birthdate is valid', async () => {
      const birthdateData = await target.transform(
        { birthdate: '2016-05-25T09:08:34.123' },
        metadata,
      );
      expect(birthdateData).toEqual({
        birthdate: '2016-05-25T09:08:34.123',
      });
    });

    it('should return password is too short', async () => {
      await target
        .transform({ password: 'Aa123' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.passwordIsTooShort,
          ]),
        );
    });

    it('should return password without capital letter', async () => {
      await target
        .transform({ password: 'a12345678' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.passwordIsNotValid,
          ]),
        );
    });

    it('should return password without lowercase letter', async () => {
      await target
        .transform({ password: 'A12345678' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.passwordIsNotValid,
          ]),
        );
    });

    it('should return password without numbers', async () => {
      await target
        .transform({ password: 'Aaaaaaaaa' }, metadata)
        .catch((error) =>
          expect(error.getResponse().message).toEqual([
            exceptionsMessages.passwordIsNotValid,
          ]),
        );
    });

    it('should return password is valid', async () => {
      const passwordData = await target.transform(
        { password: 'Bb234567' },
        metadata,
      );
      expect(passwordData).toEqual({ password: 'Bb234567' });
    });
  });

  describe('Adding salt and pepper to the password', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterAll(() => {
      process.env = OLD_ENV;
    });

    it('should adding the salt and then the pepper', () => {
      process.env.SERVER_PEPPER = 'pepper';
      const user: User = { password: 'Bb123456', email: 'user@gmail.com' };
      expect(usersService.addPasswordSaltAndPepper(user)).toEqual(
        'Bb123456user@gmail.compepper',
      );
    });
  });
});
