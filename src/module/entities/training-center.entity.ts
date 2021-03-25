import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { TrainingCenterGroup } from './training-center-group.entity';
import { FileEntity } from './file.entity';

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
  @IsString()
  @Column({ type: 'text' })
  descriptionTag: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => TrainingCenterGroup,
    group => group.id,
  )
  group: number;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => FileEntity,
    file => file.id,
  )
  file: number;
}
