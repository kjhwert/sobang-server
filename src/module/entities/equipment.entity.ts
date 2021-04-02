import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  group1: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  group2: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  group3: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  group4: string;
}
