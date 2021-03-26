import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DevelopmentOpinion } from '../module/entities/customer-service/development-opinion.entity';
import { Repository } from 'typeorm';
import { createDevOpinionDto } from '../module/DTOs/development-opinion.dto';
import {
  pagination,
  responseCreated,
  responseNotAcceptable,
  responseOk,
} from '../module/common';
import { Code } from '../module/entities/code.entity';

@Injectable()
export class DevelopmentOpinionService {
  constructor(
    @InjectRepository(DevelopmentOpinion)
    private devOpinionRepository: Repository<DevelopmentOpinion>,
  ) {}

  async index(page: number) {
    const total = await this.getIndexCount();
    const paging = await pagination(page, total);

    const data = await this.devOpinionRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .orderBy('id', 'DESC')
      .getMany();

    return responseOk(data, paging);
  }

  async getIndexCount() {
    return await this.devOpinionRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .getCount();
  }

  async show(opinionId: number) {
    const data = await this.devOpinionRepository
      .createQueryBuilder()
      .where('id = :opinionId', { opinionId })
      .getOne();

    return responseOk(data);
  }

  async create(data: createDevOpinionDto) {
    try {
      const newOpinion = await this.devOpinionRepository.create(data);
      await this.devOpinionRepository.save(newOpinion);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
