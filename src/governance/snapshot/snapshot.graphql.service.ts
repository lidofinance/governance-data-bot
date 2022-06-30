import { PrometheusService } from '../../common/prometheus';
import { Injectable } from '@nestjs/common';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { ConfigService } from '../../common/config';
import { SnapshotConfig, SnapshotNetworkConfig } from './snapshot.config';
import fetch from 'node-fetch';

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

@Injectable()
export class SnapshotGraphqlService extends GraphqlService {
  public config: SnapshotNetworkConfig;
  constructor(
    private prometheusService: PrometheusService,
    private configService: ConfigService,
    private snapshotConfig: SnapshotConfig,
  ) {
    super();
    this.config = snapshotConfig.render();
  }

  async query(url, query) {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: SnapshotGraphqlService.name,
    });
    return await super.query(url, query);
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
          space: "${this.config.snapshotSpaceId}"
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
    return (
      await this.query(
        this.configService.get('SNAPSHOT_PROPOSALS_GRAPHQL_URL'),
        query,
      )
    ).proposals;
  }

  async getActualVotes(proposalId): Promise<
    {
      scores: any;
      vp;
      choice;
      voter;
    }[]
  > {
    const query = `query Votes {
      votes(
        first: 10000,
        skip: 0,
        where: {
          space: "${this.config.snapshotSpaceId}"
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
    return (
      await this.query(
        this.configService.get('SNAPSHOT_PROPOSALS_GRAPHQL_URL'),
        query,
      )
    ).votes;
  }

  private async fillActualVotesAndScores(proposals: GraphqlProposal[]) {
    for (const proposal of proposals) {
      const votes = await this.getActualVotes(proposal.id);
      const voters = votes.map((vote) => vote.voter);
      const scores = await this.getScores(
        this.config.snapshotSpaceId,
        proposal.strategies,
        proposal.network,
        voters,
        parseInt(proposal.snapshot),
      );
      votes.map((vote: any) => {
        vote.scores = proposal.strategies.map(
          (strategy, i) => scores[i][vote.voter] || 0,
        );
      });
      proposal.votes = votes.length;
      proposal.scores = [];
      votes.map((vote) => {
        if (!proposal.scores[vote.choice - 1])
          proposal.scores[vote.choice - 1] = 0;
        proposal.scores[vote.choice - 1] += vote.scores.reduce(
          (sum, current) => sum + current,
        );
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
    try {
      const params = {
        space,
        network,
        snapshot,
        strategies,
        addresses,
      };
      const res = await fetch(this.configService.get('SNAPSHOT_SCORES_API'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params }),
      });
      const obj = await res.json();
      return obj.result.scores;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
