import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { PrometheusService } from '../../common/prometheus';
import { ConfigService } from '../../common/config';
import { SnapshotConfig } from './snapshot.config';
import { VoteEntity, VoteStatus } from '../vote.entity';

describe('Test snapshot collection', () => {
  let snapshotService: SnapshotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SnapshotService,
        SnapshotGraphqlService,
        SnapshotConfig,
        GraphqlService,
        PrometheusService,
        ConfigService,
      ],
    }).compile();
    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
  });

  it('Test Snapshot votes collection', async () => {
    const votes = await snapshotService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);

  it('Test Snapshot votes collection by ids', async () => {
    const votes = await snapshotService.collectNewAndRefresh([
      '0xa2cd54039590f84c96904b7fc057cc2fb849515496a0240efff164587ad54f13',
      '0xb93235759e74cfc925dfe4c08e6bf027e861bb003369d2254a572b0068920342',
    ]);
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});

describe('Test snapshot messages', () => {
  let snapshotService: SnapshotService;
  let snapshotGraphqlService: SnapshotGraphqlService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SnapshotService,
        SnapshotGraphqlService,
        SnapshotConfig,
        GraphqlService,
        PrometheusService,
        ConfigService,
      ],
    }).compile();
    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
    snapshotGraphqlService = moduleRef.get<SnapshotGraphqlService>(
      SnapshotGraphqlService,
    );
  });

  it('test none to active', async () => {
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: new Date().toISOString(),
      status: VoteStatus.active,
    };
    const message = await snapshotService.getChangesMessage([], currentVote);
    expect(message).toMatch('start');
  });

  it('test none to stale active', async () => {
    const hoursAgo = new Date();
    hoursAgo.setHours(new Date().getHours() - 6);
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: hoursAgo.toISOString(),
      status: VoteStatus.active,
    };
    const message = await snapshotService.getChangesMessage([], currentVote);
    expect(message).toBeUndefined();
  });

  it('test active to pending', async () => {
    const previousVote: VoteEntity = {
      endDate: '',
      link: 'https://google.com',
      name: '',
      source: undefined,
      startDate: '',
      status: VoteStatus.pending,
    };
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: '',
      status: VoteStatus.active,
    };
    const message = await snapshotService.getChangesMessage(
      [previousVote],
      currentVote,
    );
    expect(message).toMatch('start');
  });

  it('test active to success', async () => {
    const previousVote: VoteEntity = {
      endDate: '',
      link: 'https://google.com',
      name: '',
      source: undefined,
      startDate: '',
      status: VoteStatus.active,
    };
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: '',
      result1: 100e6,
      result2: 10e6,
      choices: ['yay', 'nay'],
      status: VoteStatus.closed,
    };
    const message = await snapshotService.getChangesMessage(
      [previousVote],
      currentVote,
    );
    expect(message).toMatch(/passed|reached/);
  });

  it('test active to rejected', async () => {
    const previousVote: VoteEntity = {
      endDate: '',
      link: 'https://google.com',
      name: '',
      source: undefined,
      startDate: '',
      status: VoteStatus.active,
    };
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: '',
      result1: 10e6,
      result2: 100e6,
      choices: ['yay', 'nay'],
      status: VoteStatus.closed,
    };
    const message = await snapshotService.getChangesMessage(
      [previousVote],
      currentVote,
    );
    expect(message).toMatch(/against|rejected/);
  });

  it('test active to quorum not reached', async () => {
    const previousVote: VoteEntity = {
      endDate: '',
      link: 'https://google.com',
      name: '',
      source: undefined,
      startDate: '',
      status: VoteStatus.active,
    };
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: '',
      result1: 10,
      result2: 100,
      choices: ['yay', 'nay'],
      status: VoteStatus.closed,
    };
    const message = await snapshotService.getChangesMessage(
      [previousVote],
      currentVote,
    );
    expect(message).toMatch(/quorum/);
  });
  it('test active to closed with non-known choices', async () => {
    const previousVote: VoteEntity = {
      endDate: '',
      link: 'https://google.com',
      name: '',
      source: undefined,
      startDate: '',
      status: VoteStatus.active,
    };
    const currentVote: VoteEntity = {
      endDate: new Date().toISOString(),
      link: 'https://google.com',
      name: 'Snapshot name',
      source: undefined,
      startDate: '',
      result1: 10e6,
      result2: 20e6,
      result3: 30e6,
      choices: ['red', 'green', 'blue'],
      status: VoteStatus.closed,
    };
    const message = await snapshotService.getChangesMessage(
      [previousVote],
      currentVote,
    );
    expect(message).toMatch(/concluded|completed|participated/);
  });

  it('test quorum on real vote', async () => {
    const votes = await snapshotService.buildVotesFromProposals(
      await snapshotGraphqlService.getPastProposalsByIds([
        '0x8bbd48f0e77b8035ed5c249a2716ea950d5196c121d972eb73fc44adfa664718',
      ]),
    );
    expect(snapshotService.hasQuorumReached(votes[0])).toBeFalsy();
  });
});
