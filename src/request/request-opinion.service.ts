import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestOpinion } from '../module/entities/request/request-opinion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RequestOpinionService {
  constructor(
    @InjectRepository(RequestOpinion)
    private requestOpinionRepository: Repository<RequestOpinion>,
  ) {}

  getOpinionsCountByRequestId() {
    return this.requestOpinionRepository
      .createQueryBuilder()
      .select(['requestId', 'COUNT(id) cnt'])
      .where('status = :act')
      .groupBy('requestId')
      .getQuery();
  }

  getOpinionsSubQueryByUserId() {}
}
