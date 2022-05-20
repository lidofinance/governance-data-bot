import { EasytrackService } from './easytrack.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';

describe('Test easytrack collection', () => {
  let easytrackService: EasytrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EasytrackService, ConfigService],
    }).compile();
    easytrackService = moduleRef.get<EasytrackService>(EasytrackService);
  });

  it('Test easytrack votes collection', async () => {
    const votes = await easytrackService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
