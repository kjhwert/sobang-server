import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class indexEquipmentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group1?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group3?: string;
}
