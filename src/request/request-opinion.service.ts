import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestOpinion } from '../module/entities/request/request-opinion.entity';
import { Repository } from 'typeorm';
import { createRequestOpinionDto } from '../module/DTOs/request.dto';
import { responseCreated, responseNotAcceptable } from '../module/common';
import { RequestAdvisoryService } from './request-advisory.service';
import { RequestService } from './request.service';
import { Code } from '../module/entities/code.entity';

@Injectable()
export class RequestOpinionService {
  constructor(
    @InjectRepository(RequestOpinion)
    private requestOpinionRepository: Repository<RequestOpinion>,
    private readonly requestAdvisoryService: RequestAdvisoryService,
    @Inject(forwardRef(() => RequestService))
    private readonly requestService: RequestService,
  ) {}

  async create(
    userId: number,
    requestId: number,
    data: createRequestOpinionDto,
  ) {
    await this.requestService.isCorrectProcess(requestId, [
      Code.PROCESS_APPROVE,
      Code.PROCESS_COMPLETE,
    ]);
    await this.requestAdvisoryService.isUserAssigned(requestId, userId);
    await this.isUserAlreadyRegistered(requestId, userId);

    try {
      const newOpinion = await this.requestOpinionRepository.create({
        createdId: userId,
        user: userId,
        request: requestId,
        ...data,
      });
      await this.requestOpinionRepository.save(newOpinion);
      await this.requestService.changeProcessCompleteWhenItApproved(requestId);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async isUserAlreadyRegistered(requestId: number, userId: number) {
    const count = await this.requestOpinionRepository
      .createQueryBuilder()
      .where('requestId = :requestId')
      .andWhere('userId = :userId')
      .setParameters({ requestId, userId })
      .getCount();

    if (count > 0) {
      throw new NotAcceptableException('', '이미 등록되었습니다.');
    }
  }

  isUserRegisteredOpinionSubQuery() {
    return this.requestOpinionRepository
      .createQueryBuilder()
      .select(['id', 'requestId', 'userId'])
      .where('userId = :userId')
      .getQuery();
  }

  async getOpinionsByRequestId(requestId: number) {
    return this.requestOpinionRepository
      .createQueryBuilder()
      .where('requestId = :requestId', { requestId })
      .getMany();
  }

  async getOpinionsAdminByRequestId(requestId: number) {
    return this.requestOpinionRepository
      .createQueryBuilder('o')
      .select([
        'o.id id',
        'o.description description',
        'o.createdAt createdAt',
        'u.name name',
      ])
      .innerJoin('o.user', 'u')
      .where('o.requestId = :requestId', { requestId })
      .getRawMany();
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
