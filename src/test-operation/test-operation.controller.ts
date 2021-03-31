import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TestOperationService } from './test-operation.service';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { createTestOperationDto } from '../module/DTOs/test-opration.dto';

@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@ApiTags('test-operation')
@Controller('test-operation')
export class TestOperationController {
  constructor(private readonly testOperationService: TestOperationService) {}

  @Get()
  index(@Query('page') page: number) {
    return this.testOperationService.index(page);
  }

  @Get(':testOperationId')
  show(@Param('testOperationId') testOperationId: number) {
    return this.testOperationService.show(testOperationId);
  }

  @Post()
  create(@Body() data: createTestOperationDto, @Request() { user }) {
    return this.testOperationService.create(user.id, data);
  }

  @Delete(':testOperationId')
  destroy(
    @Param('testOperationId') testOperationId: number,
    @Request() { user },
  ) {
    return this.testOperationService.destroy(user.id, testOperationId);
  }
}
