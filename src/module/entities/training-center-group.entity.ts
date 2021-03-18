import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class TrainingCenterGroup extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '기관명' })
  @IsString()
  @Column({ length: 50, comment: '기관명' })
  name: string;

  @ApiProperty({ description: '위치' })
  @IsString()
  @Column({ length: 200, comment: '위치' })
  address: string;

  @ApiProperty({ description: '규모' })
  @IsString()
  @Column({ type: 'text', comment: '규모' })
  scale: string;

  @ApiProperty({ description: '주요 훈련 시설' })
  @IsString()
  @Column({ type: 'text', comment: '주요 훈련 시설' })
  facilities: string;
}
