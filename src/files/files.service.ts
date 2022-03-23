import { BadRequestException, Injectable } from '@nestjs/common';
import { rename } from 'fs';
import { exceptionsMessages } from '../exceptions.messages';
import { FILE_DESTINATION } from './files.constants';

@Injectable()
export class FilesService {
  changeFileName(fileName: string) {
    rename(
      `${FILE_DESTINATION}/image.png`,
      `${FILE_DESTINATION}/${fileName}.png`,
      (error) => {
        if (error) {
          throw new BadRequestException(exceptionsMessages.fileUploadFailed);
        }
      },
    );
  }
}
