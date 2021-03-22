import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestOpinion } from '../module/entities/request/request-opinion.entity';
import { Repository } from 'typeorm';
import { createRequestOpinionDto } from '../module/DTOs/request.dto';
import { responseCreated, responseNotAcceptable } from '../module/common';
import { RequestAdvisoryService } from './request-advisory.service';

@Injectable()
export class RequestOpinionService {
  constructor(
    @InjectRepository(RequestOpinion)
    private requestOpinionRepository: Repository<RequestOpinion>,
    private readonly requestAdvisoryService: RequestAdvisoryService,
  ) {}

  async create(
    userId: number,
    requestId: number,
    data: createRequestOpinionDto,
  ) {
    const isUserAssigned = await this.requestAdvisoryService.isUserAssigned(
      requestId,
      userId,
    );

    if (!isUserAssigned) {
      return responseNotAcceptable('해당 요청에 대한 권한이 없습니다.');
    }

    try {
      const newOpinion = await this.requestOpinionRepository.create({
        createdId: userId,
        user: userId,
        request: requestId,
        ...data,
      });
      await this.requestOpinionRepository.save(newOpinion);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async getOpinionsByRequestId(requestId: number) {
    return this.requestOpinionRepository
      .createQueryBuilder()
      .where('requestId = :requestId', { requestId })
      .getMany();
  }

  getOpinionsCountByRequestId() {
    return this.requestOpinionRepository
      .createQueryBuilder()
      .select(['requestId', 'COUNT(id) cnt'])
      .where('status = :act')
      .groupBy('requestId')
      .getQuery();
  }
}
