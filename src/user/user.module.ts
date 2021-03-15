import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../module/entities/user/user.entity';
import { EmailValidationLogModule } from '../email/validation-log/email-validation-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailValidationLogModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
