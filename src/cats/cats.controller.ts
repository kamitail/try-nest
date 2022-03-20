import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get('babini')
  getBabini(): string {
    throw new HttpException('Babini', HttpStatus.NOT_IMPLEMENTED);
    return 'babini';
  }
}
