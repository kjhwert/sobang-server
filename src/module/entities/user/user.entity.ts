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
  @Column({ length: 100, unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 100 })
  password: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, nullable: true })
  name: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, nullable: true })
  businessName: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, nullable: true })
  businessOwner: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, nullable: true })
  businessNo: string;

  @ApiProperty({ description: '소속' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '소속' })
  department: string;

  @ApiProperty({ description: '직위' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '직위' })
  position: string;

  @ManyToOne(
    () => Code,
    code => code.id,
  )
  @ApiProperty()
  @IsNumber()
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
