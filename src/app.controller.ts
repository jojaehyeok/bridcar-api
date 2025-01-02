import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }
  @Get() // HTTP GET 요청 처리
  getExample(): string {
    return 'This is an example response!';
  }
  

}
