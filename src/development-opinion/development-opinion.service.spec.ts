import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentOpinionService } from './development-opinion.service';

describe('DevelopmentOpinionService', () => {
  let service: DevelopmentOpinionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentOpinionService],
    }).compile();

    service = module.get<DevelopmentOpinionService>(DevelopmentOpinionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
