import { Controller, Get, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { indexEquipmentDto } from '../module/DTOs/equipment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  index(@Query() { group1, group2, group3 }: indexEquipmentDto) {
    if (group3) {
      return this.equipmentService.group4Index(group3);
    }

    if (group2) {
      return this.equipmentService.group3Index(group2);
    }

    if (group1) {
      return this.equipmentService.group2Index(group1);
    }

    return this.equipmentService.groupIndex();
  }
}
