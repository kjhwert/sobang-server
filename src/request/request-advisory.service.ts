import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestAdvisory } from '../module/entities/request/request-advisory.entity';
import { Repository } from 'typeorm';
import { indexRequestDto } from '../module/DTOs/request.dto';
import { pagination, responseOk } from '../module/common';
import { Code } from '../module/entities/code.entity';
import { RequestOpinionService } from './request-opinion.service';

@Injectable()
export class RequestAdvisoryService {
  constructor(
    @InjectRepository(RequestAdvisory)
    private requestAdvisoryRepository: Repository<RequestAdvisory>,
    private readonly requestOpinionService: RequestOpinionService,
  ) {}

  async index(userId: number, { page, process }: indexRequestDto) {
    const total = await this.getIndexCount(userId);
    const paging = await pagination(page, total);
    const opinionCountSubQuery = await this.requestOpinionService.getOpinionsCountByRequestId();

    if (process === Code.PROCESS_ALL) {
      const data = await this.requestAdvisoryRepository
        .createQueryBuilder('a')
        .select([
          'r.id id',
          'r.equipmentName equipmentName',
          'p.id processId',
          'p.description processName',
          'r.requestStartDate requestStartDate',
          'r.createdAt createdAt',
          'ifnull(o.cnt,0) opinionCount',
        ])
        .innerJoin('a.request', 'r')
        .innerJoin('r.process', 'p')
        .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
        .where('a.userId = :userId')
        .andWhere('r.status = :act')
        .setParameters({ userId, act: Code.ACT })
        .getRawMany();

      return responseOk(data, paging);
    }

    const data = await this.requestAdvisoryRepository
      .createQueryBuilder('a')
      .select([
        'r.id id',
        'r.equipmentName equipmentName',
        'p.id processId',
        'p.description processName',
        'r.requestStartDate requestStartDate',
        'r.createdAt createdAt',
        'ifnull(o.cnt,0) opinionCount',
      ])
      .innerJoin('a.request', 'r')
      .innerJoin('r.process', 'p')
      .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
      .where('a.userId = :userId')
      .andWhere('r.status = :act')
      .andWhere('r.process = :process')
      .setParameters({ userId, act: Code.ACT, process })
      .getRawMany();

    return responseOk(data, paging);
  }

  async getIndexCount(userId: number) {
    return await this.requestAdvisoryRepository
      .createQueryBuilder()
      .where('userId = :userId')
      .setParameters({ userId })
      .getCount();
  }
}
