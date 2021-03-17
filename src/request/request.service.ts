import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from '../module/entities/request/request.entity';
import { Repository } from 'typeorm';
import { createRequestDto, indexRequestDto } from '../module/DTOs/request.dto';
import {
  pagination,
  responseCreated,
  responseNotAcceptable,
  responseOk,
} from '../module/common';
import { Code } from '../module/entities/code.entity';
import { RequestOpinionService } from './request-opinion.service';
import { RequestAdvisoryService } from './request-advisory.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    private readonly requestOpinionService: RequestOpinionService,
    private readonly requestAdvisoryService: RequestAdvisoryService,
  ) {}

  async adminIndex({ process, page }: indexRequestDto) {
    const total = await this.getAdminIndexCount();
    const paging = await pagination(page, total);
    const opinionCountSubQuery = await this.requestOpinionService.getOpinionsCountByRequestId();

    if (process === Code.PROCESS_ALL) {
      const data = await this.requestRepository
        .createQueryBuilder('r')
        .select([
          'r.id id',
          'r.equipmentName equipmentName',
          'p.id processId',
          'p.description processName',
          'r.requestStartDate requestStartDate',
          'r.createdAt createdAt',
          'ifnull(o.cnt,0) opinionCount',
        ])
        .innerJoin('r.process', 'p')
        .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
        .where('r.status = :act')
        .setParameters({ act: Code.ACT })
        .orderBy('r.id', 'DESC')
        .getRawMany();

      return responseOk(data, paging);
    }
    const data = await this.requestRepository
      .createQueryBuilder('r')
      .select([
        'r.id id',
        'r.equipmentName equipmentName',
        'p.id processId',
        'p.description processName',
        'r.requestStartDate requestStartDate',
        'r.createdAt createdAt',
        'ifnull(o.cnt,0) opinionCount',
      ])
      .innerJoin('r.process', 'p')
      .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
      .where('r.status = :act')
      .andWhere('r.process = :process')
      .setParameters({ act: Code.ACT, process })
      .orderBy('r.id', 'DESC')
      .getRawMany();

    return responseOk(data, paging);
  }

  async getAdminIndexCount(): Promise<number> {
    return await this.requestRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .getCount();
  }

  async organizationIndex(userId: number, { page, process }: indexRequestDto) {
    const total = await this.getOrganizationIndexCount(userId);
    const paging = await pagination(page, total);

    const opinionCountSubQuery = await this.requestOpinionService.getOpinionsCountByRequestId();

    if (process === Code.PROCESS_ALL) {
      const data = await this.requestRepository
        .createQueryBuilder('r')
        .select([
          'r.id id',
          'r.equipmentName equipmentName',
          'p.id processId',
          'p.description processName',
          'r.requestStartDate requestStartDate',
          'r.createdAt createdAt',
          'ifnull(o.cnt,0) opinionCount',
        ])
        .innerJoin('r.process', 'p')
        .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
        .where('r.status = :act')
        .andWhere('r.userId = :userId')
        .setParameters({ act: Code.ACT, userId })
        .orderBy('r.id', 'DESC')
        .getRawMany();

      return responseOk(data, paging);
    }
    const data = await this.requestRepository
      .createQueryBuilder('r')
      .select([
        'r.id id',
        'r.equipmentName equipmentName',
        'p.id processId',
        'p.description processName',
        'r.requestStartDate requestStartDate',
        'r.createdAt createdAt',
        'ifnull(o.cnt,0) opinionCount',
      ])
      .innerJoin('r.process', 'p')
      .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
      .where('r.status = :act')
      .andWhere('r.process = :process')
      .andWhere('r.userId = :userId')
      .setParameters({ act: Code.ACT, process, userId })
      .orderBy('r.id', 'DESC')
      .getRawMany();

    return responseOk(data, paging);
  }

  async getOrganizationIndexCount(userId: number) {
    return await this.requestRepository
      .createQueryBuilder()
      .where('status = :act')
      .andWhere('userId = :userId')
      .setParameters({ act: Code.ACT, userId })
      .getCount();
  }

  async advisoryIndex(userId: number, query: indexRequestDto) {
    return this.requestAdvisoryService.index(userId, query);
  }

  async create(userId: number, data: createRequestDto) {
    try {
      const newRequest = await this.requestRepository.create({
        ...data,
        user: userId,
        createdId: userId,
      });
      await this.requestRepository.save(newRequest);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
