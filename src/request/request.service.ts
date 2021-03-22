import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from '../module/entities/request/request.entity';
import { Repository } from 'typeorm';
import {
  acceptRequestDto,
  createRequestDto,
  indexRequestDto,
  refuseRequestDto,
} from '../module/DTOs/request.dto';
import {
  pagination,
  responseCreated,
  responseNotAcceptable,
  responseOk,
  responseUpdated,
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

  async show(requestId: number) {
    const data = await this.requestRepository
      .createQueryBuilder('r')
      .select([
        'r.id id',
        'r.equipmentType equipmentType',
        'r.equipmentName equipmentName',
        'r.requestType requestType',
        'r.requestPlace requestPlace',
        'r.requestStartDate requestStartDate',
        'r.requestEndDate requestEndDate',
        'r.requestTestTimes requestTestTimes',
        'r.requestEtc requestEtc',
        'r.managerName managerName',
        'r.managerPosition managerPosition',
        'r.managerContact managerContact',
        'r.managerPhone managerPhone',
        'r.managerEmail managerEmail',
        'r.refuseDescription refuseDescription',
        'r.responseStartDate responseStartDate',
        'r.responseEndDate responseEndDate',
        'f.name fileName',
        'f.path filePath',
        't.id testCodeId',
        't.description testCode',
        'r.testCodeDescription testCodeDescription',
        'p.id processId',
        'p.description process',
        'c.name trainingCenterName',
      ])
      .leftJoin('r.file', 'f')
      .leftJoin('r.testCode', 't')
      .innerJoin('r.process', 'p')
      .leftJoin('r.trainingCenter', 'c')
      .where('r.id = :requestId')
      .andWhere('r.status = :act')
      .setParameters({ requestId, act: Code.ACT })
      .getRawOne();

    const opinions = await this.requestOpinionService.getOpinionsByRequestId(
      requestId,
    );
    return responseOk({ ...data, opinions });
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

  async acceptRequest(
    adminId: number,
    requestId: number,
    data: acceptRequestDto,
  ) {
    const isCorrectProcess = await this.isCorrectProcess(
      requestId,
      Code.PROCESS_WAIT,
    );
    if (!isCorrectProcess) {
      return responseNotAcceptable('이미 처리되었습니다.');
    }

    const { advisories, testCodeId, trainingCenterId, ...rest } = data;

    try {
      await this.requestAdvisoryService.create(advisories, requestId);

      await this.requestRepository
        .createQueryBuilder()
        .update({
          ...rest,
          testCode: testCodeId,
          trainingCenter: trainingCenterId,
          updatedId: adminId,
          process: Code.PROCESS_APPROVE,
        })
        .where('id = :requestId', { requestId })
        .execute();

      return responseUpdated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async refuseRequest(
    adminId: number,
    requestId: number,
    data: refuseRequestDto,
  ) {
    const isCorrectProcess = await this.isCorrectProcess(
      requestId,
      Code.PROCESS_WAIT,
    );
    if (!isCorrectProcess) {
      return responseNotAcceptable('이미 처리되었습니다.');
    }

    try {
      await this.requestRepository
        .createQueryBuilder()
        .update({
          process: Code.PROCESS_REJECT,
          updatedId: adminId,
          ...data,
        })
        .where('id = :requestId', { requestId })
        .execute();

      return responseUpdated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async isCorrectProcess(requestId: number, processId) {
    const data = await this.requestRepository
      .createQueryBuilder()
      .select(['processId'])
      .where('status = :act')
      .andWhere('id = :requestId')
      .setParameters({ requestId, act: Code.ACT })
      .getRawOne();

    if (!data || data.processId !== processId) {
      return false;
    }

    return true;
  }
}
