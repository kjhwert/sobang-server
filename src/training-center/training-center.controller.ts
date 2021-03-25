import { Controller, Get, Param, Query } from '@nestjs/common';
import { TrainingCenterService } from './training-center.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('training-center')
@Controller('training-center')
export class TrainingCenterController {
  constructor(private readonly trainingCenterService: TrainingCenterService) {}

  @Get()
  index(@Query('name') name: string) {
    return this.trainingCenterService.index(name);
  }

  @Get(':areaId')
  show(@Param('areaId') areaId: number) {
    return this.trainingCenterService.show(areaId);
  }
}
