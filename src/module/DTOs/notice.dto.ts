import { PickType } from '@nestjs/swagger';
import { Notice } from '../entities/customer-service/notice.entity';

export class createNoticeDto extends PickType(Notice, [
  'title',
  'description',
]) {}
