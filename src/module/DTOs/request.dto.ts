import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class acceptRequestDto {
  @ApiProperty({ type: [Number], description: '자문단으로 매칭된 회원번호' })
  @IsNumber({}, { each: true })
  advisories: number[];

  @ApiProperty({ description: '테스트 유형번호' })
  @IsNumber()
  testCodeId: number;

  @ApiProperty({ description: '테스트 시작 날짜' })
  @IsString()
  responseStartDate: string;

  @ApiProperty({ description: '테스트 종료 날짜' })
  @IsString()
  responseEndDate: string;
}

export class indexRequestDto {
  @ApiProperty({
    enum: [6, 7, 8, 9, 10],
    description: '6: 신청중, 7: 승인, 8: 반려, 9: 진행완료, 10: 전체',
  })
  @IsString()
  process: number;

  @ApiProperty()
  @IsString()
  page: number;
}

export class createRequestDto {
  @ApiProperty({ enum: ['제품', '서비스'], description: '유형' })
  @IsString()
  equipmentType: '제품' | '서비스';

  @ApiProperty({ description: '장비분류코드' })
  @IsNumber()
  equipmentId: number;

  @ApiProperty({ description: '제품·서비스 명' })
  @IsString()
  equipmentName: string;

  @ApiProperty({ description: '테스트 유형' })
  @IsString()
  requestType: string;

  @ApiProperty({ description: '테스트 희망지역' })
  @IsString()
  requestPlace: string;

  @ApiProperty({ description: '테스트 희망 시작시간' })
  @IsString()
  requestStartDate: string;

  @ApiProperty({ description: '테스트 희망 종료시간' })
  @IsString()
  requestEndDate: string;

  @ApiProperty({ description: '테스트 희망횟수' })
  @IsNumber()
  requestTestTimes: number;

  @ApiProperty({ description: '추가 입력사항' })
  @IsString()
  requestEtc: string;

  @ApiProperty({ description: '첨부파일' })
  @IsNumber()
  fileId: number;

  @ApiProperty({ description: '담당자 명' })
  @IsString()
  managerName: string;

  @ApiProperty({ description: '담당자 부서/직위' })
  @IsString()
  managerPosition: string;

  @ApiProperty({ description: '담당자 연락처' })
  @IsString()
  managerContact: string;

  @ApiProperty({ description: '담당자 휴대폰' })
  @IsString()
  managerPhone: string;

  @ApiProperty({ description: '담당자 이메일' })
  @IsString()
  managerEmail: string;
}
