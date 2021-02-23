import { Test, TestingModule } from '@nestjs/testing';
import { FormSatisfactionService } from './form-satisfaction.service';

describe('FormSatisfactionService', () => {
  let service: FormSatisfactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSatisfactionService],
    }).compile();

    service = module.get<FormSatisfactionService>(FormSatisfactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
