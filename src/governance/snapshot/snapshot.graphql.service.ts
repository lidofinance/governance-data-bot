import { PrometheusService } from '../../common/prometheus';
import { Injectable } from '@nestjs/common';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { ConfigService } from '../../common/config';
import { SnapshotConfig } from './snapshot.config';
import { FetchService } from '@lido-nestjs/fetch';

const RETRIES_COUNT = 5;
const RETRY_PAUSE = 3000;

export interface GraphqlProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  strategies: { name; network; params }[];
  state: string;
  network: string;
  author: string;
  link: string;
  scores: number[];
  type: string;
  discussion: string;
  votes: number;
}

export interface GraphqlVote {
  scores: any;
  vp;
  choice;
  voter;
}

@Injectable()
export class SnapshotGraphqlService extends GraphqlService {
  constructor(
    private prometheusService: PrometheusService,
    private configService: ConfigService,
    private config: SnapshotConfig,
    fetchService: FetchService,
  ) {
    super(fetchService);
  }

  async query<T>(query) {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: SnapshotGraphqlService.name,
    });
    return await super.query<T>(query);
  }

  async getActiveProposals() {
    const proposals = await this.getProposals('state: "active"');
    await this.fillActualVotesAndScores(proposals);
    return proposals;
  }

  async getPastProposalsByDate(date: number) {
    const proposals = await this.getProposals(`start_gt: ${date}`);
    await this.fillActualVotesAndScores(proposals);
    return proposals;
  }

  async getPastProposalsByIds(ids: string[]) {
    if (ids.length === 0) return [];
    const proposals = await this.getProposals(`id_in: ${JSON.stringify(ids)}`);
    await this.fillActualVotesAndScores(proposals);
    return proposals;
  }

  async getProposals(whereCondition: string): Promise<GraphqlProposal[]> {
    const query = `query Proposals {
      proposals(
        first: 100,
        skip: 0,
        where: {
          space: "${this.config.get('snapshotSpaceId')}"
          ${whereCondition}
        },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        strategies {
          name
          network
          params
        }
        network
        state
        author
        link
        scores
        type
        discussion
        votes
      }
    }`;
    return (await this.query<{ proposals: GraphqlProposal[] }>(query)).proposals.filter(
      (proposal) =>
        !this.configService
          .get('SNAPSHOT_SPAM_ADDRESSES')
          .toLowerCase()
          .split(',')
          .includes(proposal.author.toLowerCase()),
    );
  }

  async getActualVotes(proposalId): Promise<
    {
      scores: any;
      vp;
      choice;
      voter;
    }[]
  > {
    const finalVotes = [];
    let votes = [];
    const first = 1000;
    let skip = 0;
    do {
      votes = await this.votesQuery(proposalId, first, skip);
      finalVotes.push(...votes);
      skip += first;
    } while (votes.length >= first);
    return finalVotes;
  }

  async votesQuery(proposalId, first = 1000, skip = 0): Promise<GraphqlVote[]> {
    const query = `query Votes {
      votes(
        first: ${first},
        skip: ${skip},
        where: {
          space: "${this.config.get('snapshotSpaceId')}"
          proposal: "${proposalId}"
        },
        orderBy: "created",
        orderDirection: desc
      ) {
          vp
          choice
          created
          voter
          vp_by_strategy
      }
    }`;
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: SnapshotGraphqlService.name,
    });
    return (await this.query<{ votes: GraphqlVote[] }>(query)).votes;
  }

  private async fillActualVotesAndScores(proposals: GraphqlProposal[]) {
    for (const proposal of proposals) {
      const votes = await this.getActualVotes(proposal.id);
      const voters = votes.map((vote) => vote.voter);
      const scores = await this.getScores(
        this.config.get('snapshotSpaceId'),
        proposal.strategies,
        proposal.network,
        voters,
        parseInt(proposal.snapshot),
      );
      votes.map((vote: any) => {
        vote.scores = proposal.strategies.map((strategy, i) => scores[i][vote.voter] || 0);
      });
      proposal.votes = votes.length;
      proposal.scores = [];
      votes.map((vote) => {
        if (!proposal.scores[vote.choice - 1]) proposal.scores[vote.choice - 1] = 0;
        proposal.scores[vote.choice - 1] += vote.scores.reduce((sum, current) => sum + current);
      });
    }
  }

  private async getScores(
    space: string,
    strategies: any[],
    network: string,
    addresses: string[],
    snapshot: number | string = 'latest',
  ) {
    const params = {
      space,
      network,
      snapshot,
      strategies,
      addresses,
    };
    const res: { result: { scores: any } } = await this.fetchService.fetchJson(
      this.configService.get('SNAPSHOT_SCORES_API'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params }),
        retryPolicy: {
          attempts: RETRIES_COUNT,
          delay: RETRY_PAUSE,
        },
      },
    );
    return res.result.scores;
  }
}
