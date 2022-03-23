import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { Group } from './groups.dto';
import { GroupMember } from './members.dto';

describe('GroupsController', () => {
  let target: ValidationPipe;
  const groupsMetadata: ArgumentMetadata = {
    type: 'body',
    metatype: Group,
    data: '',
  };
  const membersMetadata: ArgumentMetadata = {
    type: 'body',
    metatype: GroupMember,
    data: '',
  };
  beforeEach(async () => {
    target = new ValidationPipe({ skipMissingProperties: true });
  });

  describe('Group Validation Pipe', () => {
    it('should return id is not a number', async () => {
      expect(target.transform({ id: 'abd' }, groupsMetadata)).rejects.toThrow();
    });

    it('should return id is valid', async () => {
      expect(target.transform({ id: 21 }, groupsMetadata)).resolves;
    });

    it('should return group name is not a number', async () => {
      expect(target.transform({ name: 1 }, groupsMetadata)).rejects.toThrow();
    });

    it('should return group name is empty', async () => {
      expect(target.transform({ id: '' }, groupsMetadata)).rejects.toThrow();
    });

    it('should return group name is valid', async () => {
      expect(
        target.transform({ name: 'nice group נודר נדר:)' }, groupsMetadata),
      ).resolves;
    });

    it('should return member id is not a number', async () => {
      expect(
        target.transform({ id: 'abd' }, membersMetadata),
      ).rejects.toThrow();
    });

    it('should return member id is valid', async () => {
      expect(target.transform({ id: 21 }, membersMetadata)).resolves;
    });

    it('should return isOwner is not a boolean', async () => {
      expect(
        target.transform({ isOwner: 'abd' }, membersMetadata),
      ).rejects.toThrow();
    });

    it('should return isOwner is valid', async () => {
      expect(target.transform({ isOwner: true }, membersMetadata)).resolves;
    });

    it('should return member user id is not a number', async () => {
      expect(
        target.transform({ userId: 'abd' }, membersMetadata),
      ).rejects.toThrow();
    });

    it('should return member user id is valid', async () => {
      expect(target.transform({ userId: 21 }, membersMetadata)).resolves;
    });

    it('should return member group id is not a number', async () => {
      expect(
        target.transform({ groupId: 'abd' }, membersMetadata),
      ).rejects.toThrow();
    });

    it('should return member group id is valid', async () => {
      expect(target.transform({ groupId: 21 }, membersMetadata)).resolves;
    });
  });
});
