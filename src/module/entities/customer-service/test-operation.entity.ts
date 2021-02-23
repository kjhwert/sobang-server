import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileEntity } from '../file.entity';

@Entity()
export class TestOperation extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  operationName: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  title: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  manager: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => FileEntity,
    file => file.id,
  )
  file: number;
}
