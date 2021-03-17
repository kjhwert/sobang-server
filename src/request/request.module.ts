import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../module/entities/request/request.entity';
import { RequestOpinion } from '../module/entities/request/request-opinion.entity';
import { RequestOpinionService } from './request-opinion.service';
import { RequestAdvisoryService } from './request-advisory.service';
import { RequestAdvisory } from '../module/entities/request/request-advisory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, RequestOpinion, RequestAdvisory]),
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestOpinionService, RequestAdvisoryService],
})
export class RequestModule {}
