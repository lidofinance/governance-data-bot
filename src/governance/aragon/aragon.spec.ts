import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { AragonService } from './aragon.service';
import { Logger } from '@nestjs/common';
import { AragonProviderService } from './aragon.provider.service';
import { AragonProvider } from './aragon.provider';
import { PrometheusService } from '../../common/prometheus';
import { formatDescription } from './aragon.helpers';

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
    await aragonService.collectNewAndRefresh([120, 121]);
  }, 360000);
});

it('Test description formatting', () => {
  let desc = formatDescription('Omnibus vote: 1) first;2) second;3) third');
  expect(desc).toEqual('Omnibus vote:\n1) first;\n2) second;\n3) third');

  desc = formatDescription("('Omnibus vote: 1) first', '2) second')");
  expect(desc).toEqual('Omnibus vote:\n1) first\n2) second');
});
