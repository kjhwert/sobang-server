import { Test, TestingModule } from '@nestjs/testing';
import { TestOperationController } from './test-operation.controller';

describe('TestOperationController', () => {
  let controller: TestOperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestOperationController],
    }).compile();

    controller = module.get<TestOperationController>(TestOperationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
