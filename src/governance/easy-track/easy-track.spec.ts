import { EasyTrackService } from './easy-track.service';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../common/config';
import { PrometheusModule } from '../../common/prometheus';
import { ExecutionProviderModule } from '../../common/execution-provider';
import { EasyTrackModule } from './easy-track.module';
import { LoggerModule } from '../../common/logger';
import { EtherscanProviderModule } from '../../common/etherscan-provider';

describe('Test easyTrack collection', () => {
  let easyTrackService: EasyTrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        EasyTrackModule,
        EtherscanProviderModule,
      ],
      providers: [],
    }).compile();
    easyTrackService = moduleRef.get<EasyTrackService>(EasyTrackService);
  });

  it('Test easyTrack votes collection', async () => {
    const votes = await easyTrackService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
