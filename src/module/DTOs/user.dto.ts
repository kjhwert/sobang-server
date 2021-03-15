import { User } from '../entities/user/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class loginUserDto extends PickType(User, ['email', 'password']) {}

export class findUserEmailDto {
  @ApiProperty({ enum: ['organization', 'advisory'] })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessOwner?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessNo?: string;
}

export class createUserDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string; // 자문단 회원

  @ApiProperty()
  @IsString()
  password: string;

  /**
   * 기관회원
   * */
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessOwner?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessNo?: string;
}
