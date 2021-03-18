import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../module/entities/navigation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  providers: [NavigationService],
  controllers: [NavigationController],
})
export class NavigationModule {}
