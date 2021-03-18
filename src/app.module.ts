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
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NavigationModule } from './navigation/navigation.module';
import { TestCodeModule } from './test-code/test-code.module';
import { TrainingCenterModule } from './training-center/training-center.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(),
    MulterModule.register({
      dest: './public',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 25,
        secure: false,
      },
      defaults: {
        from: '"contact" <contact@hlabtech.com>',
      },
    }),
    FileModule,
    RequestModule,
    FaqModule,
    DevelopmentOpinionModule,
    NoticeModule,
    TestOperationModule,
    FormAdminModule,
    FormSatisfactionModule,
    AuthModule,
    NavigationModule,
    TestCodeModule,
    TrainingCenterModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
