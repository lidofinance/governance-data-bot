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
import { SnapshotService } from '../snapshot/snapshot.service';
import { SnapshotGraphqlService } from '../snapshot/snapshot.graphql.service';
import { GraphqlService } from '../../common/graphql/graphql.service';

describe('Test EasyTrack notion reporting', () => {
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

describe('Test Snapshot notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let snapshotService: SnapshotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotionReporterService,
        NotionClientService,
        PrometheusService,
        SnapshotService,
        SnapshotGraphqlService,
        GraphqlService,
        ConfigService,
      ],
    }).compile();
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await snapshotService.collectByMaxPastDays();
    await notionReporterService.report(votes);
  }, 360000);
});
