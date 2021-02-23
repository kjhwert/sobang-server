import { Module } from '@nestjs/common';
import { TestOperationService } from './test-operation.service';
import { TestOperationController } from './test-operation.controller';

@Module({
  providers: [TestOperationService],
  controllers: [TestOperationController]
})
export class TestOperationModule {}
