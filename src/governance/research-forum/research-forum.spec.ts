import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../common/config';
import { Logger } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { PrometheusModule } from '../../common/prometheus';
import { FetchModule } from '@lido-nestjs/fetch';
import { ResearchForumModule } from './research-forum.module';

describe('Test Research forum collecting', () => {
  let researchForumService: ResearchForumService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        ResearchForumModule,
        PrometheusModule,
        FetchModule,
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
