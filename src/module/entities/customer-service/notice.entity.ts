import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class Notice extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  title: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  description: string;
}
