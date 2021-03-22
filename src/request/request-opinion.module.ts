import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestOpinion } from '../module/entities/request/request-opinion.entity';
import { RequestOpinionController } from './request-opinion.controller';
import { RequestOpinionService } from './request-opinion.service';
import { RequestAdvisoryModule } from './request-advisory.module';
import { RequestModule } from './request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestOpinion]),
    forwardRef(() => RequestAdvisoryModule),
    forwardRef(() => RequestModule),
  ],
  controllers: [RequestOpinionController],
  providers: [RequestOpinionService],
  exports: [RequestOpinionService],
})
export class RequestOpinionModule {}
