import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Entity()
export class EmailValidationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  email: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  code: string;

  @BeforeInsert()
  private async randomCode() {
    this.code = randomStringGenerator().substr(0, 8);
  }
}
