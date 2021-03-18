import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingCenter } from '../module/entities/training-center.entity';
import { Brackets, Repository } from 'typeorm';
import { responseOk } from '../module/common';

@Injectable()
export class TrainingCenterService {
  constructor(
    @InjectRepository(TrainingCenter)
    private trainRepository: Repository<TrainingCenter>,
  ) {}

  async index(name: string) {
    const data = await this.trainRepository
      .createQueryBuilder('t')
      .select([
        't.id id',
        't.name name',
        't.description description',
        'g.name groupName',
        'g.address groupAddress',
        'g.scale groupScale',
        'g.facilities groupFacilities',
      ])
      .innerJoin('t.group', 'g')
      .where(
        new Brackets(qb =>
          qb.orWhere('g.name like :name').orWhere('t.name like :name'),
        ),
      )
      .setParameters({ name: `%${name}%` })
      .getRawMany();

    return responseOk(data);
  }
}
