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
import { Logger } from '@nestjs/common';
import { AragonService } from '../aragon/aragon.service';
import { AragonProviderService } from '../aragon/aragon.provider.service';
import { AragonProvider } from '../aragon/aragon.provider';
import { ResearchForumService } from '../research-forum/research-forum.service';
import { ResearchForumProvider } from '../research-forum/research-forum.provider';
import { AragonConfig } from '../aragon/aragon.config';
import { SnapshotConfig } from '../snapshot/snapshot.config';
import { EasyTrackConfig } from '../easy-track/easy-track.config';

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
        EasyTrackConfig,
        NotionClientService,
        EasyTrackGraphqlService,
        PrometheusService,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    easyTrackService = moduleRef.get<EasyTrackService>(EasyTrackService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await easyTrackService.collectNewAndRefresh([185]);
    await notionReporterService.reportVotes(votes);
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
        SnapshotConfig,
        GraphqlService,
        ConfigService,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await snapshotService.collectByMaxPastDays();
    await notionReporterService.reportVotes(votes);
  }, 360000);
});

describe('Test Aragon notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let aragonService: AragonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotionReporterService,
        NotionClientService,
        PrometheusService,
        AragonService,
        AragonProvider,
        AragonProviderService,
        AragonConfig,
        ConfigService,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    aragonService = moduleRef.get<AragonService>(AragonService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await aragonService.collectNewAndRefresh([130]);
    // const votes = await aragonService.collectByMaxPastDays();
    await notionReporterService.reportVotes(votes);
  }, 360000);
});

describe('Test Research forum notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let researchForumService: ResearchForumService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotionReporterService,
        NotionClientService,
        PrometheusService,
        ConfigService,
        ResearchForumService,
        ResearchForumProvider,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    researchForumService =
      moduleRef.get<ResearchForumService>(ResearchForumService);
  });

  it('Test notion topics reporting', async () => {
    const topics = await researchForumService.collect();
    await notionReporterService.reportTopics(topics);
  }, 360000);
});
