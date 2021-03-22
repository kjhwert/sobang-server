import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { RequestOpinionService } from './request-opinion.service';
import { JwtAdvisoryGuard } from '../auth/jwt/jwt-advisory.guard';
import { createRequestOpinionDto } from '../module/DTOs/request.dto';

@ApiTags('request-opinion')
@Controller('request')
export class RequestOpinionController {
  constructor(private readonly requestOpinionService: RequestOpinionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAdvisoryGuard)
  @Post(':requestId/opinion')
  create(
    @Request() { user },
    @Param('requestId') requestId: number,
    @Body() data: createRequestOpinionDto,
  ) {
    return this.requestOpinionService.create(user.id, requestId, data);
  }
}
