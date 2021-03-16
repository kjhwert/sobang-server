import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from '../module/entities/customer-service/notice.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import {
  MAIN_INDEX_ROW,
  pagination,
  PER_PAGE,
  responseOk,
  SKIP_PAGE,
} from '../module/common';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice) private noticeRepository: Repository<Notice>,
  ) {}

  async index(page: number) {
    const total = await this.getIndexCount();
    const paging = await pagination(page, total);

    const data = await this.noticeRepository
      .createQueryBuilder()
      .select(['id', 'title', 'description', 'createdAt'])
      .where('status = :act')
      .setParameters({ act: Code.ACT })
      .orderBy('id', 'DESC')
      .offset(SKIP_PAGE(page))
      .limit(PER_PAGE)
      .getRawMany();

    return responseOk(data, paging);
  }

  async getIndexCount() {
    return await this.noticeRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .getCount();
  }

  async mainIndex() {
    const data = await this.noticeRepository
      .createQueryBuilder()
      .select(['id', 'title', 'description', 'createdAt'])
      .where('status = :act')
      .setParameters({ act: Code.ACT })
      .orderBy('id', 'DESC')
      .limit(MAIN_INDEX_ROW)
      .getRawMany();

    return responseOk(data);
  }

  async show(id: number) {
    const data = await this.noticeRepository
      .createQueryBuilder()
      .select(['id', 'title', 'description', 'createdAt'])
      .where('status = :act')
      .andWhere('id = :id')
      .setParameters({ act: Code.ACT, id })
      .getRawMany();

    return responseOk(data);
  }
}
