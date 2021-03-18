import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Navigation } from '../module/entities/navigation.entity';
import { Repository } from 'typeorm';
import {
  responseNotAcceptable,
  responseOk,
  responseUpdated,
} from '../module/common';
import { updateNavigationDto } from '../module/DTOs/navigation.dto';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
  ) {}

  async index() {
    const data = await this.navigationRepository.createQueryBuilder().getMany();

    return responseOk(data);
  }

  async update(id: number, data: updateNavigationDto) {
    try {
      await this.navigationRepository
        .createQueryBuilder()
        .update({ ...data })
        .where('id = :id', { id })
        .execute();

      return responseUpdated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
