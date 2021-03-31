import { ApiProperty, PickType } from '@nestjs/swagger';
import { FormManage } from '../entities/customer-service/form-manage.entity';
import { IsNumber } from 'class-validator';

export class createFormManageDto extends PickType(FormManage, [
  'title',
  'type',
]) {
  @ApiProperty()
  @IsNumber()
  fileId: number;
}
