import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { TrainingCenterGroup } from './training-center-group.entity';

@Entity()
export class TrainingCenter extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => TrainingCenterGroup,
    group => group.id,
  )
  group: number;
}
