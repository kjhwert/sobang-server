import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { createDevOpinionDto } from '../module/DTOs/development-opinion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DevelopmentOpinionService } from './development-opinion.service';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('dev-opinion')
@Controller('dev-opinion')
export class DevelopmentOpinionController {
  constructor(private readonly devOpinionService: DevelopmentOpinionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get()
  index(@Query('page') page: string) {
    return this.devOpinionService.index(Number(page));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get(':opinionId')
  show(@Param('opinionId') opinionId: number) {}

  @Post()
  create(@Body() data: createDevOpinionDto) {
    return this.devOpinionService.create(data);
  }
}
