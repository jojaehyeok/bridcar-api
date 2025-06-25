// src/mail/dto/contact.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()      name: string;
  @IsEmail()         email: string;
  @IsNotEmpty()      phone: string;
  @IsNotEmpty()      subject: string;
  @IsNotEmpty()      message: string;
  @IsNotEmpty()      verificationCode: string;
}
