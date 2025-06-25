// src/mail/mail.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { ContactDto } from './dto/create-mail.dto';

@Controller('contact')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async contact(@Body() dto: ContactDto) {
    const result = await this.mailService.sendContactMail(dto);
    return { status: 200, ...result };
  }
}
