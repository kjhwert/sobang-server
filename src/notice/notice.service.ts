import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from '../module/entities/customer-service/notice.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import {
  MAIN_INDEX_ROW,
  pagination,
  PER_PAGE,
  responseCreated,
  responseNotAcceptable,
  responseOk,
  SKIP_PAGE,
} from '../module/common';
import { createNoticeDto } from '../module/DTOs/notice.dto';

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

  async create(adminId: number, data: createNoticeDto) {
    try {
      const newNotice = await this.noticeRepository.create({
        ...data,
        createdId: adminId,
      });
      await this.noticeRepository.save(newNotice);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async destroy(adminId: number, noticeId: number) {
    try {
      await this.noticeRepository
        .createQueryBuilder()
        .update({ status: Code.DELETE, updatedId: adminId })
        .where('id = :noticeId', { noticeId })
        .execute();

      return responseOk({}, {}, '삭제 되었습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
