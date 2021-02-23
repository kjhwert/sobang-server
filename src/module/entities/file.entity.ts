import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

@Entity({ name: 'file' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 200 })
  path: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  size: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 10 })
  type: string;
}
