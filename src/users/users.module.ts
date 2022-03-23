import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_DESTINATION } from '../files/files.constants';
import { editFileName, filterImageFiles } from '../files/files.functions';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../hasura/client.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientModule,
    AuthModule,
    FilesModule,
    MulterModule.register({
      fileFilter: filterImageFiles,
      storage: diskStorage({
        destination: FILE_DESTINATION,
        filename: editFileName,
      }),
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
