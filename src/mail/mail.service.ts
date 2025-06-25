// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendContactMail(dto: ContactDto) {
    const { name, email, phone, subject, message, verificationCode } = dto;

    try {
      await this.transporter.sendMail({
        from: `"브릿카 문의" <${this.config.get('MAIL_USER')}>`,
        to: 'dua605@bridcar.com',
        subject: `[문의] ${subject}`,
        html: `
          <p><strong>담당자:</strong> ${name}</p>
          <p><strong>이메일:</strong> ${email}</p>
          <p><strong>전화번호:</strong> ${phone}</p>
          <p><strong>제목:</strong> ${subject}</p>
          <p><strong>내용:</strong><br/>${message}</p>
          <p><strong>인증코드:</strong> ${verificationCode}</p>
        `,
      });
      return { success: true };
    } catch (err) {
      console.error('메일 전송 실패:', err);
      throw new InternalServerErrorException('메일 전송 중 문제가 발생했습니다.');
    }
  }
}
