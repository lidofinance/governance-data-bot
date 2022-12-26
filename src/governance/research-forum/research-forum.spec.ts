import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';
import { Logger } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { ResearchForumProvider } from './research-forum.provider';
import { PrometheusService } from '../../common/prometheus';

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
});
