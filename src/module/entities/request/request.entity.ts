import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { EquipmentCode } from '../equipment-code.entity';
import { FileEntity } from '../file.entity';
import { Code } from '../code.entity';
import { TestCode } from '../test-code.entity';
import { User } from '../user/user.entity';
import { TrainingCenter } from '../training-center.entity';
import { TrainingCenterGroup } from '../training-center-group.entity';

@Entity()
export class Request extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => EquipmentCode,
    eq => eq.id,
  )
  equipment: number;

  @ApiProperty()
  @IsString()
  @Column({ comment: '유형(제품/서비스)' })
  equipmentType: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, comment: '제품/서비스 명' })
  equipmentName: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, comment: '테스트 유형' })
  requestType: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, comment: '테스트 희망지역' })
  requestPlace: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestStartDate: Date;

  @ApiProperty()
  @IsString()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestEndDate: Date;

  @ApiProperty()
  @IsNumber()
  @Column({ comment: '테스트 희망횟수' })
  requestTestTimes: number;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text', comment: '추가 입력사항' })
  requestEtc: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => FileEntity,
    file => file.id,
  )
  file: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  managerName: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  managerPosition: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  managerContact: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  managerPhone: string;

  @ApiProperty()
  @IsString()
  @Column({ length: 50 })
  managerEmail: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => Code,
    code => code.id,
  )
  process: Code | number = 6;

  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: number;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text', nullable: true, comment: '반려 사유' })
  refuseDescription: string;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => TestCode,
    testCode => testCode.id,
  )
  testCode: number;

  @ApiProperty()
  @IsString()
  @Column({ length: 50, nullable: true, comment: '테스트 유형 기타' })
  testCodeDescription: string;

  @ApiProperty()
  @IsString()
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '평가 시작시간',
  })
  responseStartDate: Date;

  @ApiProperty()
  @IsString()
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '평가 종료시간',
  })
  responseEndDate: Date;

  @ApiProperty()
  @IsNumber()
  @ManyToOne(
    () => TrainingCenterGroup,
    center => center.id,
  )
  trainingCenter: number;
}
