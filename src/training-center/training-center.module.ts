import { Module } from '@nestjs/common';
import { TrainingCenterService } from './training-center.service';
import { TrainingCenterController } from './training-center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingCenter } from '../module/entities/training-center.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCenter])],
  providers: [TrainingCenterService],
  controllers: [TrainingCenterController],
})
export class TrainingCenterModule {}
