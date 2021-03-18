import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCode } from '../module/entities/test-code.entity';
import { Repository } from 'typeorm';
import { responseOk } from '../module/common';

@Injectable()
export class TestCodeService {
  constructor(
    @InjectRepository(TestCode)
    private testCodeRepository: Repository<TestCode>,
  ) {}

  async index() {
    const data = await this.testCodeRepository.createQueryBuilder().getMany();

    return responseOk(data);
  }
}
