import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';

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
}
