import { Test, TestingModule } from '@nestjs/testing';
import { FormSatisfactionController } from './form-satisfaction.controller';

describe('FormSatisfactionController', () => {
  let controller: FormSatisfactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormSatisfactionController],
    }).compile();

    controller = module.get<FormSatisfactionController>(FormSatisfactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
