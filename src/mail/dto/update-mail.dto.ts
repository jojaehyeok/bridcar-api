import { PartialType } from '@nestjs/swagger';
import { ContactDto } from './create-mail.dto';

export class UpdateMailDto extends PartialType(ContactDto) {}
