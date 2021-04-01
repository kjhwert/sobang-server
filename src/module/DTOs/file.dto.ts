import { ApiProperty, PickType } from '@nestjs/swagger';
import { FileEntity } from '../entities/file.entity';
import { IsNumber, IsString } from 'class-validator';

export class downloadFileDto {
  @ApiProperty({
    description: '파일 경로',
    enum: ['request', 'test-operation', 'form-manage'],
  })
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  fileId: number;
}

export class createFileDto extends PickType(FileEntity, [
  'name',
  'path',
  'size',
  'type',
]) {}
