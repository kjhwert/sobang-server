import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from '../module/entities/customer-service/faq.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import { MAIN_INDEX_ROW, responseOk } from '../module/common';

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
}
