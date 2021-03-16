import { Body, Controller, Post } from '@nestjs/common';
import { createDevOpinionDto } from '../module/DTOs/development-opinion.dto';
import { ApiTags } from '@nestjs/swagger';
import { DevelopmentOpinionService } from './development-opinion.service';

@ApiTags('dev-opinion')
@Controller('dev-opinion')
export class DevelopmentOpinionController {
  constructor(private readonly devOpinionService: DevelopmentOpinionService) {}
  @Post()
  create(@Body() data: createDevOpinionDto) {
    return this.devOpinionService.create(data);
  }
}
