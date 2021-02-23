import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Code } from '../code.entity';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  email: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  password: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  name: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  businessName: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  businessOwner: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  businessNo: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => Code,
    code => code.id,
  )
  type: number;
}
