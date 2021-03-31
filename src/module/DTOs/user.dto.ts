import { User } from '../entities/user/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class changePasswordUserDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}

export class searchAdvisoryUserDto {
  @ApiProperty({ description: '자문단 매칭시 자문단 회원 명으로 검색' })
  @IsString()
  name: string;
}

export class indexUserDto {
  @ApiProperty({
    enum: [3, 4, 5],
    description: '3: 기관회원, 4: 자문단 회원, 5: 관리자',
  })
  @IsString()
  type: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  page: number;
}

export class loginUserDto extends PickType(User, ['email', 'password']) {}

export class emailValidationDto {
  @ApiProperty({
    description: '해당 이메일로 인증코드가 발송됩니다.',
  })
  @IsString()
  email: string;
}

export class findUserEmailDto {
  @ApiProperty({
    enum: [3, 4],
    format: '회원유형 분류',
    description: '3: 기관회원, 4: 자문단 회원',
  })
  @IsString()
  type: string;

  @ApiProperty({
    required: false,
    format: '자문단 회원',
    description: '자문단 회원 명',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    format: '기관 회원',
    description: '기관 대표자명',
  })
  @IsString()
  @IsOptional()
  businessOwner?: string;

  @ApiProperty({
    required: false,
    format: '기관 회원',
    description: '기관 사업자 번호',
  })
  @IsString()
  @IsOptional()
  businessNo?: string;
}

export class createAdminUserDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ description: '관리자 명' })
  @IsString()
  name: string;

  @ApiProperty({ description: '직위' })
  @IsString()
  position: string;

  @ApiProperty({ description: '소속' })
  @IsString()
  department: string;
}

export class createUserDto {
  @ApiProperty({
    enum: [3, 4],
    format: '회원유형 분류',
    description: '3: 기관회원, 4: 자문단 회원',
  })
  @IsNumber()
  type: number;

  @ApiProperty({ description: '이메일로 받은 인증코드' })
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    format: '자문단 회원',
    description: '자문단 회원 성함',
  })
  @IsString()
  @IsOptional()
  name?: string; // 자문단 회원

  /**
   * 기관회원
   * */
  @ApiProperty({ required: false, format: '기관 회원', description: '기관 명' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    required: false,
    format: '기관 회원',
    description: '기관 대표자명',
  })
  @IsString()
  @IsOptional()
  businessOwner?: string;

  @ApiProperty({
    required: false,
    format: '기관 회원',
    description: '기관 사업자 번호',
  })
  @IsString()
  @IsOptional()
  businessNo?: string;
}
