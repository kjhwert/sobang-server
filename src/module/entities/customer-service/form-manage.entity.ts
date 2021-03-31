import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileEntity } from '../file.entity';

@Entity()
export class FormManage extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '분류' })
  @IsString()
  @Column({ length: 50, comment: '분류' })
  type: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @Column({ length: 50, comment: '제목' })
  title: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => FileEntity,
    file => file.id,
  )
  file: number;
}
