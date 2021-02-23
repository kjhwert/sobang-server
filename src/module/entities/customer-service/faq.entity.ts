import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class Faq extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  request: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  response: string;
}
