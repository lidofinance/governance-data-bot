import { EasyTrackService } from './easy-track.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '../../common/config';

describe('Test easyTrack collection', () => {
  let easyTrackService: EasyTrackService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EasyTrackService, ConfigService],
    }).compile();
    easyTrackService = moduleRef.get<EasyTrackService>(EasyTrackService);
  });

  it('Test easyTrack votes collection', async () => {
    const votes = await easyTrackService.collectByMaxPastDays();
    expect(votes.length).toBeGreaterThan(0);
  }, 360000);
});
