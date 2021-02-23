import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentOpinionController } from './development-opinion.controller';

describe('DevelopmentOpinionController', () => {
  let controller: DevelopmentOpinionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopmentOpinionController],
    }).compile();

    controller = module.get<DevelopmentOpinionController>(DevelopmentOpinionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
