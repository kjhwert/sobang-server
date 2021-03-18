import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestCodeService } from './test-code.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('test-code')
@Controller('test-code')
export class TestCodeController {
  constructor(private readonly testCodeService: TestCodeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get()
  index() {
    return this.testCodeService.index();
  }
}
