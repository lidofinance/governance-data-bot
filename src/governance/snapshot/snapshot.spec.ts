import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { PrometheusService } from '../../common/prometheus';

describe('Test snapshot collection', () => {
  let snapshotService: SnapshotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SnapshotService,
        SnapshotGraphqlService,
        GraphqlService,
        PrometheusService,
      ],
    }).compile();
    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
  });

  it('Test Snapshot votes collection', async () => {
    const votes = await snapshotService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
