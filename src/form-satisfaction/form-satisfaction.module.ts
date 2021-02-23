import { Module } from '@nestjs/common';
import { FormSatisfactionService } from './form-satisfaction.service';
import { FormSatisfactionController } from './form-satisfaction.controller';

@Module({
  providers: [FormSatisfactionService],
  controllers: [FormSatisfactionController]
})
export class FormSatisfactionModule {}
