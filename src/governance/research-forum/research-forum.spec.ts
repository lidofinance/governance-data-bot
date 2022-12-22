import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { Logger } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { ResearchForumProvider } from './research-forum.provider';
import { PrometheusService } from '../../common/prometheus';
import { VoteEntity } from '../vote.entity';

describe('Test Research forum collecting', () => {
  let researchForumService: ResearchForumService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConfigService,
        ResearchForumService,
        ResearchForumProvider,
        PrometheusService,
      ],
    }).compile();
    moduleRef.useLogger(new Logger());
    researchForumService =
      moduleRef.get<ResearchForumService>(ResearchForumService);
  });

  it('Test research forum topics collecting', async () => {
    const posts = await researchForumService.collect();
    expect(posts.length).toBeGreaterThan(0);
  }, 360000);

  it.skip('[Local only] Topic posts', async () => {
    const vote: VoteEntity = {
      endDate: '',
      link: '',
      discussion: 'http://localhost:4200/t/faq-guidelines/5',
      name: '',
      source: undefined,
      startDate: '',
      status: undefined,
    };
    await researchForumService.notifySnapshotVoteChange(
      '## Snapshot vote started\n' +
        'The [Snapshot name](https://google.com) Snapshot has started! Please cast your votes before 2022-12-21T05:23:49.996Z 🙏',
      vote,
    );
  });
});
