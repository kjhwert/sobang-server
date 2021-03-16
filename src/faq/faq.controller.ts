import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  @Get()
  index() {
    return this.faqService.index();
  }

  @Get('main')
  mainIndex() {
    return this.faqService.mainIndex();
  }
}
