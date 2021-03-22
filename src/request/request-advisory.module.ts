import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestAdvisory } from '../module/entities/request/request-advisory.entity';
import { RequestAdvisoryService } from './request-advisory.service';
import { RequestOpinionModule } from './request-opinion.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestAdvisory]),
    forwardRef(() => RequestOpinionModule),
    UserModule,
  ],
  controllers: [],
  providers: [RequestAdvisoryService],
  exports: [RequestAdvisoryService],
})
export class RequestAdvisoryModule {}
