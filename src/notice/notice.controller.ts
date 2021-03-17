import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { createNoticeDto } from '../module/DTOs/notice.dto';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}
  @Get()
  index(@Query('page') page: string) {
    return this.noticeService.index(Number(page));
  }

  @Get('main')
  mainIndex() {
    return this.noticeService.mainIndex();
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.noticeService.show(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  create(@Body() data: createNoticeDto, @Request() { user }) {}
}
