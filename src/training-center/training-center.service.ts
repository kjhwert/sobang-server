import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingCenter } from '../module/entities/training-center.entity';
import { Brackets, Repository } from 'typeorm';
import { responseOk } from '../module/common';
import { TrainingCenterGroup } from '../module/entities/training-center-group.entity';

@Injectable()
export class TrainingCenterService {
  constructor(
    @InjectRepository(TrainingCenterGroup)
    private groupRepository: Repository<TrainingCenterGroup>,
    @InjectRepository(TrainingCenter)
    private centerRepository: Repository<TrainingCenter>,
  ) {}

  async index(name: string) {
    const data = await this.centerRepository
      .createQueryBuilder('t')
      .select([
        't.id id',
        't.name name',
        't.description description',
        't.descriptionTag descriptionTag',
        'g.name groupName',
      ])
      .innerJoin('t.group', 'g')
      .where(
        new Brackets(qb =>
          qb
            .orWhere('g.name like :name')
            .orWhere('t.name like :name')
            .orWhere('t.description like :name'),
        ),
      )
      .setParameters({ name: `%${name}%` })
      .orderBy('t.id', 'ASC')
      .getRawMany();

    return responseOk(data);
  }

  async show(areaId: number) {
    const group = await this.groupRepository
      .createQueryBuilder()
      .select(['id', 'name', 'address', 'scale', 'facilities'])
      .where('id = :areaId', { areaId })
      .getRawOne();

    const center = await this.centerRepository
      .createQueryBuilder('c')
      .select([
        'c.id id',
        'c.name name',
        'c.description description',
        'c.descriptionTag descriptionTag',
        'f.name imageName',
        'f.path imagePath',
      ])
      .leftJoin('c.file', 'f')
      .where('c.groupId = :areaId', { areaId })
      .getRawMany();

    return responseOk({ ...group, center });
  }
}
