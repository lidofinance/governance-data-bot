import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { AragonService } from './aragon.service';
import { Logger } from '@nestjs/common';
import { AragonProviderService } from './aragon.provider.service';
import { AragonProvider } from './aragon.provider';
import { PrometheusService } from '../../common/prometheus';

describe('Test aragon collection', () => {
  let aragonService: AragonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AragonService,
        ConfigService,
        AragonProviderService,
        AragonProvider,
        PrometheusService,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    aragonService = moduleRef.get<AragonService>(AragonService);
  });

  it('Test aragon votes collection', async () => {
    await aragonService.collectByIds([120, 121]);
  }, 360000);
});
