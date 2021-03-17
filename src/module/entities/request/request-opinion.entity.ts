import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Request } from './request.entity';
import { User } from '../user/user.entity';

@Entity()
export class RequestOpinion extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => Request,
    req => req.id,
  )
  request: number;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: number;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  description: string;
}
