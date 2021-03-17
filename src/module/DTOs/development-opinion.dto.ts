import { ApiProperty, PickType } from '@nestjs/swagger';
import { DevelopmentOpinion } from '../entities/customer-service/development-opinion.entity';
import { IsString } from 'class-validator';

export class createDevOpinionDto extends PickType(DevelopmentOpinion, [
  'title',
  'description',
]) {
  @ApiProperty({ format: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ format: '개선 의견' })
  @IsString()
  description: string;
}
