import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './file/file.module';
import { RequestModule } from './request/request.module';
import { FaqModule } from './faq/faq.module';
import { DevelopmentOpinionModule } from './development-opinion/development-opinion.module';
import { NoticeModule } from './notice/notice.module';
import { TestOperationModule } from './test-operation/test-operation.module';
import { FormAdminModule } from './form-admin/form-admin.module';
import { FormSatisfactionModule } from './form-satisfaction/form-satisfaction.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(),
    MulterModule.register({
      dest: './public',
    }),
    FileModule,
    RequestModule,
    FaqModule,
    DevelopmentOpinionModule,
    NoticeModule,
    TestOperationModule,
    FormAdminModule,
    FormSatisfactionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
