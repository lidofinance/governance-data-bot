import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import {
  EASYTRACK_CONTRACT_ABI,
  EASYTRACK_CONTRACT_ADDRESS,
} from './easy-track.constants';
import { formatDate, VoteEntity, VoteSources } from '../vote.entity';
import {
  eventAndDurationInfoToStatus,
  getEasyTrackType,
  templateMotionLink,
} from './easy-track.helpers';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';
import { EasyTrackProvider } from './easy-track.provider';

const MAX_PAST_DAYS_MOTIONS_FETCH = 14;

@Injectable()
export class EasyTrackService {
  constructor(
    protected readonly configService: ConfigService,
    private readonly descriptionCollector: EasyTrackDescriptionCollector,
    private readonly eventCollector: EasyTrackEventCollector,
    private readonly easyTrackProvider: EasyTrackProvider,
  ) {}

  async collectByMaxPastDays(): Promise<VoteEntity[]> {
    // TODO motions should be fetched from events and rpc node historic data
    const contract = await this.easyTrackProvider.getContract(
      EASYTRACK_CONTRACT_ADDRESS,
      EASYTRACK_CONTRACT_ABI,
    );
    const activeMotions = await contract.getMotions();
    const date =
      (new Date().setDate(new Date().getDate() - MAX_PAST_DAYS_MOTIONS_FETCH) /
        1000) |
      0;
    const pastMotions = await this.easyTrackProvider.fetchPastMotionsByDate(
      date,
    );
    return this.buildVotesFromMotions([...activeMotions, ...pastMotions]);
  }

  async collectNewAndRefresh(refreshIds: number[]) {
    const contract = await this.easyTrackProvider.getContract(
      EASYTRACK_CONTRACT_ADDRESS,
      EASYTRACK_CONTRACT_ABI,
    );
    const activeMotions = await contract.getMotions();
    const pastMotions = await this.easyTrackProvider.fetchPastMotionsByIds(
      refreshIds,
    );
    return this.buildVotesFromMotions([...activeMotions, ...pastMotions]);
  }

  async buildVotesFromMotions(motions) {
    const votes: VoteEntity[] = [];
    for (const motion of [...motions].sort((v1, v2) => v1.id - v2.id)) {
      const motionProgress = await this.easyTrackProvider.getMotionProgress(
        motion.objectionsThreshold,
        motion.objectionsAmount,
      );
      const eventInfo = await this.eventCollector.getEventInfo(motion.id);
      const voteEntity: VoteEntity = {
        startDate: formatDate(Number(motion.startDate) * 1000),
        endDate: formatDate(
          (Number(motion.startDate) + Number(motion.duration)) * 1000,
        ),
        executionEndDate: formatDate(eventInfo.executionEndDate),
        type: await getEasyTrackType(motion.evmScriptFactory),
        description: await this.descriptionCollector.getMotionDescription(
          motion.evmScriptFactory,
          eventInfo.evmScriptCallData,
        ),
        link: await templateMotionLink(motion.id),
        source: VoteSources.easyTrack,
        status: eventAndDurationInfoToStatus(
          eventInfo,
          Number(motion.startDate),
          Number(motion.duration),
        ),
        name: `#${motion.id}`,
        objectionsAmount: motionProgress.objectionsAmount,
        objectionsThreshold: motionProgress.thresholdAmount,
      };
      votes.push(voteEntity);
    }
    return votes;
  }
}
