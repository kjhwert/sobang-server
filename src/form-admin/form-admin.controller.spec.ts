import { Test, TestingModule } from '@nestjs/testing';
import { FormAdminController } from './form-admin.controller';

describe('FormAdminController', () => {
  let controller: FormAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormAdminController],
    }).compile();

    controller = module.get<FormAdminController>(FormAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
