import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../user/user.entity';

@Entity()
export class DevelopmentOpinion extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  title: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  description: string;
}
