import { EasyTrackService } from './easy-track.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';
import { EasyTrackProvider } from './easy-track.provider';
import { EasyTrackConfig } from './easy-track.config';
import { EasyTrackProviderService } from './easy-track.provider.service';
import { EasyTrackGraphqlService } from './easy-track.graphql.service';
import { PrometheusService } from '../../common/prometheus';

describe('Test easyTrack collection', () => {
  let easyTrackService: EasyTrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EasyTrackService,
        EasyTrackDescriptionCollector,
        EasyTrackEventCollector,
        EasyTrackProvider,
        EasyTrackProviderService,
        EasyTrackGraphqlService,
        EasyTrackConfig,
        ConfigService,
        PrometheusService,
      ],
    }).compile();
    easyTrackService = moduleRef.get<EasyTrackService>(EasyTrackService);
  });

  it('Test easyTrack votes collection', async () => {
    const votes = await easyTrackService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
