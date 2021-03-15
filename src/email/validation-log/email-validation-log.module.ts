import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailValidationLog } from '../../module/entities/user/email-validation-log.entity';
import { EmailValidationLogService } from './email-validation-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailValidationLog])],
  providers: [EmailValidationLogService],
  exports: [EmailValidationLogService],
})
export class EmailValidationLogModule {}
