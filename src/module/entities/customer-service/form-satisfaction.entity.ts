import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileEntity } from '../file.entity';

@Entity()
export class FormSatisfaction extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  title: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => FileEntity,
    file => file.id,
  )
  file: number;
}
