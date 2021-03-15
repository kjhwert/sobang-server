import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Code } from '../code.entity';
import * as bcrypt from 'bcrypt';

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

  private async hashing(password: string) {
    return await bcrypt.hash(password, 10);
  }

  @BeforeInsert()
  private async hashPassword() {
    if (this.password) {
      this.password = await this.hashing(this.password);
    }
  }

  async changePassword(password: string) {
    return await this.hashing(password);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
