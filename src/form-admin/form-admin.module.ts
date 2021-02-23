import { Module } from '@nestjs/common';
import { FormAdminController } from './form-admin.controller';
import { FormAdminService } from './form-admin.service';

@Module({
  controllers: [FormAdminController],
  providers: [FormAdminService]
})
export class FormAdminModule {}
