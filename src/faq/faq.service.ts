import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from '../module/entities/customer-service/faq.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import {
  MAIN_INDEX_ROW,
  responseCreated,
  responseNotAcceptable,
  responseOk,
} from '../module/common';
import { createFaqDto } from '../module/DTOs/faq.dto';

@Injectable()
export class FaqService {
  constructor(@InjectRepository(Faq) private faqRepository: Repository<Faq>) {}

  async index() {
    const data = await this.faqRepository
      .createQueryBuilder()
      .select(['id', 'request', 'response'])
      .where('status = :act')
      .setParameters({ act: Code.ACT })
      .orderBy('id', 'DESC')
      .getRawMany();

    return responseOk(data);
  }

  async mainIndex() {
    const data = await this.faqRepository
      .createQueryBuilder()
      .select(['id', 'request', 'response'])
      .where('status = :act')
      .setParameters({ act: Code.ACT })
      .orderBy('id', 'DESC')
      .limit(MAIN_INDEX_ROW)
      .getRawMany();

    return responseOk(data);
  }

  async create(adminId: number, data: createFaqDto) {
    try {
      const newFaq = await this.faqRepository.create({
        ...data,
        createdId: adminId,
      });
      await this.faqRepository.save(newFaq);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async destroy(adminId: number, faqId: number) {
    try {
      await this.faqRepository
        .createQueryBuilder()
        .update({ status: Code.DELETE, updatedId: adminId })
        .where('id = :faqId', { faqId })
        .execute();

      return responseOk({}, {}, '삭제 되었습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
