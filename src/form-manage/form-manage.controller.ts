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
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { createFormManageDto } from '../module/DTOs/form-manage.dto';
import { FormManageService } from './form-manage.service';

@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@ApiTags('form-manage')
@Controller('form-manage')
export class FormManageController {
  constructor(private readonly formManageService: FormManageService) {}
  @Get()
  index(@Query('page') page: number) {
    return this.formManageService.index(page);
  }

  @Post()
  create(@Body() data: createFormManageDto, @Request() { user }) {
    return this.formManageService.create(user.id, data);
  }

  @Delete(':formManageId')
  destroy(@Param('formManageId') formManageId: number, @Request() { user }) {
    return this.formManageService.destroy(user.id, formManageId);
  }
}
