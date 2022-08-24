import { Test, TestingModule } from '@nestjs/testing';
import { PrivateController } from './private.controller';
import { PrivateService } from './private.service';

describe('PrivateController', () => {
  let controller: PrivateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateController],
      providers: [PrivateService],
    }).compile();

    controller = module.get<PrivateController>(PrivateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
