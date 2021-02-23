import { Module } from '@nestjs/common';
import { DevelopmentOpinionService } from './development-opinion.service';
import { DevelopmentOpinionController } from './development-opinion.controller';

@Module({
  providers: [DevelopmentOpinionService],
  controllers: [DevelopmentOpinionController]
})
export class DevelopmentOpinionModule {}
