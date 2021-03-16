import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DevelopmentOpinion } from '../module/entities/customer-service/development-opinion.entity';
import { Repository } from 'typeorm';
import { createDevOpinionDto } from '../module/DTOs/development-opinion.dto';
import { responseNotAcceptable, responseOk } from '../module/common';

@Injectable()
export class DevelopmentOpinionService {
  constructor(
    @InjectRepository(DevelopmentOpinion)
    private devOpinionRepository: Repository<DevelopmentOpinion>,
  ) {}

  async create(data: createDevOpinionDto) {
    try {
      const newOpinion = await this.devOpinionRepository.create(data);
      await this.devOpinionRepository.save(newOpinion);

      return responseOk(null, null, '등록 되었습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
