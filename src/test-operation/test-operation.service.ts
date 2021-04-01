import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestOperation } from '../module/entities/customer-service/test-operation.entity';
import { Repository } from 'typeorm';
import { createTestOperationDto } from '../module/DTOs/test-opration.dto';
import {
  pagination,
  PER_PAGE,
  responseCreated,
  responseDestroyed,
  responseNotAcceptable,
  responseOk,
  SKIP_PAGE,
} from '../module/common';
import { Code } from '../module/entities/code.entity';

@Injectable()
export class TestOperationService {
  constructor(
    @InjectRepository(TestOperation)
    private testRepository: Repository<TestOperation>,
  ) {}

  async index(page: number) {
    const total = await this.getIndexCount();
    const paging = await pagination(page, total);

    const data = await this.testRepository
      .createQueryBuilder()
      .select([
        'id',
        'title',
        'description',
        'manager',
        'operationName',
        'createdAt',
      ])
      .where('status = :act', { act: Code.ACT })
      .orderBy('id', 'DESC')
      .offset(SKIP_PAGE(page))
      .limit(PER_PAGE)
      .getRawMany();

    return responseOk(data, paging);
  }

  async getIndexCount() {
    return this.testRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .getCount();
  }

  async show(testOperationId: number) {
    const data = await this.testRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.file', 'f')
      .where('t.id = :testOperationId')
      .andWhere('t.status = :act')
      .setParameters({ testOperationId, act: Code.ACT })
      .getOne();

    return responseOk(data);
  }

  async create(adminId: number, data: createTestOperationDto) {
    try {
      const newTest = await this.testRepository.create({
        ...data,
        file: data.fileId,
        createdId: adminId,
      });
      await this.testRepository.save(newTest);
      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async destroy(adminId: number, testOperationId: number) {
    try {
      await this.testRepository
        .createQueryBuilder()
        .update({ status: Code.DELETE, updatedId: adminId })
        .where('id = :testOperationId', { testOperationId })
        .execute();

      return responseDestroyed();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
