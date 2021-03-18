import { PickType } from '@nestjs/swagger';
import { Navigation } from '../entities/navigation.entity';

export class updateNavigationDto extends PickType(Navigation, [
  'name',
  'url',
]) {}
