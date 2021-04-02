import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from '../module/entities/equipment.entity';
import { Repository } from 'typeorm';
import { responseOk } from '../module/common';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async groupIndex() {
    const data = await this.equipmentRepository
      .createQueryBuilder()
      .select(['group1'])
      .groupBy('group1')
      .getRawMany();

    return responseOk(data);
  }

  async group2Index(group1: string) {
    const data = await this.equipmentRepository
      .createQueryBuilder()
      .select(['group2'])
      .where('group1 = :group1', { group1 })
      .groupBy('group2')
      .getRawMany();

    return responseOk(data);
  }

  async group3Index(group2: string) {
    const data = await this.equipmentRepository
      .createQueryBuilder()
      .select(['group3'])
      .where('group2 = :group2', { group2 })
      .groupBy('group3')
      .getRawMany();

    return responseOk(data);
  }

  async group4Index(group3: string) {
    const data = await this.equipmentRepository
      .createQueryBuilder()
      .select(['id', 'group4'])
      .where('group3 = :group3', { group3 })
      .groupBy('group4')
      .getRawMany();

    return responseOk(data);
  }
}
