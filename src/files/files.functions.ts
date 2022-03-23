import { BadRequestException } from '@nestjs/common';
import { includes, Placeholder } from 'ramda';
import { exceptionsMessages } from '../exceptions.messages';
import {
  FileFilterCallback,
  FileStorageCallback,
  FileType,
} from './files.types';

export const filterImageFiles = (
  _: Placeholder,
  file: FileType,
  callback: FileFilterCallback,
) => {
  includes('image', file.mimetype)
    ? callback(null, true)
    : callback(
        new BadRequestException(exceptionsMessages.fileIsNotValid),
        false,
      );
};

export const editFileName = (_, __, callback: FileStorageCallback) =>
  callback(null, 'image.png');
