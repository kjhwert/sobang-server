import { Test, TestingModule } from '@nestjs/testing';
import { FormAdminService } from './form-admin.service';

describe('FormAdminService', () => {
  let service: FormAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormAdminService],
    }).compile();

    service = module.get<FormAdminService>(FormAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
