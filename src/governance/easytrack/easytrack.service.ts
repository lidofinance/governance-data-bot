import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import {
  EASYTRACK_CONTRACT_ABI,
  EASYTRACK_CONTRACT_ADDRESS,
} from './easytrack.constants';
import { formatDate, VoteEntity, VoteSources } from '../vote.entity';
import {
  eventAndDurationInfoToStatus,
  getEasytrackType,
  templateMotionLink,
} from './easytrack.helpers';
import { EasytrackDescriptionCollector } from './easytrack.description.collector';
import { EasytrackEventCollector } from './easytrack.event.collector';
import { EasytrackProvider } from './easytrack.provider';
import { EasytrackProviderService } from './easytrack.provider.service';

const MAX_PAST_DAYS_MOTIONS_FETCH = 14;

@Injectable()
export class EasytrackService {
  private readonly descriptionCollector: EasytrackDescriptionCollector;
  private readonly eventCollector: EasytrackEventCollector;
  private readonly easytrackProvider: EasytrackProvider;

  constructor(
    protected readonly configService: ConfigService,
    private provider: EasytrackProviderService,
  ) {
    this.easytrackProvider = new EasytrackProvider(provider);
    this.descriptionCollector = new EasytrackDescriptionCollector(provider);
    this.eventCollector = new EasytrackEventCollector(provider);
  }

  async collectByMaxPastDays(): Promise<VoteEntity[]> {
    // TODO motions should be fetched from events and rpc node historic data
    const contract = await this.easytrackProvider.getContract(
      EASYTRACK_CONTRACT_ADDRESS,
      EASYTRACK_CONTRACT_ABI,
    );
    const activeMotions = await contract.getMotions();
    const date =
      (new Date().setDate(new Date().getDate() - MAX_PAST_DAYS_MOTIONS_FETCH) /
        1000) |
      0;
    const pastMotions = await this.easytrackProvider.fetchPastMotionsByDate(
      date,
    );
    return this.buildVotesFromMotions([...activeMotions, ...pastMotions]);
  }

  async collectByIds(ids: number[]) {
    const contract = await this.easytrackProvider.getContract(
      EASYTRACK_CONTRACT_ADDRESS,
      EASYTRACK_CONTRACT_ABI,
    );
    const activeMotions = await contract.getMotions();
    const pastMotions = await this.easytrackProvider.fetchPastMotionsByIds(ids);
    return this.buildVotesFromMotions([...activeMotions, ...pastMotions]);
  }

  async buildVotesFromMotions(motions) {
    const votes: VoteEntity[] = [];
    for (const motion of [...motions].sort((v1, v2) => v1.id - v2.id)) {
      const motionProgress = await this.easytrackProvider.getMotionProgress(
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
        type: await getEasytrackType(motion.evmScriptFactory),
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
