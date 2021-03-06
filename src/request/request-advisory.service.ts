import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestAdvisory } from '../module/entities/request/request-advisory.entity';
import { Repository } from 'typeorm';
import { indexRequestDto } from '../module/DTOs/request.dto';
import { pagination, responseOk } from '../module/common';
import { Code } from '../module/entities/code.entity';
import { RequestOpinionService } from './request-opinion.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RequestAdvisoryService {
  constructor(
    @InjectRepository(RequestAdvisory)
    private requestAdvisoryRepository: Repository<RequestAdvisory>,
    @Inject(forwardRef(() => RequestOpinionService))
    private readonly requestOpinionService: RequestOpinionService,
    private readonly userService: UserService,
  ) {}

  async index(userId: number, { page, process }: indexRequestDto) {
    const total = await this.getIndexCount(userId);
    const paging = await pagination(page, total);
    const opinionCountSubQuery = await this.requestOpinionService.getOpinionsCountByRequestId();
    const userRegisteredOpinionSubQuery = await this.requestOpinionService.isUserRegisteredOpinionSubQuery();

    if (process === Code.PROCESS_ALL) {
      const data = await this.requestAdvisoryRepository
        .createQueryBuilder('a')
        .select([
          'r.id id',
          'r.equipmentName equipmentName',
          'p.id processId',
          'p.description processName',
          'r.requestStartDate requestStartDate',
          'r.responseStartDate responseStartDate',
          'r.responseEndDate responseEndDate',
          'r.createdAt createdAt',
          'if(ur.id is not null, true, false) isOpinionRegistered',
          'ifnull(o.cnt,0) opinionCount',
        ])
        .innerJoin('a.request', 'r')
        .innerJoin('r.process', 'p')
        .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
        .leftJoin(
          `(${userRegisteredOpinionSubQuery})`,
          'ur',
          'r.id = ur.requestId',
        )
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
        'r.responseStartDate responseStartDate',
        'r.responseEndDate responseEndDate',
        'r.createdAt createdAt',
        'if(ur.id is not null, true, false) isOpinionRegistered',
        'ifnull(o.cnt,0) opinionCount',
      ])
      .innerJoin('a.request', 'r')
      .innerJoin('r.process', 'p')
      .leftJoin(`(${opinionCountSubQuery})`, 'o', 'r.id = o.requestId')
      .leftJoin(
        `(${userRegisteredOpinionSubQuery})`,
        'ur',
        'r.id = ur.requestId',
      )
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

  async create(advisories: number[], requestId: number) {
    try {
      await Promise.all(
        advisories.map(async userId => {
          const user = await this.userService.findById(userId);
          // TODO user type??? Code Object??? ????????? ?????????, number??? ????????? ??????????????? ??????..!
          // @ts-ignore
          if (!user || user.type.id !== Code.ADVISORY) {
            throw new Error();
          }
          const newAdvisory = await this.requestAdvisoryRepository.create({
            user: userId,
            request: requestId,
          });
          await this.requestAdvisoryRepository.save(newAdvisory);
        }),
      );
    } catch (e) {
      throw new BadRequestException(
        '',
        '????????? ????????? ???????????? ???????????? ?????? ???????????????.',
      );
    }
  }

  async isUserAssigned(
    requestId: number,
    userId: number,
  ): Promise<Error | void> {
    const result = await this.requestAdvisoryRepository
      .createQueryBuilder()
      .where('requestId = :requestId')
      .andWhere('userId = :userId')
      .setParameters({ requestId, userId })
      .getOne();

    if (!result || !result.id) {
      throw new NotAcceptableException('', '?????? ????????? ?????? ????????? ????????????.');
    }
  }
}
