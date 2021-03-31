import {
  BeforeInsert,
  Column,
  Entity,
  Index,
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

  @ApiProperty({ description: '자문단 회원명' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '자문단 회원명' })
  name: string;

  @ApiProperty({ description: '기관명' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '기관명' })
  businessName: string;

  @ApiProperty({ description: '대표자명' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '대표자명' })
  businessOwner: string;

  @ApiProperty({ description: '사업자 번호' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '사업자 번호' })
  businessNo: string;

  @ApiProperty({ description: '소속' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '소속' })
  department: string;

  @ApiProperty({ description: '직위' })
  @IsString()
  @Column({ length: 50, nullable: true, comment: '직위' })
  position: string;

  @ApiProperty({ description: '자문지원 경력' })
  @IsString()
  @Column({ length: 50, comment: '자문지원 경력' })
  advisoryCareer: string;

  @ApiProperty({ description: '주요 현장대응 경력' })
  @IsString()
  @Column({ length: 50, comment: '주요 현장대응 경력' })
  fieldCareer: string;

  @ApiProperty({ description: '연차' })
  @IsString()
  @Column({ length: 50, comment: '연차' })
  career: string;

  @ApiProperty({ description: '그룹(베테랑/일반)' })
  @IsString()
  @Column({ length: 50, comment: '그룹(베테랑/일반)' })
  group: string;

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
