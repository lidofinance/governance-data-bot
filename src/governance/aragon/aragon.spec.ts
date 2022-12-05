import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../common/config';
import { AragonService } from './aragon.service';
import { Logger } from '@nestjs/common';
import { PrometheusModule } from '../../common/prometheus';
import { formatDescription } from './aragon.helpers';
import { ExecutionProviderModule } from '../../common/execution-provider';
import { LoggerModule } from '../../common/logger';
import { AragonModule } from './aragon.module';

describe('Test aragon collection', () => {
  let aragonService: AragonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        AragonModule,
      ],
      providers: [],
    }).compile();
    moduleRef.useLogger(new Logger());
    aragonService = moduleRef.get<AragonService>(AragonService);
  });

  it('Test aragon votes collection', async () => {
    await aragonService.collectByMaxPastDays();
  }, 360000);
});

it('Test description formatting', () => {
  let desc = formatDescription('Omnibus vote: 1) first;2) second;3) third');
  expect(desc).toEqual('Omnibus vote:\n1) first;\n2) second;\n3) third');

  desc = formatDescription("('Omnibus vote: 1) first', '2) second')");
  expect(desc).toEqual('Omnibus vote:\n1) first\n2) second');
});
