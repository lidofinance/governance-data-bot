import { Injectable } from '@nestjs/common';
import { EASYTRACK_CONTRACT_ABI } from './easy-track.constants';
import { VoteEntity, VoteSources } from '../vote.entity';
import {
  eventAndDurationInfoToStatus,
  getEasyTrackType,
} from './easy-track.helpers';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';
import { EasyTrackProvider } from './easy-track.provider';
import { formatDate } from '../governance.utils';
import { EasyTrackConfig } from './easy-track.config';

const MAX_PAST_DAYS_MOTIONS_FETCH = 14;

@Injectable()
export class EasyTrackService {
  constructor(
    private readonly descriptionCollector: EasyTrackDescriptionCollector,
    private readonly eventCollector: EasyTrackEventCollector,
    private readonly easyTrackProvider: EasyTrackProvider,
    private config: EasyTrackConfig,
  ) {}

  private motionLink(motionId) {
    return this.config.get('easyTrackBaseUrl') + motionId + '/';
  }

  async collectByMaxPastDays(): Promise<VoteEntity[]> {
    // TODO motions should be fetched from events and rpc node historic data
    const contract = await this.easyTrackProvider.getContract(
      this.config.get('easyTrackContract'),
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
      this.config.get('easyTrackContract'),
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
        type: await getEasyTrackType(
          motion.evmScriptFactory,
          this.config.get('factoryToMotionType'),
        ),
        description: await this.descriptionCollector.getMotionDescription(
          motion.evmScriptFactory,
          eventInfo.evmScriptCallData,
        ),
        link: this.motionLink(motion.id),
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
