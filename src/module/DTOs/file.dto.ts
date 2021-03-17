import { PickType } from '@nestjs/swagger';
import { FileEntity } from '../entities/file.entity';

export class createFileDto extends PickType(FileEntity, [
  'name',
  'path',
  'size',
  'type',
]) {}
