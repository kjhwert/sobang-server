import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  acceptRequestDto,
  createRequestDto,
  indexRequestDto,
} from '../module/DTOs/request.dto';
import { RequestService } from './request.service';
import { JwtOrganizationGuard } from '../auth/jwt/jwt-organization.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Code } from '../module/entities/code.entity';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  index(@Request() { user }, @Query() { page, process }: indexRequestDto) {
    const query = {
      page: Number(page),
      process: Number(process),
    };
    if (user.type.id === Code.ADMIN) {
      return this.requestService.adminIndex(query);
    }

    if (user.type.id === Code.ORGANIZATION) {
      return this.requestService.organizationIndex(user.id, query);
    }

    return this.requestService.advisoryIndex(user.id, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtOrganizationGuard)
  @Post()
  create(@Body() data: createRequestDto, @Request() { user }) {
    return this.requestService.create(user.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Put('accept')
  acceptRequest(@Request() { user }, @Body() data: acceptRequestDto) {}

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Put('refuse')
  refuseRequest() {}
}
