import { Module } from '@nestjs/common';
import { DevelopmentOpinionService } from './development-opinion.service';
import { DevelopmentOpinionController } from './development-opinion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentOpinion } from '../module/entities/customer-service/development-opinion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevelopmentOpinion])],
  providers: [DevelopmentOpinionService],
  controllers: [DevelopmentOpinionController],
})
export class DevelopmentOpinionModule {}
