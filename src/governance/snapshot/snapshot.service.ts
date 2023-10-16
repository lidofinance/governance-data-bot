import { Injectable } from '@nestjs/common';
import { GraphqlProposal, SnapshotGraphqlService } from './snapshot.graphql.service';
import { VoteEntity, VoteSources, VoteStatus } from '../vote.entity';
import {
  abbreviateNumber,
  dateToUtc,
  threeHoursAgo,
  proposalStateToVoteStatus,
  uniqueProposals,
} from './snapshot.helpers';
import { formatDate } from '../governance.utils';
import * as _ from 'lodash';
import { ConfigService } from '../../common/config';

const MAX_PAST_DAYS_PROPOSALS_FETCH = 14;
const VOTE_STARTED_TITLE = '## Snapshot vote started\n';
const VOTE_ENDED_TITLE = '## Snapshot vote ended\n';
const LDO_TOTAL_SUPPLY = 100e7;
const LDO_5_PERCENT_QUORUM = 0.05 * LDO_TOTAL_SUPPLY;

@Injectable()
export class SnapshotService {
  constructor(
    private snapshotGraphqlService: SnapshotGraphqlService,
    private configService: ConfigService,
  ) {}

  async collectByMaxPastDays() {
    const date =
      (new Date().setDate(new Date().getDate() - MAX_PAST_DAYS_PROPOSALS_FETCH) / 1000) | 0;
    const activeProposals = await this.snapshotGraphqlService.getActiveProposals();
    const pastProposals = await this.snapshotGraphqlService.getPastProposalsByDate(date);
    const proposals = uniqueProposals([...activeProposals, ...pastProposals]);
    return this.buildVotesFromProposals(proposals);
  }

  async collectNewAndRefresh(refreshIds: string[]) {
    const activeProposals = await this.snapshotGraphqlService.getActiveProposals();
    const pastProposals = await this.snapshotGraphqlService.getPastProposalsByIds(refreshIds);
    const proposals = uniqueProposals([...activeProposals, ...pastProposals]);
    return this.buildVotesFromProposals(proposals);
  }

  async buildVotesFromProposals(proposals: GraphqlProposal[]): Promise<VoteEntity[]> {
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
        votersNumber: proposal.votes,
        choice1: proposal.choices[0] === undefined ? '' : proposal.choices[0],
        choice2: proposal.choices[1] === undefined ? '' : proposal.choices[1],
        choice3: proposal.choices[2] === undefined ? '' : proposal.choices[2],
        flagged: proposal.flagged
      });
    }
    return votes;
  }

  private getMaxChoice(vote: VoteEntity): string {
    const choiceResults = {
      [vote.choice1]: vote.result1,
      [vote.choice2]: vote.result2,
      [vote.choice3]: vote.result3 ?? 0,
    };
    return Object.keys(choiceResults).reduce((a, b) =>
      choiceResults[a] > choiceResults[b] ? a : b,
    );
  }

  hasQuorum(vote: VoteEntity): boolean {
    const percent =
      Math.round(LDO_5_PERCENT_QUORUM - vote.result1 - vote.result2 - (vote.result3 ?? 0)) /
      1e5 /
      10000;
    return percent < 0;
  }

  async getChangesMessage(
    previousVotes: VoteEntity[],
    currentVote: VoteEntity,
  ): Promise<string | undefined> {
    const noneToActive = () =>
      !previousVote &&
      currentVote.status == VoteStatus.active &&
      new Date(currentVote.startDate) > threeHoursAgo;
    const pendingToActive = () =>
      previousVote.status == VoteStatus.pending && currentVote.status == VoteStatus.active;
    const activeToFailedByQuorum = () => {
      return (
        previousVote.status == VoteStatus.active &&
        currentVote.status == VoteStatus.closed &&
        !this.hasQuorum(currentVote)
      );
    };
    const activeToSuccess = () => {
      const successChoices = this.configService.get('SNAPSHOT_SUCCESS_CHOICES').split(',');
      return (
        previousVote.status == VoteStatus.active &&
        currentVote.status == VoteStatus.closed &&
        successChoices.some((choice) =>
          this.getMaxChoice(currentVote).toLowerCase().startsWith(choice),
        )
      );
    };
    const activeToAgainst = () => {
      const againstChoices = this.configService.get('SNAPSHOT_AGAINST_CHOICES').split(',');
      return (
        previousVote.status == VoteStatus.active &&
        currentVote.status == VoteStatus.closed &&
        againstChoices.some((choice) =>
          this.getMaxChoice(currentVote).toLowerCase().startsWith(choice),
        )
      );
    };
    const activeToClosed = () => {
      return previousVote.status == VoteStatus.active && currentVote.status == VoteStatus.closed;
    };
    const previousVote = previousVotes.find((item) => item.link == currentVote.link);
    if (noneToActive()) {
      return this.getStartMessage(currentVote);
    }
    if (!previousVote) return;
    if (pendingToActive()) {
      return this.getStartMessage(currentVote);
    }
    if (activeToFailedByQuorum()) {
      return this.getFailedMessageWithoutQuorum(currentVote);
    }
    if (activeToSuccess()) {
      return this.getSuccessMessage(currentVote);
    }
    if (activeToAgainst()) {
      return this.getFailedMessageVotedAgainst(currentVote);
    }
    if (activeToClosed()) {
      return this.getClosedMessage(currentVote);
    }
  }

  private getResultMessage(vote: VoteEntity) {
    const resultMessage = (choice, result) =>
      result ? `**${choice}**: ${abbreviateNumber(result)} LDO\n` : '';
    return (
      'The results are:\n' +
      resultMessage(vote.choice1, vote.result1) +
      resultMessage(vote.choice2, vote.result2) +
      resultMessage(vote.choice3, vote.result3)
    );
  }

  private getStartMessage(vote: VoteEntity) {
    const options = [
      `The [${vote.name}](${vote.link}) Snapshot has started! ` +
        `Please cast your votes before ${dateToUtc(vote.endDate)} 🙏`,
      `Please get your wallets ready to cast a vote ✅, the [${vote.name}](${vote.link}) ` +
        `Snapshot has started! The Snapshots ends on ${dateToUtc(vote.endDate)}.`,
      `We’re starting the [${vote.name}](${vote.link}) Snapshot, active till ` +
        `${dateToUtc(vote.endDate)} . Please don’t forget to cast your vote!`,
    ];
    return VOTE_STARTED_TITLE + _.sample(options);
  }

  private getSuccessMessage(vote: VoteEntity) {
    const options = [
      `The [${vote.name}](${vote.link}) Snapshot has passed! 🥳`,
      `The [${vote.name}](${vote.link}) Snapshot has reached a quorum and completed successfully!`,
      `Thank you all who participated in the [${vote.name}](${vote.link}) Snapshot, the proposal passed! 🙏`,
    ];
    return VOTE_ENDED_TITLE + _.sample(options) + '\n' + this.getResultMessage(vote);
  }

  private getFailedMessageWithoutQuorum(vote: VoteEntity) {
    const options = [
      `The [${vote.name}](${vote.link}) Snapshot hadn’t reached a quorum. 😔`,
      `Unfortunately, the [${vote.name}](${vote.link}) Snapshot hadn’t reached a quorum. ⛔`,
      `The [${vote.name}](${vote.link}) Snapshot was missing some of your votes 
      necessary to reach a quorum and failed, unfortunately. 😢`,
    ];
    return VOTE_ENDED_TITLE + _.sample(options) + '\n' + this.getResultMessage(vote);
  }

  private getFailedMessageVotedAgainst(vote: VoteEntity) {
    const options = [
      `The DAO decided to vote against the [${vote.name}](${vote.link}) proposal. ✋🚫`,
      `The [${vote.name}](${vote.link}) proposal was rejected by Lido DAO. 🚫`,
      `The [${vote.name}](${vote.link}) proposal was rejected by Lido DAO. 🚫 
      Please consider gathered feedback and the proposal reworking.`,
    ];
    return VOTE_ENDED_TITLE + _.sample(options) + '\n' + this.getResultMessage(vote);
  }

  private getClosedMessage(vote: VoteEntity) {
    const options = [
      `The [${vote.name}](${vote.link}) Snapshot vote concluded!`,
      `The [${vote.name}](${vote.link}) Snapshot has reached a quorum and completed!`,
      `Thank you all who participated in [${vote.name}](${vote.link}) Snapshot, we reached a quorum! 🙏`,
    ];
    return VOTE_ENDED_TITLE + _.sample(options) + '\n' + this.getResultMessage(vote);
  }
}
