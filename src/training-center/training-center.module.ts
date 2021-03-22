import { Module } from '@nestjs/common';
import { TrainingCenterService } from './training-center.service';
import { TrainingCenterController } from './training-center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingCenter } from '../module/entities/training-center.entity';
import { TrainingCenterGroup } from '../module/entities/training-center-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCenterGroup, TrainingCenter])],
  providers: [TrainingCenterService],
  controllers: [TrainingCenterController],
  exports: [TrainingCenterService],
})
export class TrainingCenterModule {}
