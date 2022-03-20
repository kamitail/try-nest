import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  [x: string]: any;
  constructor(private readonly appService: AppService) {}

  @Get()
  splitMoney(): any {
    return this.appService.splitMoney();
  }

  @Get(':a')
  showParams(@Param('a', ParseIntPipe) b: number) {
    this.appService.getHello();
    return b;
  }
}
