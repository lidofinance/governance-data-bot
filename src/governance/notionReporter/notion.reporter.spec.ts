import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../common/config';
import { NotionReporterService } from './notion.reporter.service';
import { EasyTrackService } from '../easy-track/easy-track.service';
import { PrometheusModule } from '../../common/prometheus';
import { SnapshotService } from '../snapshot/snapshot.service';
import { Logger } from '@nestjs/common';
import { AragonService } from '../aragon/aragon.service';
import { ResearchForumService } from '../research-forum/research-forum.service';
import { ExecutionProviderModule } from '../../common/execution-provider';
import { LoggerModule } from '../../common/logger';
import { EasyTrackModule } from '../easy-track/easy-track.module';
import { NotionReporterModule } from './notion.reporter.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { AragonModule } from '../aragon/aragon.module';
import { ResearchForumModule } from '../research-forum/research-forum.module';

describe('Test EasyTrack notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let easyTrackService: EasyTrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        EasyTrackModule,
        NotionReporterModule,
      ],
      providers: [],
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
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        SnapshotModule,
        NotionReporterModule,
      ],
      providers: [],
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
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        AragonModule,
        NotionReporterModule,
      ],
      providers: [],
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
      imports: [
        ExecutionProviderModule,
        ConfigModule,
        PrometheusModule,
        LoggerModule,
        ResearchForumModule,
        NotionReporterModule,
      ],
      providers: [],
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
