import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { AragonProvider, AragonVote } from './aragon.provider';
import { VoteEntity, VoteSources } from '../vote.entity';
import {
  aragonVoteStatus,
  formatDescription,
  templateAdditionalVoteLink,
  templateVoteLink,
} from './aragon.helpers';
import { utils } from 'ethers';
import { formatDate } from '../governance.utils';

const MAX_PAST_DAYS_VOTES_FETCH = 14;

@Injectable()
export class AragonService {
  constructor(
    private configService: ConfigService,
    private aragonProvider: AragonProvider,
  ) {}

  async collectByMaxPastDays() {
    const date =
      (new Date().setDate(new Date().getDate() - MAX_PAST_DAYS_VOTES_FETCH) /
        1000) |
      0;
    const votes = await this.aragonProvider.getVotesByDate(date);
    return this.buildVotesFromAragonVotes(votes);
  }

  async collectNewAndRefresh(refreshIds: number[]) {
    const votes = await this.aragonProvider.getVotesByIds(refreshIds);
    return this.buildVotesFromAragonVotes(votes);
  }

  async buildVotesFromAragonVotes(aragonVotes: AragonVote[]) {
    const votes: VoteEntity[] = [];
    for (const aragonVote of aragonVotes) {
      votes.push({
        source: VoteSources.aragon,
        startDate: formatDate(Number(aragonVote.startDate) * 1000),
        endDate: formatDate(
          Number(aragonVote.startDate.add(aragonVote.voteTime)) * 1000,
        ),
        executionEndDate: aragonVote.executionBlock
          ? formatDate(
              await this.aragonProvider.getBlockDate(aragonVote.executionBlock),
            )
          : null,
        link: templateVoteLink(aragonVote.id),
        additionalLink: templateAdditionalVoteLink(aragonVote.id),
        name: '#' + aragonVote.id,
        description: formatDescription(aragonVote.metadata),
        status: aragonVoteStatus(aragonVote),
        result1: Number(utils.formatEther(aragonVote.yea)),
        result2: Number(utils.formatEther(aragonVote.nay)),
      });
    }
    return votes;
  }
}
