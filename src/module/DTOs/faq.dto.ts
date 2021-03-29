import { ApiProperty, PickType } from '@nestjs/swagger';
import { Faq } from '../entities/customer-service/faq.entity';
import { IsOptional, IsString } from 'class-validator';

export class indexFaqDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  page: number;
}

export class createFaqDto extends PickType(Faq, ['request', 'response']) {}
