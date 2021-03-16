import { PickType } from '@nestjs/swagger';
import { DevelopmentOpinion } from '../entities/customer-service/development-opinion.entity';

export class createDevOpinionDto extends PickType(DevelopmentOpinion, [
  'title',
  'description',
]) {}
