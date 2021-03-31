import { Module } from '@nestjs/common';
import { TestOperationService } from './test-operation.service';
import { TestOperationController } from './test-operation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestOperation } from '../module/entities/customer-service/test-operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestOperation])],
  providers: [TestOperationService],
  controllers: [TestOperationController],
})
export class TestOperationModule {}
