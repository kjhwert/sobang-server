import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Request } from './request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { User } from '../user/user.entity';

@Entity()
export class requestAdvisory extends CommonEntity {
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
}
