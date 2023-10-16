import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { PrometheusModule } from '../../common/prometheus';
import { ConfigModule } from '../../common/config';
import { SnapshotModule } from './snapshot.module';

describe('Test snapshot collection', () => {
  let snapshotService: SnapshotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SnapshotModule, PrometheusModule, ConfigModule],
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

  it('Test Snapshot votes collection by ids with spam flagged', async () => {
    const votes = await snapshotService.collectNewAndRefresh([
      '0x1c8f0090d6fd106f237f6d30fc8417afc61315aadc400bc1748863b1b1eb25bb',
    ]);
    expect(votes.length).toBe(0);
  }, 360000);

});
