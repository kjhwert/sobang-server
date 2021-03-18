import { Module } from '@nestjs/common';
import { TestCodeService } from './test-code.service';
import { TestCodeController } from './test-code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCode } from '../module/entities/test-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestCode])],
  providers: [TestCodeService],
  controllers: [TestCodeController],
})
export class TestCodeModule {}
