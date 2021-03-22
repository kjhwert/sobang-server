import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../module/entities/request/request.entity';
import { UserModule } from '../user/user.module';
import { RequestOpinionModule } from './request-opinion.module';
import { RequestAdvisoryModule } from './request-advisory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    RequestOpinionModule,
    RequestAdvisoryModule,
    UserModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
