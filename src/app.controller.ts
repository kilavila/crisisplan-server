import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('public')
export class AppController {

  constructor(private appService: AppService) {}

  @Get('status')
  serverStatus(): string {
    return this.appService.serverStatus();
  }

  @Post('feedback')
  async createFeedback(@Body() body: any) {
    return await this.appService.createFeedback(body);
  }

}