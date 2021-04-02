import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
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
          'r.responseStartDate startDate',
          'ifnull(o.cnt,0) opinionCount',
          'u.businessName businessName',
          'u.businessOwner businessOwner',
          'e.group4 equipmentCode',
        ])
        .innerJoin('r.user', 'u')
        .innerJoin('r.process', 'p')
        .leftJoin('r.equipment', 'e')
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
        'r.responseStartDate startDate',
        'ifnull(o.cnt,0) opinionCount',
        'u.businessName businessName',
        'u.businessOwner businessOwner',
        'e.group4 equipmentCode',
      ])
      .innerJoin('r.user', 'u')
      .innerJoin('r.process', 'p')
      .leftJoin('r.equipment', 'e')
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

  async show(userId: number, requestId: number) {
    const userRegisteredOpinionSubQuery = await this.requestOpinionService.isUserRegisteredOpinionSubQuery();

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
        'u.businessName businessName',
        'u.businessOwner businessOwner',
        'u.businessNo businessNo',
        'if(ur.id is not null, true, false) isOpinionRegistered',
        'e.group4 equipmentCode',
      ])
      .leftJoin('r.file', 'f')
      .leftJoin('r.testCode', 't')
      .leftJoin(
        `(${userRegisteredOpinionSubQuery})`,
        'ur',
        'r.id = ur.requestId',
      )
      .leftJoin('r.equipment', 'e')
      .innerJoin('r.process', 'p')
      .innerJoin('r.user', 'u')
      .leftJoin('r.trainingCenter', 'c')
      .where('r.id = :requestId')
      .andWhere('r.status = :act')
      .setParameters({ requestId, act: Code.ACT, userId })
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
        file: data.fileId ? data.fileId : null,
        equipment: data.equipmentId ? data.equipmentId : null,
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
    await this.isCorrectProcess(requestId, [Code.PROCESS_WAIT]);

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
    await this.isCorrectProcess(requestId, [Code.PROCESS_WAIT]);

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

  async changeProcessCompleteWhenItApproved(requestId: number) {
    const data = await this.requestRepository
      .createQueryBuilder()
      .select(['processId'])
      .where('status = :act')
      .andWhere('id = :requestId')
      .setParameters({ requestId, act: Code.ACT })
      .getRawOne();

    if (!data || !data.processId) {
      throw new NotAcceptableException('', '올바르지 않은 접근입니다.');
    }

    if (data.processId === Code.PROCESS_COMPLETE) {
      return;
    }

    try {
      await this.requestRepository
        .createQueryBuilder()
        .update({ process: Code.PROCESS_COMPLETE })
        .where('id = :requestId', { requestId })
        .execute();
    } catch (e) {
      throw new NotAcceptableException('', e.message);
    }
  }

  async isCorrectProcess(
    requestId: number,
    process: number[],
  ): Promise<Error | void> {
    const data = await this.requestRepository
      .createQueryBuilder()
      .select(['processId'])
      .where('status = :act')
      .andWhere('id = :requestId')
      .setParameters({ requestId, act: Code.ACT })
      .getRawOne();

    if (!data || !data.processId || !process.includes(data.processId)) {
      throw new NotAcceptableException('', '올바르지 않은 접근입니다.');
    }
  }
}
