import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../common/config';
import { Logger } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { PrometheusModule } from '../../common/prometheus';
import { FetchModule } from '@lido-nestjs/fetch';
import { ResearchForumModule } from './research-forum.module';
import { VoteEntity, VoteSources, VoteStatus } from '../vote.entity';

describe('Test Research forum collecting', () => {
  let researchForumService: ResearchForumService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, ResearchForumModule, PrometheusModule, FetchModule],
    }).compile();
    moduleRef.useLogger(new Logger());
    researchForumService = moduleRef.get<ResearchForumService>(ResearchForumService);
  });

  it('Test research forum topics collecting', async () => {
    const currentVote: VoteEntity = {
      source: VoteSources.snapshot,
      status: VoteStatus.closed,
      startDate: '2023-05-25T19:08:00.000Z',
      endDate: '2023-06-01T18:00:00.000Z',
      link: 'https://snapshot.org/#/lido-snapshot.eth/proposal/0x5e9ffb74b7f0e026a898301a65302345fb6dc2e09f724b9c9bec2f35902c1324',
      name: 'Launchnodes - Impact Staking with Lido',
      result1: 30281779.42867762,
      result2: 119565.96836937379,
      result3: null,
      proposalType: 'single-choice',
      discussion:
        'https://research.lido.fi/t/launchnodes-impact-staking-with-lido-grant-proposal/3732/8',
      votersNumber: 561,
      choice1: 'For',
      choice2: 'Against',
      choice3: '',
    };
    await researchForumService.notifySnapshotVoteChange('## Snapshot vote started', currentVote);

    // const posts = await researchForumService.collect();
    // expect(posts.length).toBeGreaterThan(0);
  }, 360000);
});
