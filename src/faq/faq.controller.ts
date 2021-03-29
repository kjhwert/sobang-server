import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { createFaqDto, indexFaqDto } from '../module/DTOs/faq.dto';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  @Get()
  index(@Query() { page }: indexFaqDto) {
    if (page) {
      return this.faqService.pagingIndex(page);
    }

    return this.faqService.index();
  }

  @Get('main')
  mainIndex() {
    return this.faqService.mainIndex();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  create(@Body() data: createFaqDto, @Request() { user }) {
    return this.faqService.create(user.id, data);
  }

  @Delete(':faqId')
  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  destroy(@Param('faqId') faqId: number, @Request() { user }) {
    return this.faqService.destroy(user.id, faqId);
  }
}
