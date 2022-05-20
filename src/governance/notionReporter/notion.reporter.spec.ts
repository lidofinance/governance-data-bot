import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { NotionReporterService } from './notion.reporter.service';
import { EasytrackService } from '../easytrack/easytrack.service';
import { NotionClientService } from './notion.client.service';
import { PrometheusService } from '../../common/prometheus';
import { EasytrackProviderService } from '../easytrack/easytrack.provider.service';

describe('Test notion reporting', () => {
  let notionReporterService: NotionReporterService;
  let easytrackService: EasytrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotionReporterService,
        ConfigService,
        EasytrackService,
        EasytrackProviderService,
        NotionClientService,
        PrometheusService,
      ],
    }).compile();
    notionReporterService = moduleRef.get<NotionReporterService>(
      NotionReporterService,
    );
    easytrackService = moduleRef.get<EasytrackService>(EasytrackService);
  });

  it('Test notion votes reporting', async () => {
    const votes = await easytrackService.collectByIds([185]);
    await notionReporterService.report(votes);
  }, 360000);
});
