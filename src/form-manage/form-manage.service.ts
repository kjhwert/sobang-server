import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormManage } from '../module/entities/customer-service/form-manage.entity';
import { Repository } from 'typeorm';
import { createFormManageDto } from '../module/DTOs/form-manage.dto';
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
export class FormManageService {
  constructor(
    @InjectRepository(FormManage)
    private formManageRepository: Repository<FormManage>,
  ) {}

  async index(page: number) {
    const total = await this.getIndexCount();
    const paging = await pagination(page, total);

    const data = await this.formManageRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.file', 'f')
      .where('m.status = :act', { act: Code.ACT })
      .orderBy('m.id', 'DESC')
      .skip(SKIP_PAGE(page))
      .take(PER_PAGE)
      .getMany();

    return responseOk(data, paging);
  }

  async getIndexCount() {
    return this.formManageRepository
      .createQueryBuilder()
      .where('status = :act', { act: Code.ACT })
      .getCount();
  }

  async create(adminId: number, data: createFormManageDto) {
    try {
      const newForm = await this.formManageRepository.create({
        ...data,
        createdId: adminId,
        file: data.fileId,
      });
      await this.formManageRepository.save(newForm);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async destroy(adminId: number, formManageId: number) {
    try {
      await this.formManageRepository
        .createQueryBuilder()
        .update({ status: Code.DELETE, updatedId: adminId })
        .where('id = :formManageId', { formManageId })
        .execute();

      return responseDestroyed();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
