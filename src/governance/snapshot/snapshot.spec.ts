import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { PrometheusService } from '../../common/prometheus';
import { ConfigService } from '../../common/config';

describe('Test snapshot collection', () => {
  let snapshotService: SnapshotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SnapshotService,
        SnapshotGraphqlService,
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
    const votes = await snapshotService.collectByIds([
      '0xa2cd54039590f84c96904b7fc057cc2fb849515496a0240efff164587ad54f13',
      '0xb93235759e74cfc925dfe4c08e6bf027e861bb003369d2254a572b0068920342',
    ]);
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
