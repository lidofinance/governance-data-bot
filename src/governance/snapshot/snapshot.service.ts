import { Injectable } from '@nestjs/common';
import {
  GraphqlProposal,
  SnapshotGraphqlService,
} from './snapshot.graphql.service';
import { formatDate, VoteEntity, VoteSources } from '../vote.entity';
import { proposalStateToVoteStatus, uniqueProposals } from './snapshot.helpers';

const MAX_PAST_DAYS_PROPOSALS_FETCH = 14;

@Injectable()
export class SnapshotService {
  constructor(private snapshotGraphqlService: SnapshotGraphqlService) {}
  async collectByMaxPastDays() {
    const date =
      (new Date().setDate(
        new Date().getDate() - MAX_PAST_DAYS_PROPOSALS_FETCH,
      ) /
        1000) |
      0;
    const activeProposals =
      await this.snapshotGraphqlService.getActiveProposals();
    const pastProposals =
      await this.snapshotGraphqlService.getPastProposalsByDate(date);
    const proposals = uniqueProposals([...activeProposals, ...pastProposals]);
    return this.buildVotesFromProposals(proposals);
  }

  async collectByIds(ids: string[]) {
    const activeProposals =
      await this.snapshotGraphqlService.getActiveProposals();
    const pastProposals =
      await this.snapshotGraphqlService.getPastProposalsByIds(ids);
    const proposals = uniqueProposals([...activeProposals, ...pastProposals]);
    return this.buildVotesFromProposals(proposals);
  }

  async buildVotesFromProposals(
    proposals: GraphqlProposal[],
  ): Promise<VoteEntity[]> {
    const votes: VoteEntity[] = [];
    for (const proposal of proposals) {
      votes.push({
        source: VoteSources.snapshot,
        status: proposalStateToVoteStatus(proposal),
        startDate: formatDate(Number(proposal.start) * 1000),
        endDate: formatDate(Number(proposal.end) * 1000),
        link: proposal.link,
        name: proposal.title,
        result1: proposal.scores[0] === undefined ? null : proposal.scores[0],
        result2: proposal.scores[1] === undefined ? null : proposal.scores[1],
        result3: proposal.scores[2] === undefined ? null : proposal.scores[2],
        proposalType: proposal.type,
        discussion: proposal.discussion || null,
      });
    }
    return votes;
  }
}
