import { ApiProperty, PickType } from '@nestjs/swagger';
import { TestOperation } from '../entities/customer-service/test-operation.entity';
import { IsNumber } from 'class-validator';

export class createTestOperationDto extends PickType(TestOperation, [
  'title',
  'description',
  'manager',
  'operationName',
]) {
  @ApiProperty()
  @IsNumber()
  fileId: number;
}
