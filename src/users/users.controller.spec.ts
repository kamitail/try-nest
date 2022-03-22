import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../hasura/client.module';
import { UsersController } from './users.controller';
import { User } from './users.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersService: UsersService;
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

    target = new ValidationPipe({ skipMissingProperties: true });
  });

  describe('User Validation Pipe', () => {
    it('should return email is not valid', async () => {
      expect(target.transform({ email: '' }, metadata)).rejects.toThrow();
    });

    it('should return email is valid', async () => {
      expect(target.transform({ email: 'amitai@gmail.com' }, metadata))
        .resolves;
    });

    it('should return id is not a number', async () => {
      expect(target.transform({ id: 'abd' }, metadata)).rejects.toThrow();
    });

    it('should return id is valid', async () => {
      expect(target.transform({ id: 21 }, metadata)).resolves;
    });

    it('should return first name is not text', async () => {
      expect(target.transform({ firstname: 1 }, metadata)).rejects.toThrow();
    });

    it('should return first name is not in hebrew', async () => {
      expect(
        target.transform({ firstname: 'Amitai' }, metadata),
      ).rejects.toThrow();
    });

    it('should return first name is empty', async () => {
      expect(target.transform({ firstname: '' }, metadata)).rejects.toThrow();
    });

    it('should return first name is valid', async () => {
      expect(target.transform({ lastname: 'אמיתי' }, metadata)).resolves;
    });

    it('should return last name is not text', async () => {
      expect(target.transform({ lastname: 1 }, metadata)).rejects.toThrow();
    });

    it('should return last name is not in hebrew', async () => {
      expect(
        target.transform({ lastname: 'Eldar' }, metadata),
      ).rejects.toThrow();
    });

    it('should return last name is empty', async () => {
      expect(target.transform({ lastname: '' }, metadata)).rejects.toThrow();
    });

    it('should return last name is valid', async () => {
      expect(target.transform({ lastname: 'אלדר' }, metadata)).resolves;
    });

    it('should return phone number is not text', async () => {
      expect(target.transform({ phoneNum: 1 }, metadata)).rejects.toThrow();
    });

    it('should return phone number is not digits only', async () => {
      expect(
        target.transform({ phoneNum: 'Asg3693' }, metadata),
      ).rejects.toThrow();
    });

    it('should return phone number is empty', async () => {
      expect(target.transform({ phoneNum: '' }, metadata)).rejects.toThrow();
    });

    it('should return phone number is valid', async () => {
      expect(target.transform({ phoneNum: '0505050505' }, metadata)).resolves;
    });

    it('should return birthdate is after today', async () => {
      expect(
        target.transform(
          { birthdate: DateTime.fromISO('2027-05-15T08:30:00').toJSDate() },
          metadata,
        ),
      ).rejects.toThrow();
    });

    it('should return birthdate is not text', async () => {
      expect(target.transform({ birthdate: 1 }, metadata)).rejects.toThrow();
    });

    it('should return birthdate is not date', async () => {
      expect(
        target.transform({ birthdate: 'afsg' }, metadata),
      ).rejects.toThrow();
    });

    it('should return birthdate is valid', async () => {
      expect(
        target.transform({ birthdate: '2016-05-25T09:08:34.123' }, metadata),
      ).resolves;
    });

    it('should return password is too short', async () => {
      expect(
        target.transform({ password: 'Aa123' }, metadata),
      ).rejects.toThrow();
    });

    it('should return password without capital letter', async () => {
      expect(
        target.transform({ password: 'a12345678' }, metadata),
      ).rejects.toThrow();
    });

    it('should return password without lowercase letter', async () => {
      expect(
        target.transform({ password: 'A12345678' }, metadata),
      ).rejects.toThrow();
    });

    it('should return password without numbers', async () => {
      expect(
        target.transform({ password: 'Aaaaaaaaa' }, metadata),
      ).rejects.toThrow();
    });

    it('should return password is valid', async () => {
      expect(target.transform({ password: 'Bb234567' }, metadata)).resolves;
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
