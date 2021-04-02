import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from '../module/entities/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  providers: [EquipmentService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
