import { Test } from '@nestjs/testing';
import { GovernanceService } from './governance.service';
import { GovernanceModule } from './governance.module';
import { PrometheusModule } from '../common/prometheus';
import { ConfigModule } from '../common/config';
import { EasyTrackModule } from './easy-track/easy-track.module';
import { ExecutionProviderModule } from '../common/execution-provider';
import { LoggerModule } from '../common/logger';
import { NotionReporterModule } from './notionReporter/notion.reporter.module';

describe('Test governance scheduled functions', () => {
  let governanceService: GovernanceService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        EasyTrackModule,
        NotionReporterModule,
        GovernanceModule,
      ],
      providers: [],
    }).compile();
    governanceService = moduleRef.get<GovernanceService>(GovernanceService);
  });

  it('Test Snapshot votes collection', async () => {
    await governanceService.updateAragonRecords();
  }, 360000);
});
