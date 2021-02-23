import { Test, TestingModule } from '@nestjs/testing';
import { TestOperationService } from './test-operation.service';

describe('TestOperationService', () => {
  let service: TestOperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestOperationService],
    }).compile();

    service = module.get<TestOperationService>(TestOperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
