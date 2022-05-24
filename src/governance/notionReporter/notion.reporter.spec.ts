import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { NotionReporterService } from './notion.reporter.service';
import { EasyTrackService } from '../easy-track/easy-track.service';
import { NotionClientService } from './notion.client.service';
import { PrometheusService } from '../../common/prometheus';
import { EasyTrackProviderService } from '../easy-track/easy-track.provider.service';
import { EasyTrackDescriptionCollector } from '../easy-track/easy-track-description-collector.service';
import { EasyTrackEventCollector } from '../easy-track/easy-track-event-collector.service';
import { EasyTrackProvider } from '../easy-track/easy-track.provider';
import { EasyTrackGraphqlService } from '../easy-track/easy-track.graphql.service';

describe('Test notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let easyTrackService: EasyTrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotionReporterService,
        ConfigService,
        EasyTrackService,
        EasyTrackProviderService,
        EasyTrackProvider,
        EasyTrackDescriptionCollector,
        EasyTrackEventCollector,
        NotionClientService,
        EasyTrackGraphqlService,
        PrometheusService,
      ],
    }).compile();
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    easyTrackService = moduleRef.get<EasyTrackService>(EasyTrackService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await easyTrackService.collectByIds([185]);
    await notionReporterService.report(votes);
  }, 360000);
});
