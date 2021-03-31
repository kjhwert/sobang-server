import { Module } from '@nestjs/common';
import { FormManageService } from './form-manage.service';
import { FormManageController } from './form-manage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormManage } from '../module/entities/customer-service/form-manage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormManage])],
  providers: [FormManageService],
  controllers: [FormManageController],
})
export class FormManageModule {}
